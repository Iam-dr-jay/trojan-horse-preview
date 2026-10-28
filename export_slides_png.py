#!/usr/bin/env python3
"""
OPERATION 10M — 1080x1920 (9:16) LUXURY SLIDE PNG RASTERIZER (export_slides_png.py)
Automatically renders all 10 vertical 9:16 slides from `?mode=slides` across:
  - Deck 1: Black November VIP Vault (4 slides)
  - Deck 2: Lagos Detty December VIP Concierge B2B Hook (3 slides)
  - Deck 3: Roadman Trader Quant Kit v1 (3 slides)
as crisp `1080x1920` .png files inside:
  /home/theroadman/Roadman-Brain/10M-War-Room/Ready-To-Post-Slides/
ready for zero-screenshot upload to WhatsApp Status, Instagram Stories, and TikTok on Z Fold 4 / iPhone.
"""

import textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = Path("/home/theroadman/Roadman-Brain/10M-War-Room/Ready-To-Post-Slides")
WIDTH, HEIGHT = 1080, 1920

# Color Palette (#0A0A0A Dark Glass + #D4AF37 Champagne Gold)
BG_OBSIDIAN = (10, 10, 10)
CARD_GLASS = (20, 20, 22)
GOLD = (212, 175, 55)
GOLD_LIGHT = (243, 229, 171)
GOLD_DARK = (145, 114, 24)
WHITE = (248, 248, 244)
ZINC_300 = (212, 212, 216)
ZINC_400 = (161, 161, 170)
EMERALD = (52, 211, 153)
BLACK = (10, 10, 10)

