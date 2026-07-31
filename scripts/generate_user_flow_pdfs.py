#!/usr/bin/env python3
"""Generate mini-wireframe screen-flow PDFs for HealthStore user journeys."""

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit
from pathlib import Path
import math

OUT = Path("exports/user-flows")
OUT.mkdir(parents=True, exist_ok=True)

NHS_BLUE = HexColor("#005EB8")
NHS_DARK = HexColor("#003087")
NHS_GREEN = HexColor("#007F3B")
NHS_WARM = HexColor("#7A4800")
NHS_RED = HexColor("#DA291C")
BORDER = HexColor("#AEB7BD")
LINE = HexColor("#D8DDE0")
BG = HexColor("#F0F4F5")
SURFACE = HexColor("#FFFFFF")
TEXT = HexColor("#212B32")
MUTED = HexColor("#4C6272")
OFF = HexColor("#768692")
YELLOW = HexColor("#FFEB3B")
SOFT_BLUE = HexColor("#E8F4FC")
SOFT_GREEN = HexColor("#E6F4EA")
SOFT_RED = HexColor("#FDEBEA")
SOFT_GREY = HexColor("#F5F5F5")
SOFT_AMBER = HexColor("#FFF7E6")
WHITE = white

PAGE = landscape(A4)
W, H = PAGE


def wrap(c, text, font, size, max_w):
    return simpleSplit(text, font, size, max_w)


def rrect(c, x, y, w, h, r=4, fill=None, stroke=None, sw=1):
    c.saveState()
    p = c.beginPath()
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.arcTo(x + w - 2 * r, y, x + w, y + 2 * r, -90, 90)
    p.lineTo(x + w, y + h - r)
    p.arcTo(x + w - 2 * r, y + h - 2 * r, x + w, y + h, 0, 90)
    p.lineTo(x + r, y + h)
    p.arcTo(x, y + h - 2 * r, x + 2 * r, y + h, 90, 90)
    p.lineTo(x, y + r)
    p.arcTo(x, y, x + 2 * r, y + 2 * r, 180, 90)
    p.close()
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
    if fill and stroke:
        c.drawPath(p, fill=1, stroke=1)
    elif fill:
        c.drawPath(p, fill=1, stroke=0)
    else:
        c.drawPath(p, fill=0, stroke=1)
    c.restoreState()


def arrow(c, x1, y1, x2, y2, label=None, color=NHS_BLUE, dashed=False):
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(1.4)
    if dashed:
        c.setDash(3, 2)
    c.line(x1, y1, x2, y2)
    ang = math.atan2(y2 - y1, x2 - x1)
    size = 6
    p = c.beginPath()
    p.moveTo(x2, y2)
    p.lineTo(x2 - size * math.cos(ang - 0.4), y2 - size * math.sin(ang - 0.4))
    p.lineTo(x2 - size * math.cos(ang + 0.4), y2 - size * math.sin(ang + 0.4))
    p.close()
    c.setDash()
    c.drawPath(p, fill=1, stroke=0)
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        tw = c.stringWidth(label, "Helvetica", 6.5) + 8
        rrect(c, mx - tw / 2, my + 3, tw, 11, r=2, fill=WHITE, stroke=color, sw=0.8)
        c.setFillColor(color)
        c.setFont("Helvetica", 6.5)
        c.drawCentredString(mx, my + 5.5, label)
    c.restoreState()


