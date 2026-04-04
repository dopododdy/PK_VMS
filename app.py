"""
VASD Agent v6 – Thai ID Card Reader + Direct Printer (No QZ Tray)
=================================================================
Endpoints
---------
GET  /read       – Read Thai national ID card via PCSC smartcard reader.
GET  /printers   – List all printers installed on this machine.
POST /print      – Print an HTML document directly to a named printer.
                   Body (JSON): { html, printer, width, height }
                   width/height are in millimetres (default 80 × 297).

Printer strategy (tried in order)
-----------------------------------
Windows
  1. pdfkit (wkhtmltopdf) → PDF → win32api.ShellExecute "printto"
  2. Chrome headless       → PDF → win32api.ShellExecute "printto"
  3. SumatraPDF silent print (if SumatraPDF.exe is found)
Linux / macOS
  1. wkhtmltopdf → PDF → lp (CUPS)
  2. Chrome/Chromium headless → PDF → lp (CUPS)
"""

import os
import uuid
import time
import threading
import subprocess
import tempfile
import platform
from pathlib import Path

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

# ── Optional dependencies ─────────────────────────────────────────────────────

try:
    from smartcard.System import readers as sc_readers
    SMARTCARD_AVAILABLE = True
except ImportError:
    SMARTCARD_AVAILABLE = False
    print("[!] pyscard not installed – /read endpoint disabled")

try:
    import win32print
    import win32api
    WIN32_AVAILABLE = True
except ImportError:
    WIN32_AVAILABLE = False

# ── Flask app ─────────────────────────────────────────────────────────────────

app = Flask(__name__)
CORS(app)

# ── Smartcard helpers ─────────────────────────────────────────────────────────

SELECT_APP = [
    0x00, 0xA4, 0x04, 0x00, 0x08,
    0xA0, 0x00, 0x00, 0x00, 0x54, 0x48, 0x00, 0x01,
]


def _send_apdu(connection, apdu):
    """Transmit an APDU and auto-collect continuation blocks (SW1=0x61)."""
    data, sw1, sw2 = connection.transmit(apdu)
    while sw1 == 0x61:
        more, sw1, sw2 = connection.transmit([0x00, 0xC0, 0x00, 0x00, sw2])
        data += more
    return data, sw1, sw2


def _thai_decode(data):
    if not data:
        return ""
    try:
        clean = bytes([b for b in data if b not in (0x00, 0xFF)])
        return clean.decode("tis-620", errors="ignore").strip()
    except Exception:
        return ""


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/read", methods=["GET"])
def read_card():
    """Read Thai national ID card data."""
    if not SMARTCARD_AVAILABLE:
        return jsonify({"status": "error", "message": "ไม่มีไลบรารี pyscard"}), 500
    try:
        all_readers = sc_readers()
        if not all_readers:
            return jsonify({"status": "error", "message": "ไม่พบเครื่องอ่านบัตร"}), 404

        connection = all_readers[0].createConnection()
        connection.connect()

        # Select Thai eID application
        _send_apdu(connection, SELECT_APP)

        # CID (13-digit national ID number)
        cid_data, _, _ = _send_apdu(
            connection, [0x80, 0xB0, 0x00, 0x04, 0x02, 0x00, 0x0D]
        )
        cid = "".join(chr(b) for b in cid_data if 48 <= b <= 57)
        print(f"[*] CID: {cid}")

        # Full name (Thai)
        name_data, _, _ = _send_apdu(
            connection, [0x80, 0xB0, 0x00, 0x11, 0x02, 0x00, 0x64]
        )
        name_raw = _thai_decode(name_data)
        print(f"[*] Name: {name_raw}")
        parts = [p.strip() for p in name_raw.split("#") if p.strip()]
        prefix = parts[0] if len(parts) > 0 else ""
        fname = parts[1] if len(parts) > 1 else ""
        lname = parts[-1] if len(parts) > 1 else ""

        # Address
        addr_data, _, _ = _send_apdu(
            connection, [0x80, 0xB0, 0x15, 0x79, 0x02, 0x00, 0x64]
        )
        address = _thai_decode(addr_data).replace("#", " ")
        print(f"[*] Addr: {address}")

        if not cid:
            return (
                jsonify({"status": "error", "message": "ขยับบัตรให้แน่น แล้วลองกดอีกครั้ง"}),
                500,
            )

        return jsonify({
            "status": "success",
            "data": {
                "cid": cid,
                "prefix": prefix,
                "firstname": fname,
                "lastname": lname,
                "address": address,
            },
        })

    except Exception as exc:
        print(f"[!] /read error: {exc}")
        return jsonify({"status": "error", "message": "เกิดข้อผิดพลาดในการอ่านบัตร"}), 500