SLIDES_MANIFEST = [
    # DECK 1: BLACK NOVEMBER VIP VAULT (4 SLIDES)
    {
        "filename": "01-Deck1-BlackNov-Slide1-Tier1-45K.png",
        "deck_tag": "DECK 01 • BLACK NOVEMBER VIP VAULT",
        "slide_num": "SLIDE 01 / 04",
        "eyebrow": "DR JAY'S STORE • BLACK NOVEMBER VAULT",
        "headline": "Tier 1:\nExecutive Daily\nBundle",
        "price_tag": "NGN 45,000",
        "sub_badge": "CODE: EXEC-45K • ESSENTIAL MONOCHROME CARRY",
        "bullets": [
            "Heavyweight 320GSM Obsidian Structured Tee",
            "Matte-Black RFID Carbon-Fiber Cardholder",
            "Braided 100W Fast-Charge Kevlar Type-C Cable",
            "Serialized Black November VIP Member Card",
        ],
        "footer_cta": "SWIPE -> OR DM 'BLACK' TO +234 905 938 3562",
    },
    {
        "filename": "02-Deck1-BlackNov-Slide2-Tier2-85K.png",
        "deck_tag": "DECK 01 • BLACK NOVEMBER VIP VAULT",
        "slide_num": "SLIDE 02 / 04",
        "eyebrow": "#1 EXECUTIVE BESTSELLER • LIMITED EDITION",
        "headline": "Tier 2:\nRoadman Drip\n& Tech Box",
        "price_tag": "NGN 85,000",
        "sub_badge": "CODE: DRIP-85K • STREETWEAR MEETS MOBILE POWER",
        "bullets": [
            "Signature 500GSM Boxy Luxury Hoodie OR Tactical Cargo",
            "MagSafe 10,000mAh Matte-Black Aluminum Power Bank",
            "Brushed Onyx Blue-Light Blocking Executive Frames",
            "Custom Collector Trunk + Priority Lagos Courier",
        ],
        "footer_cta": "SWIPE -> OR DM 'BLACK' TO +234 905 938 3562",
    },
    {
        "filename": "03-Deck1-BlackNov-Slide3-Tier3-150K.png",
        "deck_tag": "DECK 01 • BLACK NOVEMBER VIP VAULT",
        "slide_num": "SLIDE 03 / 04",
        "eyebrow": "SOVEREIGN C-SUITE & DETTY DECEMBER TRUNK",
        "headline": "Tier 3:\nCEO / IJGB\nBespoke Box",
        "price_tag": "NGN 150,000",
        "sub_badge": "CODE: CEO-150K • ONLY 15 TRUNKS ALLOCATED",
        "bullets": [
            "Full 2-Piece 600GSM Heavyweight Set (Hoodie + Cargo)",
            "Sovereign Leather Weekender Crossbody / Dopp Kit",
            "100ml Niche Extrait de Parfum (Oud & Amber Reserve)",
            "Sterling Cuban Cuff + Same-Day Lagos Chauffeur Drop",
        ],
        "footer_cta": "SWIPE -> FOR INSTANT SETTLEMENT & VIP DISPATCH",
    },
    {
        "filename": "04-Deck1-BlackNov-Slide4-Settlement-CTA.png",
        "deck_tag": "DECK 01 • BLACK NOVEMBER VIP VAULT",
        "slide_num": "SLIDE 04 / 04",
        "eyebrow": "INSTANT VIP ALLOCATION & SETTLEMENT",
        "headline": "Claim Your\nNumbered Vault\nBox Today",
        "price_tag": "Moniepoint 9059383562",
        "sub_badge": "ACCOUNT NAME: DR JAY'S STORE",
        "bullets": [
            "DM 'BLACK' to +234 905 938 3562 or Pay Direct: Moniepoint 9059383562 (Dr Jay's Store)",
            "Send transfer screenshot on WhatsApp for immediate dispatch",
            "Same-day VIP rider in Lagos • 48-Hr DHL Worldwide",
            "Live Vault: theroadman.me/trojan-horse-preview/?mode=blacknovember",
        ],
        "footer_cta": "DM 'BLACK' TO +234 905 938 3562 • MONIEPOINT 9059383562",
    },
    # DECK 2: LAGOS DETTY DECEMBER VIP CONCIERGE (3 SLIDES)
    {
        "filename": "05-Deck2-DettyDec-Slide1-B2BHook.png",
        "deck_tag": "DECK 02 • LAGOS DETTY DECEMBER B2B CONCIERGE",
        "slide_num": "SLIDE 01 / 03",
        "eyebrow": "VICTORIA ISLAND • LEKKI PHASE 1 • IKOYI",
        "headline": "Losing Big Spenders\nTo Slow DM\nReplies?",
        "price_tag": "0.8s AI Response",
        "sub_badge": "LOUNGES • LUXURY SHORTLETS • YACHT CHARTERS",
        "bullets": [
            "Losing big spenders to slow DM replies? Deploy a 24/7 AI WhatsApp Table & Booking Concierge in 7 Days.",
            "IJGB & VVIP clients book tables, penthouses & yachts at 2:00 AM on impulse",
            "If your team replies 30 mins late, that NGN 3.5M booking goes to your competitor",
            "Replace static Linktrees with an autonomous Dark-Glass Flagship",
        ],
        "footer_cta": "SWIPE -> SEE HOW THE 7-DAY TURNKEY BUILD WORKS",
    },
    {
        "filename": "06-Deck2-DettyDec-Slide2-AIArchitecture.png",
        "deck_tag": "DECK 02 • LAGOS DETTY DECEMBER B2B CONCIERGE",
        "slide_num": "SLIDE 02 / 03",
        "eyebrow": "AUTONOMOUS 24/7 REVENUE ARCHITECTURE",
        "headline": "Your Private AI\nVVIP Reservation\nDesk",
        "price_tag": "24/7 Auto-Closer",
        "sub_badge": "WHATSAPP BUSINESS + INSTAGRAM DM + WEB FLAGSHIP",
        "bullets": [
            "Qualifies VVIP Table Guests (NGN 1.2M - 5M Skyboxes) automatically",
            "Checks Lekki Penthouse & 75ft Yacht availability in real time",
            "Routes instant deposit invoices (NGN / USD / USDT) in 1 tap",
            "Custom-trained on your exact menu, rates & house rules",
        ],
        "footer_cta": "SWIPE -> LOCK IN YOUR PRE-DECEMBER SLOT",
    },
    {
        "filename": "07-Deck2-DettyDec-Slide3-7DaySlotLock.png",
        "deck_tag": "DECK 02 • LAGOS DETTY DECEMBER B2B CONCIERGE",
        "slide_num": "SLIDE 03 / 03",
        "eyebrow": "ONLY 3 TURNKEY SLOTS OPEN THIS MONTH",
        "headline": "Go Live In 7 Days\nBefore Detty\nDecember",
        "price_tag": "NGN 700k Deposit",
        "sub_badge": "NGN 1,000,000 TURNKEY • MONIEPOINT 9059383562",
        "bullets": [
            "Days 1-3: Bespoke #0A0A0A Dark-Glass Luxury Website",
            "Days 4-5: 24/7 AI WhatsApp & IG Concierge Integration",
            "Days 6-7: Custom Domain Cutover & Staff Handover",
            "DM 'KEYS' to +234 905 938 3562 or Pay Deposit: Moniepoint 9059383562 (Dr Jay's Store)",
        ],
        "footer_cta": "DM 'KEYS' TO +234 905 938 3562 • MONIEPOINT 9059383562",
    },
    # DECK 3: ROADMAN TRADER QUANT KIT v1 (3 SLIDES)
    {
        "filename": "08-Deck3-QuantKit-Slide1-PropHook.png",
        "deck_tag": "DECK 03 • ROADMAN TRADER QUANT KIT v1",
        "slide_num": "SLIDE 01 / 03",
        "eyebrow": "INSTITUTIONAL ALGORITHMIC TRADING SUITE",
        "headline": "Stop Blowing\nProp Accounts\nOn Emotion",
        "price_tag": "Python 3.12 + MT5",
        "sub_badge": "DOCKERIZED FASTAPI MICROSERVICE • 46 PYTEST SUITES",
        "bullets": [
            "Built for FTMO, FundedNext & Exness Prop Traders",
            "Eliminates revenge trading, late entries & sizing drift",
            "Sub-millisecond FastAPI webhook execution (uvicorn app:app)",
            "Full Simulation Lock & Shadow Campaign telemetry out of the box",
        ],
        "footer_cta": "SWIPE -> INSPECT THE SMC/ICT QUANT ENGINE",
    },
    {
        "filename": "09-Deck3-QuantKit-Slide2-SMCBrain.png",
        "deck_tag": "DECK 03 • ROADMAN TRADER QUANT KIT v1",
        "slide_num": "SLIDE 02 / 03",
        "eyebrow": "DETERMINISTIC SMC / ICT EXECUTION BRAIN",
        "headline": "Hard >= 2.0R\nRisk Gate &\nHMAC Security",
        "price_tag": "+3.20R Verified",
        "sub_badge": "BTCUSDm (+3.20R) • XAUUSD (+3.00R) • EURUSD (+2.80R)",
        "bullets": [
            "Automated Fair Value Gap (FVG), Liquidity Sweep & BOS/MSS detection",
            "Pre-trade spread & tick-age validator rejects bad broker fills",
            "HMAC-SHA256 authenticated webhook bridge to MetaTrader 5",
            "258 sanitized production files + 30 engineering manuals included",
        ],
        "footer_cta": "SWIPE -> CLAIM YOUR STARTER OR PRO QUANT LICENSE",
    },
    {
        "filename": "10-Deck3-QuantKit-Slide3-PricingCTA.png",
        "deck_tag": "DECK 03 • ROADMAN TRADER QUANT KIT v1",
        "slide_num": "SLIDE 03 / 03",
        "eyebrow": "INSTANT ZIP DOWNLOAD & VPS DEPLOYMENT",
        "headline": "$49 Starter /\n$199 Pro\nQuant License",
        "price_tag": "$49 / $199 USD",
        "sub_badge": "NGN EQUIVALENT: NGN 50,000 STARTER / NGN 200,000 PRO",
        "bullets": [
            "Tier 1 ($49 / NGN 50k): FastAPI Webhook Server + Risk Gate + Docker Kit",
            "Tier 2 ($199 / NGN 200k): Full SMC Brain + O(1) Replay + MT5 Node",
            "Tier 3 ($299 / NGN 300k): Done-For-You Cloud VPS & Prop Setup",
            "DM 'QUANT' to +234 905 938 3562 or Pay Direct: Moniepoint 9059383562 (Dr Jay's Store)",
        ],
        "footer_cta": "DM 'QUANT' TO +234 905 938 3562 • MONIEPOINT 9059383562",
    },
]