def header(c, title, subtitle):
    c.setFillColor(NHS_BLUE)
    c.rect(0, H - 36, W, 36, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(18, H - 22, "NHS HealthStore · Screen flow")
    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(W - 18, H - 22, title)
    c.setFillColor(BG)
    c.rect(0, H - 56, W, 20, fill=1, stroke=0)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(18, H - 48, subtitle)


def footer(c, note=""):
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(18, 12, note or "Mini wireframes — interactions within the service")
    c.drawRightString(W - 18, 12, "Prototype")


def screen(c, x, y, w, h, step_n, title, url, paint_fn, badge=None, badge_color=NHS_BLUE):
    rrect(c, x, y, w, h, r=5, fill=SURFACE, stroke=BORDER, sw=1.2)
    c.setFillColor(BG)
    c.rect(x, y + h - 16, w, 16, fill=1, stroke=0)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(x, y + h - 16, x + w, y + h - 16)
    for i, col in enumerate([HexColor("#FF5F57"), HexColor("#FEBC2E"), HexColor("#28C840")]):
        c.setFillColor(col)
        c.circle(x + 8 + i * 8, y + h - 8, 2.2, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.roundRect(x + 36, y + h - 13, w - 48, 10, 2, fill=1, stroke=0)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 5.5)
    shown = url if len(url) <= 48 else url[:47] + "…"
    c.drawString(x + 40, y + h - 10.5, shown)

    c.setFillColor(badge_color if badge else NHS_DARK)
    c.setFont("Helvetica-Bold", 7.5)
    label = f"{step_n}. {title}" + (f"  ·  {badge}" if badge else "")
    c.drawString(x, y + h + 6, label)

    paint_fn(c, x + 4, y + 4, w - 8, h - 22)
    return (x, y, w, h)


def mid_r(b):
    x, y, w, h = b
    return x + w, y + h * 0.45


def mid_l(b):
    x, y, w, h = b
    return x, y + h * 0.45


def connect(c, a, b, label=None, color=NHS_BLUE):
    x1, y1 = mid_r(a)
    x2, y2 = mid_l(b)
    arrow(c, x1 + 2, y1, x2 - 2, y2, label=label, color=color)


def nav_bar(c, x, y, w, active=None, compare_count=None):
    c.setFillColor(NHS_BLUE)
    c.rect(x, y, w, 10, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 5)
    c.drawString(x + 3, y + 3, "NHS  HealthStore")
    items = ["About", "Catalogue", "Compare", "Funding", "Resources"]
    c.setFont("Helvetica", 4.5)
    ix = x + 55
    for it in items:
        tw = c.stringWidth(it, "Helvetica", 4.5)
        if it == active:
            c.setFillColor(YELLOW)
            c.rect(ix - 1, y, tw + 2, 10, fill=1, stroke=0)
            c.setFillColor(TEXT)
        else:
            c.setFillColor(WHITE)
        c.drawString(ix, y + 3, it)
        if it == "Compare" and compare_count:
            c.setFillColor(NHS_DARK)
            c.circle(ix + tw + 6, y + 5, 4, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 4)
            c.drawCentredString(ix + tw + 6, y + 3.5, str(compare_count))
            c.setFont("Helvetica", 4.5)
        ix += tw + 6


def btn(c, x, y, w, h, label, primary=True):
    rrect(c, x, y, w, h, r=2, fill=NHS_BLUE if primary else WHITE, stroke=NHS_BLUE, sw=0.8)
    c.setFillColor(WHITE if primary else NHS_BLUE)
    c.setFont("Helvetica-Bold", 5.5)
    c.drawCentredString(x + w / 2, y + h / 2 - 2, label)


def text_line(c, x, y, w, h=3, color=LINE):
    c.setFillColor(color)
    c.rect(x, y, w, h, fill=1, stroke=0)


def field(c, x, y, w, h, label, value=""):
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 4.5)
    c.drawString(x, y + h + 2, label)
    rrect(c, x, y, w, h, r=1.5, fill=WHITE, stroke=BORDER, sw=0.7)
    if value:
        c.setFillColor(TEXT)
        c.setFont("Helvetica", 5)
        c.drawString(x + 3, y + h / 2 - 1.5, value)


def ring(c, x, y, w, h, color=NHS_BLUE):
    c.setStrokeColor(color)
    c.setLineWidth(1.3)
    c.roundRect(x, y, w, h, 2, fill=0, stroke=1)