@app.route("/line/push", methods=["POST"])
def line_push():
    """
    Proxy: push a LINE Messaging API message to a specific user.

    Expected JSON body:
      {
        "channel_access_token": "<long-lived channel access token>",
        "to":      "<LINE user ID>",
        "messages": [ { "type": "text", "text": "..." }, ... ]
      }
    """
    body = request.get_json(silent=True) or {}
    token = body.pop("channel_access_token", "").strip()
    if not token:
        return jsonify({"status": "error", "message": "ไม่พบ Channel Access Token"}), 400
    if not body.get("to"):
        return jsonify({"status": "error", "message": "ไม่พบ User ID ปลายทาง"}), 400
    if not body.get("messages"):
        return jsonify({"status": "error", "message": "ไม่พบข้อความที่จะส่ง"}), 400

    try:
        resp = requests.post(
            "https://api.line.me/v2/bot/message/push",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=body,
            timeout=15,
        )
        return jsonify(resp.json()), resp.status_code
    except Exception as exc:
        print(f"[!] /line/push error: {exc}")
        return jsonify({"status": "error", "message": "เกิดข้อผิดพลาดในการเชื่อมต่อ LINE API"}), 500


@app.route("/line/broadcast", methods=["POST"])
def line_broadcast():
    """
    Proxy: broadcast a LINE Messaging API message to all followers.

    Expected JSON body:
      {
        "channel_access_token": "<long-lived channel access token>",
        "messages": [ { "type": "text", "text": "..." }, ... ]
      }
    """
    body = request.get_json(silent=True) or {}
    token = body.pop("channel_access_token", "").strip()
    if not token:
        return jsonify({"status": "error", "message": "ไม่พบ Channel Access Token"}), 400
    if not body.get("messages"):
        return jsonify({"status": "error", "message": "ไม่พบข้อความที่จะส่ง"}), 400

    try:
        resp = requests.post(
            "https://api.line.me/v2/bot/message/broadcast",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=body,
            timeout=15,
        )
        return jsonify(resp.json()), resp.status_code
    except Exception as exc:
        print(f"[!] /line/broadcast error: {exc}")
        return jsonify({"status": "error", "message": "เกิดข้อผิดพลาดในการเชื่อมต่อ LINE API"}), 500


# ── Printer routes ────────────────────────────────────────────────────────────
@app.route("/printers", methods=["GET"])
def list_printers():
    """Return a list of printer names available on this machine."""
    try:
        names = _get_printer_names()
        return jsonify({"status": "success", "printers": names})
    except Exception as exc:
        print(f"[!] /printers error: {exc}")
        return jsonify({"status": "error", "message": "ไม่สามารถอ่านรายชื่อเครื่องพิมพ์ได้"}), 500


@app.route("/print", methods=["POST"])
def print_html():
    """
    Print an HTML document directly to a named printer without QZ Tray.

    Expected JSON body:
      {
        "html":    "<full HTML document string>",
        "printer": "Printer Display Name",   // optional; uses default if omitted
        "width":   80,                        // paper width  in mm (default 80)
        "height":  297                        // paper height in mm (default 297)
      }
    """
    body = request.get_json(silent=True) or {}
    html_content = body.get("html", "")
    printer_name = body.get("printer", "")
    width_mm = float(body.get("width", 80))
    height_mm = float(body.get("height", 297))

    if not html_content:
        return jsonify({"status": "error", "message": "ไม่พบ HTML content"}), 400

    # Validate printer_name against installed printers to prevent command injection
    if printer_name:
        try:
            known = _get_printer_names()
        except Exception:
            known = []
        if known and printer_name not in known:
            return jsonify({"status": "error", "message": "ไม่พบเครื่องพิมพ์ที่ระบุ"}), 400

    try:
        _do_print(html_content, printer_name, width_mm, height_mm)
        return jsonify({"status": "success", "message": "ส่งงานพิมพ์แล้ว"})
    except Exception as exc:
        print(f"[!] /print error: {exc}")
        return jsonify({"status": "error", "message": "ไม่สามารถส่งงานพิมพ์ได้"}), 500