def load_font(font_names: list[str], size: int) -> ImageFont.FreeTypeFont:
    search_dirs = [
        "/usr/share/fonts/truetype/dejavu",
        "/usr/share/fonts/truetype/liberation",
        "/usr/share/fonts/truetype/ubuntu",
        "/usr/share/fonts/opentype",
    ]
    for d in search_dirs:
        for name in font_names:
            candidate = Path(d) / name
            if candidate.exists():
                return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def render_slide(slide: dict, out_path: Path) -> None:
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_OBSIDIAN)
    draw = ImageDraw.Draw(img)

    # Load Fonts
    f_mono_sm = load_font(["DejaVuSansMono-Bold.ttf", "LiberationMono-Bold.ttf"], 24)
    f_mono_md = load_font(["DejaVuSansMono-Bold.ttf", "LiberationMono-Bold.ttf"], 27)
    f_serif_xl = load_font(["DejaVuSerif-Bold.ttf", "LiberationSerif-Bold.ttf"], 82)
    f_serif_lg = load_font(["DejaVuSerif-Bold.ttf", "LiberationSerif-Bold.ttf"], 60)
    f_sans_md = load_font(["DejaVuSans.ttf", "LiberationSans-Regular.ttf"], 34)
    f_sans_bold = load_font(["DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf"], 30)

    # Outer Luxury Card Frame (1080x1920 with 56px margin)
    card_rect = [56, 64, WIDTH - 56, HEIGHT - 64]
    draw.rounded_rectangle(card_rect, radius=56, fill=CARD_GLASS, outline=GOLD, width=4)

    # Subtle inner border highlight
    inner_rect = [68, 76, WIDTH - 68, HEIGHT - 76]
    draw.rounded_rectangle(inner_rect, radius=48, outline=(60, 52, 28), width=2)

    # 1. Top Telemetry Header Bar
    draw.text((108, 120), slide["slide_num"], font=f_mono_md, fill=GOLD)
    draw.text((WIDTH - 108, 120), "+234 905 938 3562", font=f_mono_sm, fill=ZINC_400, anchor="ra")
    draw.line([(108, 172), (WIDTH - 108, 172)], fill=(55, 55, 60), width=2)

    # 2. Eyebrow Pill
    pill_box = [108, 210, WIDTH - 108, 274]
    draw.rounded_rectangle(pill_box, radius=32, fill=(38, 32, 16), outline=GOLD, width=2)
    draw.text((136, 228), f"● {slide['eyebrow']}", font=f_mono_sm, fill=GOLD_LIGHT)

    # 3. Main Serif Headline
    y_cursor = 316
    for line in slide["headline"].split("\n"):
        draw.text((108, y_cursor), line, font=f_serif_xl, fill=WHITE)
        y_cursor += 98

    # 4. Price / Allocation Highlight Box
    y_cursor += 28
    price_box = [108, y_cursor, WIDTH - 108, y_cursor + 136]
    draw.rounded_rectangle(price_box, radius=32, fill=(12, 12, 14), outline=GOLD, width=3)
    draw.text((144, y_cursor + 48), "ALLOCATION / RATE", font=f_mono_sm, fill=ZINC_400)
    draw.text((WIDTH - 144, y_cursor + 36), slide["price_tag"], font=f_serif_lg, fill=GOLD, anchor="ra")

    # 5. Sub-Badge Line
    y_cursor += 166
    draw.text((108, y_cursor), slide["sub_badge"], font=f_mono_sm, fill=GOLD_LIGHT)
    y_cursor += 54
    draw.line([(108, y_cursor), (WIDTH - 108, y_cursor)], fill=(55, 55, 60), width=2)

    # 6. Bullet Points List
    y_cursor += 42
    for bullet in slide["bullets"]:
        wrapped = textwrap.wrap(bullet, width=42)
        draw.text((108, y_cursor), "✦", font=f_sans_bold, fill=GOLD)
        for w_line in wrapped:
            draw.text((156, y_cursor), w_line, font=f_sans_md, fill=ZINC_300)
            y_cursor += 48
        y_cursor += 24

    # 7. Bottom Gold CTA Bar & Official Moniepoint Settlement Strip
    cta_top = HEIGHT - 330
    draw.line([(108, cta_top - 32), (WIDTH - 108, cta_top - 32)], fill=(75, 62, 24), width=2)

    cta_box = [108, cta_top, WIDTH - 108, cta_top + 112]
    draw.rounded_rectangle(cta_box, radius=32, fill=GOLD, outline=GOLD_LIGHT, width=2)
    draw.text(
        (WIDTH // 2, cta_top + 56),
        slide["footer_cta"],
        font=f_mono_md,
        fill=BLACK,
        anchor="mm",
    )

    # Settlement Footer
    footer_y = cta_top + 142
    draw.text(
        (108, footer_y),
        "BANK: Moniepoint MFB • 9059383562 (Dr Jay's Store)",
        font=f_mono_sm,
        fill=WHITE,
    )
    draw.text(
        (108, footer_y + 38),
        "WEB: theroadman.me/trojan-horse-preview  |  EMAIL: Johnefe50@gmail.com",
        font=f_mono_sm,
        fill=GOLD,
    )

    img.save(out_path, format="PNG", optimize=True)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print("====================================================================")
    print(" EXPORTING 10 VERTICAL 9:16 SLIDES (1080x1920 PNG)")
    print("====================================================================")
    for idx, slide in enumerate(SLIDES_MANIFEST, start=1):
        out_path = OUT_DIR / slide["filename"]
        render_slide(slide, out_path)
        with Image.open(out_path) as im:
            w, h = im.size
        size_kb = out_path.stat().st_size / 1024
        print(f"[{idx:02d}/10] {out_path.name:48s} -> {w}x{h}px ({size_kb:.1f} KB)")
    print("====================================================================")
    print(f" [SUCCESS] All 10 9:16 PNG slides saved to: {OUT_DIR}")
    print("====================================================================")


if __name__ == "__main__":
    main()