# ── FLOW 1 ──────────────────────────────────────────────────────────
def flow1():
    path = OUT / "01-home-to-eoi-cta.pdf"
    c = canvas.Canvas(str(path), pagesize=PAGE)
    header(c, "Home → Express interest",
           "Each panel is a screen. Arrows are user interactions inside the service.")
    footer(c, "EOI CTA lives on the product page. Path: Home → Catalogue → PDP → Express interest")

    sw, sh = 148, 200
    gap = 18
    y = 70
    x0 = 16

    def paint_home(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(SOFT_BLUE)
        c.rect(x, y + h - 55, w, 45, fill=1, stroke=0)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 6)
        c.drawString(x + 4, y + h - 22, "HealthStore")
        text_line(c, x + 4, y + h - 30, w * 0.7, 2, MUTED)
        text_line(c, x + 4, y + h - 36, w * 0.5, 2, LINE)
        btn(c, x + 4, y + h - 50, 48, 9, "Find out more")
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5)
        c.drawString(x + 4, y + h - 66, "Pathways we support today")
        for i, t in enumerate(["COPD + pulm. rehab", "Cardiac rehab"]):
            rrect(c, x + 4, y + h - 95 - i * 28, w - 8, 24, r=2, fill=WHITE, stroke=BORDER, sw=0.7)
            c.setFillColor(TEXT)
            c.setFont("Helvetica-Bold", 5)
            c.drawString(x + 8, y + h - 82 - i * 28, t)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 4)
            c.drawString(x + 8, y + h - 90 - i * 28, "Click card → catalogue")
            if i == 0:
                ring(c, x + 4, y + h - 95, w - 8, 24)

    def paint_catalogue(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w, active="Catalogue")
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 6)
        c.drawString(x + 4, y + h - 24, "Digital therapeutics")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4.5)
        c.drawString(x + 4, y + h - 32, "Filter: COPD")
        for i, t in enumerate(["COPD", "All"]):
            rrect(c, x + 4 + i * 32, y + h - 46, 28, 8, r=2,
                  fill=NHS_BLUE if i == 0 else WHITE, stroke=NHS_BLUE, sw=0.6)
            c.setFillColor(WHITE if i == 0 else NHS_BLUE)
            c.setFont("Helvetica", 4)
            c.drawCentredString(x + 18 + i * 32, y + h - 43, t)
        for i, (name, highlight) in enumerate([("myCOPD", True), ("Luscii", False), ("COPDHub", False)]):
            yy = y + h - 70 - i * 32
            rrect(c, x + 4, yy, w - 8, 28, r=2,
                  fill=SOFT_BLUE if highlight else WHITE,
                  stroke=NHS_BLUE if highlight else BORDER,
                  sw=1 if highlight else 0.7)
            c.setFillColor(TEXT)
            c.setFont("Helvetica-Bold", 5.5)
            c.drawString(x + 8, yy + 16, name)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 4)
            c.drawString(x + 8, yy + 8, "Assured · COPD")
            btn(c, x + w - 52, yy + 8, 40, 10, "View", primary=highlight)
            if highlight:
                ring(c, x + w - 53, yy + 7, 42, 12)

    def paint_pdp(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w, active="Catalogue")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 4, y + h - 20, "Catalogue › Digital therapeutics › myCOPD")
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(x + 4, y + h - 34, "myCOPD")
        text_line(c, x + 4, y + h - 42, w * 0.8, 2, MUTED)
        text_line(c, x + 4, y + h - 48, w * 0.6, 2, LINE)
        btn(c, x + 4, y + h - 66, 62, 12, "Express interest")
        ring(c, x + 3, y + h - 67, 64, 14)
        btn(c, x + 70, y + h - 66, 58, 12, "Add to compare", primary=False)
        rrect(c, x + 4, y + h - 110, w - 8, 32, r=2, fill=SOFT_BLUE, stroke=BORDER, sw=0.6)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5)
        c.drawString(x + 8, y + h - 90, "Want to find out more?")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 8, y + h - 98, "Pathway fit · business case · procure")
        btn(c, x + 8, y + h - 108, 50, 8, "Express interest")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4.5)
        c.drawString(x + 4, y + h - 124, "The problem this addresses")
        text_line(c, x + 4, y + 40, w - 8, 2)
        text_line(c, x + 4, y + 34, w * 0.7, 2)
        text_line(c, x + 4, y + 28, w * 0.5, 2)

    def paint_eoi_start(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 4, y + h - 20, "‹ Back to myCOPD")
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(x + 4, y + h - 36, "Express interest in myCOPD")
        rrect(c, x + 4, y + h - 72, w - 8, 28, r=2, fill=SOFT_BLUE, stroke=BORDER, sw=0.6)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        for i, t in enumerate(["Not a purchase or award", "~2 minutes", "Team will contact you"]):
            c.drawString(x + 8, y + h - 52 - i * 7, "• " + t)
        btn(c, x + 4, y + h - 92, 50, 11, "Continue")
        ring(c, x + 3, y + h - 93, 52, 13, NHS_GREEN)

    screens = []
    paints = [
        (1, "Home", "/", paint_home, None),
        (2, "Catalogue", "/catalogue/digital-therapeutics?condition=copd", paint_catalogue, None),
        (3, "Product page", "/apps/mycopd", paint_pdp, "EOI CTA"),
        (4, "EOI start", "/apps/mycopd/express-interest", paint_eoi_start, "START"),
    ]
    for i, (n, title, url, pfn, badge) in enumerate(paints):
        b = screen(c, x0 + i * (sw + gap), y, sw, sh, n, title, url, pfn,
                   badge=badge, badge_color=NHS_GREEN if badge == "START" else NHS_BLUE)
        screens.append(b)

    connect(c, screens[0], screens[1], "Click COPD pathway")
    connect(c, screens[1], screens[2], "Click View")
    connect(c, screens[2], screens[3], "Click Express interest")

    rrect(c, 16, 28, W - 32, 28, r=3, fill=BG, stroke=LINE)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(24, 40, "Blue outline = control the user activates. Last screen is the EOI journey Start step (Continue begins the form).")

    c.showPage()
    c.save()
    print("Wrote", path)