# ── Printer helpers ───────────────────────────────────────────────────────────

def _get_printer_names():
    """Return a sorted list of installed printer names."""
    if WIN32_AVAILABLE:
        flags = win32print.PRINTER_ENUM_LOCAL | win32print.PRINTER_ENUM_CONNECTIONS
        return sorted(p[2] for p in win32print.EnumPrinters(flags))

    # Linux / macOS – use lpstat
    try:
        result = subprocess.run(
            ["lpstat", "-a"], capture_output=True, text=True, timeout=5
        )
        return sorted(
            line.split()[0] for line in result.stdout.splitlines() if line.strip()
        )
    except FileNotFoundError:
        return []


def _do_print(html_content: str, printer_name: str, width_mm: float, height_mm: float):
    """
    Convert HTML to PDF and send to the printer.
    Raises an exception if every strategy fails.
    """
    pdf_path = _html_to_pdf(html_content, width_mm, height_mm)
    try:
        _send_pdf_to_printer(pdf_path, printer_name)
    finally:
        # Schedule deletion after the OS has had time to spool the job
        _schedule_delete(pdf_path, delay=60)


def _html_to_pdf(html_content: str, width_mm: float, height_mm: float) -> str:
    """
    Convert HTML to a PDF file (saved in system temp dir).
    Returns the absolute path to the PDF.
    Tries wkhtmltopdf first, then Chrome/Chromium headless.
    """
    tmp_dir = tempfile.gettempdir()
    job_id = uuid.uuid4().hex
    html_path = os.path.join(tmp_dir, f"pk_print_{job_id}.html")
    pdf_path = os.path.join(tmp_dir, f"pk_print_{job_id}.pdf")

    with open(html_path, "w", encoding="utf-8") as fh:
        fh.write(html_content)
    _schedule_delete(html_path, delay=60)

    # --- Strategy A: pdfkit (wraps wkhtmltopdf) ---
    try:
        import pdfkit  # type: ignore

        opts = {
            "page-width": f"{width_mm}mm",
            "page-height": f"{height_mm}mm",
            "margin-top": "0mm",
            "margin-right": "0mm",
            "margin-bottom": "0mm",
            "margin-left": "0mm",
            "encoding": "UTF-8",
            "disable-smart-shrinking": "",
            "enable-local-file-access": "",
        }
        pdfkit.from_file(html_path, pdf_path, options=opts)
        if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0:
            print("[*] PDF via pdfkit")
            return pdf_path
    except Exception as exc:
        print(f"[~] pdfkit failed ({exc}), trying next strategy…")

    # --- Strategy B: wkhtmltopdf directly ---
    wk = _find_executable("wkhtmltopdf", [
        r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe",
        r"C:\Program Files (x86)\wkhtmltopdf\bin\wkhtmltopdf.exe",
        "/usr/local/bin/wkhtmltopdf",
        "/usr/bin/wkhtmltopdf",
    ])
    if wk:
        try:
            subprocess.run(
                [
                    wk,
                    "--page-width", f"{width_mm}mm",
                    "--page-height", f"{height_mm}mm",
                    "--margin-top", "0mm",
                    "--margin-right", "0mm",
                    "--margin-bottom", "0mm",
                    "--margin-left", "0mm",
                    "--encoding", "utf-8",
                    "--disable-smart-shrinking",
                    "--enable-local-file-access",
                    html_path,
                    pdf_path,
                ],
                check=True,
                timeout=30,
                capture_output=True,
            )
            if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0:
                print("[*] PDF via wkhtmltopdf")
                return pdf_path
        except Exception as exc:
            print(f"[~] wkhtmltopdf failed ({exc}), trying next strategy…")

    # --- Strategy C: Chrome / Chromium headless ---
    chrome = _find_executable("chrome", [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files\Chromium\Application\chrome.exe",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium-browser",
        "/usr/bin/chromium",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ])
    if chrome:
        try:
            width_in = width_mm / 25.4
            height_in = height_mm / 25.4
            file_url = Path(html_path).as_uri()
            subprocess.run(
                [
                    chrome,
                    "--headless=new",
                    "--disable-gpu",
                    "--no-sandbox",
                    f"--print-to-pdf={pdf_path}",
                    f"--paper-width={width_in:.4f}",
                    f"--paper-height={height_in:.4f}",
                    "--no-margins",
                    "--run-all-compositor-stages-before-draw",
                    file_url,
                ],
                check=True,
                timeout=30,
                capture_output=True,
            )
            if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0:
                print("[*] PDF via Chrome headless")
                return pdf_path
        except Exception as exc:
            print(f"[~] Chrome headless failed ({exc})")

    raise RuntimeError(
        "ไม่สามารถแปลง HTML เป็น PDF ได้ "
        "(ติดตั้ง wkhtmltopdf หรือ Google Chrome แล้วลองใหม่)"
    )