# ── FLOW 2 ──────────────────────────────────────────────────────────
def flow2():
    path = OUT / "02-expression-of-interest-happy-path.pdf"
    c = canvas.Canvas(str(path), pagesize=PAGE)
    header(c, "EOI form — happy path",
           "In-service screens + one off-service email step for the one-time code")
    footer(c, "Route: /apps/{slug}/express-interest · Prototype OTP: 123456 · Submit → POST /api/express-interest")

    sw, sh = 118, 175
    gap = 12
    y = 88
    x0 = 12

    def paint_start(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 24, "Express interest in myCOPD")
        rrect(c, x + 3, y + h - 58, w - 6, 26, r=2, fill=SOFT_BLUE, stroke=LINE, sw=0.5)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 6, y + h - 40, "Not a purchase")
        c.drawString(x + 6, y + h - 48, "~2 minutes")
        btn(c, x + 3, y + h - 76, 42, 10, "Continue")
        ring(c, x + 2, y + h - 77, 44, 12)

    def paint_details(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 22, "Your details")
        field(c, x + 3, y + h - 42, w - 6, 9, "Full name", "A. Commissioner")
        field(c, x + 3, y + h - 62, w - 6, 9, "NHS work email", "a.name@nhs.net")
        field(c, x + 3, y + h - 82, w - 6, 9, "Role", "Commissioner")
        field(c, x + 3, y + h - 102, w - 6, 9, "Organisation / ICB", "Example ICB")
        field(c, x + 3, y + h - 122, w - 6, 9, "Phone (optional)", "")
        btn(c, x + 3, y + 20, 42, 10, "Continue")
        ring(c, x + 2, y + 19, 44, 12)

    def paint_verify(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 22, "Verify your email")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 3, y + h - 32, "We sent a code to a.name@nhs.net")
        field(c, x + 3, y + h - 52, w - 6, 12, "One-time code", "123456")
        btn(c, x + 3, y + h - 72, 42, 10, "Continue")
        ring(c, x + 2, y + h - 73, 44, 12, NHS_GREEN)
        c.setFillColor(NHS_BLUE)
        c.setFont("Helvetica", 4)
        c.drawString(x + 3, y + h - 88, "▸ I did not receive an email")

    def paint_email(c, x, y, w, h):
        c.setFillColor(SOFT_GREY)
        c.rect(x, y, w, h, fill=1, stroke=0)
        c.setFillColor(OFF)
        c.setFont("Helvetica-Bold", 5)
        c.drawString(x + 3, y + h - 12, "Email client (off-service)")
        rrect(c, x + 3, y + h - 50, w - 6, 32, r=2, fill=WHITE, stroke=BORDER, sw=0.7)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5)
        c.drawString(x + 6, y + h - 28, "NHS HealthStore")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 6, y + h - 36, "Your one-time code")
        rrect(c, x + 6, y + h - 48, 40, 10, r=2, fill=SOFT_BLUE, stroke=NHS_BLUE, sw=0.8)
        c.setFillColor(NHS_DARK)
        c.setFont("Helvetica-Bold", 6)
        c.drawCentredString(x + 26, y + h - 45, "123456")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        for i, t in enumerate(["1. Open work email", "2. Find HealthStore message",
                               "3. Copy code", "4. Return to HealthStore"]):
            c.drawString(x + 3, y + h - 64 - i * 8, t)

    def paint_help(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 22, "What support do you need?")
        opts = ["Assess pathway fit", "Business case", "Assurance pack", "Commercial route", "Implementation"]
        for i, o in enumerate(opts):
            yy = y + h - 36 - i * 14
            rrect(c, x + 3, yy, 8, 8, r=1, fill=NHS_BLUE if i < 2 else WHITE, stroke=NHS_BLUE, sw=0.7)
            if i < 2:
                c.setFillColor(WHITE)
                c.setFont("Helvetica-Bold", 5)
                c.drawCentredString(x + 7, yy + 2, "✓")
            c.setFillColor(TEXT)
            c.setFont("Helvetica", 4.5)
            c.drawString(x + 14, yy + 2, o)
        btn(c, x + 3, y + 18, 42, 10, "Continue")
        ring(c, x + 2, y + 17, 44, 12)

    screens = []
    specs = [
        (1, "Start", "/apps/mycopd/express-interest", paint_start, None, NHS_BLUE),
        (2, "Details", "…/express-interest", paint_details, None, NHS_BLUE),
        (3, "Verify", "…/express-interest", paint_verify, None, NHS_BLUE),
        ("✉", "Email inbox", "mail (off-service)", paint_email, "OFF-SERVICE", OFF),
        (4, "Support needed", "…/express-interest", paint_help, None, NHS_BLUE),
    ]
    for i, (n, title, url, pfn, badge, col) in enumerate(specs):
        b = screen(c, x0 + i * (sw + gap), y, sw, sh, n, title, url, pfn, badge=badge, badge_color=col)
        screens.append(b)

    connect(c, screens[0], screens[1], "Continue")
    connect(c, screens[1], screens[2], "Continue")
    arrow(c, mid_r(screens[2])[0] + 2, mid_r(screens[2])[1] + 8,
          mid_l(screens[3])[0] - 2, mid_l(screens[3])[1] + 8,
          label="Open email", color=OFF, dashed=True)
    arrow(c, mid_r(screens[3])[0] + 2, mid_r(screens[3])[1] - 8,
          mid_l(screens[4])[0] - 2, mid_l(screens[4])[1] - 8,
          label="Paste code → Continue", color=NHS_GREEN)
    c.setFillColor(OFF)
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(screens[3][0] + sw / 2, y - 10, "Leaves the service briefly, then returns")

    c.showPage()

    header(c, "EOI form — happy path (continued)",
           "Timing → Check answers → Submit → Confirmation")
    footer(c, "Submit calls POST /api/express-interest · Confirmation shows reference · Return to PDP")

    def paint_timing(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 22, "Timing & context")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 3, y + h - 32, "When do you need this? (optional)")
        for i, t in enumerate(["Within 3 months", "3–6 months", "Exploring"]):
            yy = y + h - 46 - i * 12
            c.setStrokeColor(NHS_BLUE)
            c.setLineWidth(0.7)
            c.circle(x + 7, yy + 3, 3, fill=0, stroke=1)
            if i == 0:
                c.setFillColor(NHS_BLUE)
                c.circle(x + 7, yy + 3, 1.6, fill=1, stroke=0)
            c.setFillColor(TEXT)
            c.setFont("Helvetica", 4.5)
            c.drawString(x + 14, yy + 1, t)
        field(c, x + 3, y + h - 100, w - 6, 9, "Population (optional)", "≈ 500")
        field(c, x + 3, y + h - 124, w - 6, 18, "Additional context", "")
        btn(c, x + 3, y + 16, 42, 10, "Continue")
        ring(c, x + 2, y + 15, 44, 12)

    def paint_check(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 22, "Check your answers")
        rows = [("Name", "A. Commissioner"), ("Email", "a.name@nhs.net"),
                ("Support", "Pathway fit, business case"), ("Timing", "Within 3 months")]
        for i, (k, v) in enumerate(rows):
            yy = y + h - 40 - i * 18
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 4)
            c.drawString(x + 3, yy + 8, k)
            c.setFillColor(TEXT)
            c.setFont("Helvetica", 4.5)
            c.drawString(x + 3, yy, v)
            c.setFillColor(NHS_BLUE)
            c.setFont("Helvetica", 4)
            c.drawRightString(x + w - 3, yy + 4, "Change")
            c.setStrokeColor(LINE)
            c.setLineWidth(0.4)
            c.line(x + 3, yy - 3, x + w - 3, yy - 3)
        btn(c, x + 3, y + 16, 48, 11, "Submit")
        ring(c, x + 2, y + 15, 50, 13, NHS_GREEN)

    def paint_done(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        rrect(c, x + 3, y + h - 70, w - 6, 50, r=3, fill=SOFT_GREEN, stroke=NHS_GREEN, sw=1)
        c.setFillColor(NHS_GREEN)
        c.setFont("Helvetica-Bold", 6)
        c.drawString(x + 8, y + h - 28, "✓ Expression of interest submitted")
        c.setFillColor(TEXT)
        c.setFont("Helvetica", 5)
        c.drawString(x + 8, y + h - 40, "Reference: HSC6589L")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 8, y + h - 50, "We'll contact you within")
        c.drawString(x + 8, y + h - 58, "5 working days")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 3, y + h - 84, "Confirmation email sent (prototype)")
        btn(c, x + 3, y + h - 104, 70, 11, "Return to myCOPD")
        ring(c, x + 2, y + h - 105, 72, 13)

    sw2, sh2, gap2 = 150, 200, 40
    x1, y1 = 80, 70
    s5 = screen(c, x1, y1, sw2, sh2, 5, "Timing", "…/express-interest", paint_timing)
    s6 = screen(c, x1 + (sw2 + gap2), y1, sw2, sh2, 6, "Check answers", "…/express-interest", paint_check)
    s7 = screen(c, x1 + 2 * (sw2 + gap2), y1, sw2, sh2, 7, "Confirmation", "…/express-interest",
                paint_done, badge="END", badge_color=NHS_GREEN)
    connect(c, s5, s6, "Continue")
    connect(c, s6, s7, "Submit")

    rrect(c, 80, 28, W - 160, 26, r=3, fill=SOFT_BLUE, stroke=NHS_BLUE, sw=0.8)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(90, 40, "System: POST /api/express-interest → EOI record (/eoi-record) · dashboard EOI activity when signed in")

    c.showPage()
    c.save()
    print("Wrote", path)


# ── FLOW 3 ──────────────────────────────────────────────────────────
def flow3():
    path = OUT / "03-eoi-unhappy-no-code.pdf"
    c = canvas.Canvas(str(path), pagesize=PAGE)
    header(c, "EOI unhappy path — no code received",
           "All panels are screens or off-service. Recovery stays on the Verify step.")
    footer(c, "Help: “I did not receive an email” · Resend cooldown 30s · Prototype code remains 123456")

    sw, sh = 130, 185
    gap = 16
    y = 100
    x0 = 20

    def paint_verify_empty(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 22, "Verify your email")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 3, y + h - 32, "Code sent to a.name@nhs.net")
        field(c, x + 3, y + h - 52, w - 6, 12, "One-time code", "")
        btn(c, x + 3, y + h - 72, 42, 10, "Continue")
        c.setFillColor(NHS_RED)
        c.setFont("Helvetica-Bold", 4.5)
        c.drawString(x + 3, y + h - 90, "▸ I did not receive an email")
        ring(c, x + 2, y + h - 94, 80, 10, NHS_RED)

    def paint_help_open(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 22, "Verify your email")
        field(c, x + 3, y + h - 42, w - 6, 10, "One-time code", "")
        rrect(c, x + 3, y + 16, w - 6, h - 70, r=2, fill=SOFT_AMBER, stroke=NHS_WARM, sw=0.8)
        c.setFillColor(NHS_WARM)
        c.setFont("Helvetica-Bold", 5)
        c.drawString(x + 6, y + h - 58, "▾ I did not receive an email")
        c.setFillColor(TEXT)
        c.setFont("Helvetica", 4)
        for i, L in enumerate(["It can take a few minutes.", "Check junk / spam for",
                               "NHS HealthStore emails.", "", "Wait 30s, then resend."]):
            c.drawString(x + 6, y + h - 70 - i * 8, L)
        btn(c, x + 6, y + 24, 55, 10, "Resend code (28s)", primary=False)
        ring(c, x + 5, y + 23, 57, 12, NHS_WARM)

    def paint_spam(c, x, y, w, h):
        c.setFillColor(SOFT_GREY)
        c.rect(x, y, w, h, fill=1, stroke=0)
        c.setFillColor(OFF)
        c.setFont("Helvetica-Bold", 5)
        c.drawString(x + 3, y + h - 12, "Email · Junk folder")
        for i, (frm, sub) in enumerate([("Newsletters", "…"), ("NHS HealthStore", "Your one-time code"), ("Promo", "…")]):
            yy = y + h - 40 - i * 28
            hl = i == 1
            rrect(c, x + 3, yy, w - 6, 24, r=2,
                  fill=SOFT_BLUE if hl else WHITE,
                  stroke=NHS_BLUE if hl else BORDER,
                  sw=1 if hl else 0.6)
            c.setFillColor(TEXT)
            c.setFont("Helvetica-Bold", 4.5)
            c.drawString(x + 6, yy + 12, frm)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 4)
            c.drawString(x + 6, yy + 4, sub)

    def paint_resend(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 22, "Verify your email")
        rrect(c, x + 3, y + h - 48, w - 6, 18, r=2, fill=SOFT_GREEN, stroke=NHS_GREEN, sw=0.7)
        c.setFillColor(NHS_GREEN)
        c.setFont("Helvetica", 4)
        c.drawString(x + 6, y + h - 36, "New code sent to a.name@nhs.net")
        c.drawString(x + 6, y + h - 44, "(prototype still 123456)")
        field(c, x + 3, y + h - 70, w - 6, 12, "One-time code", "123456")
        btn(c, x + 3, y + h - 90, 42, 10, "Continue")
        ring(c, x + 2, y + h - 91, 44, 12, NHS_GREEN)

    def paint_resume(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 22, "What support do you need?")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 3, y + h - 34, "Back on happy path (step 4)")
        for i, o in enumerate(["Assess pathway fit", "Business case", "Assurance"]):
            yy = y + h - 50 - i * 14
            rrect(c, x + 3, yy, 8, 8, r=1, fill=WHITE, stroke=NHS_BLUE, sw=0.7)
            c.setFillColor(TEXT)
            c.setFont("Helvetica", 4.5)
            c.drawString(x + 14, yy + 2, o)
        btn(c, x + 3, y + 30, 42, 10, "Continue")

    specs = [
        (1, "Verify — stuck", "…/express-interest", paint_verify_empty, "UNHAPPY", NHS_RED),
        (2, "Help open", "…/express-interest", paint_help_open, None, NHS_WARM),
        ("✉", "Check spam", "Email client", paint_spam, "OFF-SERVICE", OFF),
        (3, "After resend", "…/express-interest", paint_resend, None, NHS_BLUE),
        (4, "Resume form", "…/express-interest", paint_resume, "RECOVERED", NHS_GREEN),
    ]
    screens = []
    for i, (n, title, url, pfn, badge, col) in enumerate(specs):
        b = screen(c, x0 + i * (sw + gap), y, sw, sh, n, title, url, pfn, badge=badge, badge_color=col)
        screens.append(b)

    connect(c, screens[0], screens[1], "Open help")
    arrow(c, mid_r(screens[1])[0] + 2, mid_r(screens[1])[1] + 10,
          mid_l(screens[2])[0] - 2, mid_l(screens[2])[1] + 10, label="Check junk", color=OFF, dashed=True)
    arrow(c, mid_r(screens[1])[0] + 2, mid_r(screens[1])[1] - 12,
          mid_l(screens[3])[0] - 2, mid_l(screens[3])[1] - 12, label="Resend code", color=NHS_BLUE)
    connect(c, screens[3], screens[4], "Enter code → Continue")

    rrect(c, 20, 28, W - 40, 48, r=3, fill=SOFT_RED, stroke=NHS_RED, sw=0.8)
    c.setFillColor(NHS_RED)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(30, 60, "Not in the service today")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(30, 46, "No support email / phone · No ticket · No OTP expiry or lockout · No skip-verify · Resend is UI-only (no real email API)")

    c.showPage()
    c.save()
    print("Wrote", path)