def _send_pdf_to_printer(pdf_path: str, printer_name: str):
    """Send a PDF file to the named printer (or the default printer if empty)."""
    if platform.system() == "Windows":
        _send_pdf_windows(pdf_path, printer_name)
    else:
        _send_pdf_cups(pdf_path, printer_name)


def _send_pdf_windows(pdf_path: str, printer_name: str):
    """Windows: use win32api.ShellExecute or SumatraPDF for silent printing."""
    # --- Strategy A: SumatraPDF (most reliable silent print) ---
    sumatra = _find_executable("SumatraPDF", [
        r"C:\Program Files\SumatraPDF\SumatraPDF.exe",
        r"C:\Program Files (x86)\SumatraPDF\SumatraPDF.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"SumatraPDF\SumatraPDF.exe"),
        os.path.join(os.environ.get("APPDATA", ""), r"SumatraPDF\SumatraPDF.exe"),
    ])
    if sumatra:
        try:
            cmd = [sumatra, "-print-settings", "fit", "-silent"]
            if printer_name:
                # printer_name is validated against installed printers before this call;
                # list-based subprocess does not perform shell interpolation.
                cmd += ["-print-to", printer_name]
            else:
                cmd += ["-print-to-default"]
            cmd.append(pdf_path)
            subprocess.run(cmd, check=True, timeout=30, capture_output=True)
            print(f"[*] Printed via SumatraPDF → {printer_name or '(default)'}")
            return
        except Exception as exc:
            print(f"[~] SumatraPDF failed ({exc}), trying ShellExecute…")

    # --- Strategy B: win32api.ShellExecute ---
    if WIN32_AVAILABLE:
        try:
            if printer_name:
                # ShellExecute "printto" expects the printer name in the lpParameters
                # argument.  Wrap in double-quotes and escape any embedded quotes.
                escaped = printer_name.replace('"', '\\"')
                win32api.ShellExecute(
                    0, "printto", pdf_path, f'"{escaped}"', ".", 0
                )
            else:
                win32api.ShellExecute(0, "print", pdf_path, None, ".", 0)
            print(f"[*] Printed via ShellExecute → {printer_name or '(default)'}")
            return
        except Exception as exc:
            print(f"[~] ShellExecute failed ({exc})")

    raise RuntimeError("ไม่สามารถส่งงานพิมพ์บน Windows ได้ (ติดตั้ง SumatraPDF หรือ pywin32)")


def _send_pdf_cups(pdf_path: str, printer_name: str):
    """Linux / macOS: use lp (CUPS) to print."""
    cmd = ["lp"]
    if printer_name:
        # printer_name is validated against installed printers before this call;
        # list-based subprocess does not perform shell interpolation.
        cmd += ["-d", printer_name]
    cmd.append(pdf_path)
    subprocess.run(cmd, check=True, timeout=15, capture_output=True)
    print(f"[*] Printed via CUPS lp → {printer_name or '(default)'}")


# ── Utility helpers ───────────────────────────────────────────────────────────

def _find_executable(name: str, candidate_paths: list) -> str | None:
    """
    Return the first existing path from candidate_paths, or search PATH
    for ``name`` on Unix-like systems.
    """
    for p in candidate_paths:
        if p and os.path.isfile(p):
            return p
    # Try PATH lookup (Linux/macOS)
    try:
        result = subprocess.run(
            ["which", name], capture_output=True, text=True, timeout=3
        )
        found = result.stdout.strip()
        if found and os.path.isfile(found):
            return found
    except Exception:
        pass
    return None


def _schedule_delete(path: str, delay: int = 60):
    """Delete a file after ``delay`` seconds in a background thread."""
    def _delete():
        time.sleep(delay)
        try:
            os.remove(path)
        except OSError:
            pass

    t = threading.Thread(target=_delete, daemon=True)
    t.start()


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("VASD Agent v6 (Direct Print, No QZ Tray) – Ready on http://127.0.0.1:8080")
    app.run(host="127.0.0.1", port=8080, debug=False)