# ── FLOW 4 ──────────────────────────────────────────────────────────
def flow4():
    path = OUT / "04-home-to-compare-two-products.pdf"
    c = canvas.Canvas(str(path), pagesize=PAGE)
    header(c, "Home → 2 products → compare",
           "Screen-by-screen: browse, open PDPs, add to basket, open Comparison tool")
    footer(c, "Basket max 4 · same condition required · localStorage · /compare?ids=…")

    sw, sh = 120, 178
    gap = 10
    y = 95
    x0 = 10

    def paint_home(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w)
        c.setFillColor(SOFT_BLUE)
        c.rect(x, y + h - 40, w, 30, fill=1, stroke=0)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(x + 3, y + h - 24, "HealthStore")
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5)
        c.drawString(x + 3, y + h - 52, "Pathways we support")
        rrect(c, x + 3, y + h - 82, w - 6, 22, r=2, fill=SOFT_BLUE, stroke=NHS_BLUE, sw=1)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 4.5)
        c.drawString(x + 6, y + h - 70, "COPD + pulm. rehab")
        ring(c, x + 3, y + h - 82, w - 6, 22)

    def paint_cat(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w, active="Catalogue")
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5)
        c.drawString(x + 3, y + h - 22, "Digital therapeutics · COPD")
        for i, (n, hl) in enumerate([("myCOPD", True), ("Luscii", False)]):
            yy = y + h - 50 - i * 34
            rrect(c, x + 3, yy, w - 6, 30, r=2,
                  fill=SOFT_BLUE if hl else WHITE,
                  stroke=NHS_BLUE if hl else BORDER,
                  sw=1 if hl else 0.6)
            c.setFillColor(TEXT)
            c.setFont("Helvetica-Bold", 5)
            c.drawString(x + 6, yy + 16, n)
            btn(c, x + 6, yy + 4, 28, 8, "View", primary=hl)
            btn(c, x + 38, yy + 4, 50, 8, "Add to compare", primary=False)
            if hl:
                ring(c, x + 5, yy + 3, 30, 10)

    def paint_pdp1(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w, active="Catalogue")
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 6)
        c.drawString(x + 3, y + h - 24, "myCOPD")
        text_line(c, x + 3, y + h - 32, w * 0.7, 2, MUTED)
        btn(c, x + 3, y + h - 52, 55, 11, "Add to compare")
        ring(c, x + 2, y + h - 53, 57, 13)
        btn(c, x + 62, y + h - 52, 48, 11, "Express interest", primary=False)
        rrect(c, x + 3, y + h - 72, w - 6, 14, r=2, fill=SOFT_GREEN, stroke=NHS_GREEN, sw=0.6)
        c.setFillColor(NHS_GREEN)
        c.setFont("Helvetica", 4)
        c.drawString(x + 6, y + h - 66, "Added to comparison (1/4)")

    def paint_pdp2(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w, active="Catalogue", compare_count=1)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 6)
        c.drawString(x + 3, y + h - 24, "Luscii")
        text_line(c, x + 3, y + h - 32, w * 0.7, 2, MUTED)
        btn(c, x + 3, y + h - 52, 55, 11, "Add to compare")
        ring(c, x + 2, y + h - 53, 57, 13)
        rrect(c, x + 3, y + h - 72, w - 6, 14, r=2, fill=SOFT_GREEN, stroke=NHS_GREEN, sw=0.6)
        c.setFillColor(NHS_GREEN)
        c.setFont("Helvetica", 4)
        c.drawString(x + 6, y + h - 66, "Added to comparison (2/4)")

    def paint_nav_click(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w, active="Compare", compare_count=2)
        ring(c, x + 78, y + h - 11, 36, 12)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 5)
        c.drawString(x + 3, y + h - 30, "Header: Comparison tool")
        c.drawString(x + 3, y + h - 40, "Badge shows 2 selected")
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 5)
        c.drawString(x + 3, y + h - 60, "User clicks")
        c.drawString(x + 3, y + h - 70, "Comparison tool")

    def paint_compare(c, x, y, w, h):
        nav_bar(c, x, y + h - 10, w, active="Compare", compare_count=2)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 6)
        c.drawString(x + 3, y + h - 24, "Comparison tool")
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 4)
        c.drawString(x + 3, y + h - 32, "COPD · 2 products")
        col_w = (w - 10) / 2
        for i, name in enumerate(["myCOPD", "Luscii"]):
            xx = x + 3 + i * (col_w + 4)
            rrect(c, xx, y + 20, col_w, h - 58, r=2, fill=WHITE, stroke=BORDER, sw=0.7)
            c.setFillColor(TEXT)
            c.setFont("Helvetica-Bold", 5)
            c.drawString(xx + 3, y + h - 48, name)
            for j in range(5):
                text_line(c, xx + 3, y + h - 58 - j * 10, col_w - 6, 2, LINE if j % 2 == 0 else MUTED)
            c.setFillColor(NHS_BLUE)
            c.setFont("Helvetica", 3.5)
            c.drawString(xx + 3, y + 26, "Remove")

    specs = [
        (1, "Home", "/", paint_home, None, NHS_BLUE),
        (2, "Catalogue", "/catalogue/…?condition=copd", paint_cat, None, NHS_BLUE),
        (3, "PDP · myCOPD", "/apps/mycopd", paint_pdp1, "Add 1", NHS_BLUE),
        (4, "PDP · Luscii", "/apps/luscii", paint_pdp2, "Add 2", NHS_BLUE),
        (5, "Header nav", "(any page)", paint_nav_click, "CTA", NHS_BLUE),
        (6, "Compare view", "/compare?ids=mycopd,luscii", paint_compare, "END", NHS_GREEN),
    ]
    screens = []
    for i, (n, title, url, pfn, badge, col) in enumerate(specs):
        b = screen(c, x0 + i * (sw + gap), y, sw, sh, n, title, url, pfn, badge=badge, badge_color=col)
        screens.append(b)

    labels = ["COPD card", "Open myCOPD", "Add to compare", "Add to compare", "Comparison tool"]
    for i in range(5):
        connect(c, screens[i], screens[i + 1], labels[i])

    rrect(c, 10, 28, W - 20, 42, r=3, fill=BG, stroke=LINE)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(20, 56, "Rules visible in the journey")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(20, 42, "Same condition only · Max 4 · Toast confirms each add · Nav badge updates · Alt: add from catalogue cards")

    c.showPage()
    c.save()
    print("Wrote", path)


if __name__ == "__main__":
    flow1()
    flow2()
    flow3()
    flow4()
    print("All done")
