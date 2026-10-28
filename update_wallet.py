#!/usr/bin/env python3
"""
OPERATION 10M — 1-COMMAND USDT WALLET INJECTOR & GITHUB PAGES DEPLOYER (update_wallet.py)
Usage:
  python3 update_wallet.py <WALLET_ADDRESS> [--network trc20|bep20|solana|all]

Automatically injects the Commander's USDT wallet address into:
  - /home/theroadman/operation-10m/trojan-horse/index.html
  - /home/theroadman/operation-10m/trojan-horse/dispatch_console.html
  - /home/theroadman/operation-10m/scraper/launch_outreach.py
And pushes the updated build directly to origin/main on GitHub Pages.
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path

TROJAN_DIR = Path("/home/theroadman/operation-10m/trojan-horse")
SCRAPER_DIR = Path("/home/theroadman/operation-10m/scraper")
TARGET_FILES = [
    TROJAN_DIR / "index.html",
    TROJAN_DIR / "dispatch_console.html",
    SCRAPER_DIR / "launch_outreach.py",
]


def detect_network(wallet: str) -> str:
    w = wallet.strip()
    if w.startswith("0x") and len(w) == 42:
        return "bep20"
    if w.startswith("T") and 32 <= len(w) <= 36:
        return "trc20"
    return "all"


def replace_wallet_in_text(content: str, wallet: str, network: str) -> str:
    updated = content
    if network in ("trc20", "all"):
        updated = re.sub(r"(trc20:\s*['\"])([^'\"]+)(['\"])", rf"\g<1>{wallet}\g<3>", updated)
        updated = re.sub(
            r'(<code id="usdt-trc20-addr"[^>]*>)([^<]+)(</code>)',
            rf"\g<1>{wallet}\g<3>",
            updated,
        )
        updated = re.sub(
            r"(create-qr-code/\?size=160x160&data=)([^\"'&]+)",
            rf"\g<1>{wallet}",
            updated,
        )
    if network in ("bep20", "all"):
        updated = re.sub(r"(bep20:\s*['\"])([^'\"]+)(['\"])", rf"\g<1>{wallet}\g<3>", updated)
        updated = re.sub(
            r'(<code id="usdt-evm-addr"[^>]*>)([^<]+)(</code>)',
            rf"\g<1>{wallet}\g<3>",
            updated,
        )
    if network in ("solana", "all"):
        updated = re.sub(r"(solana:\s*['\"])([^'\"]+)(['\"])", rf"\g<1>{wallet}\g<3>", updated)
        updated = re.sub(
            r'(<code id="usdt-sol-addr"[^>]*>)([^<]+)(</code>)',
            rf"\g<1>{wallet}\g<3>",
            updated,
        )
    return updated


def push_to_github_pages(wallet: str, network: str) -> None:
    subprocess.run(["git", "add", "index.html", "dispatch_console.html"], cwd=TROJAN_DIR, check=True)
    status = subprocess.run(
        ["git", "status", "--porcelain"], cwd=TROJAN_DIR, capture_output=True, text=True
    ).stdout.strip()
    if not status:
        print("[INFO] Wallet address already up to date in git working tree.")
        return

    subprocess.run(
        ["git", "commit", "-m", f"chore(settlement): update USDT ({network}) wallet address"],
        cwd=TROJAN_DIR,
        check=True,
    )

    try:
        import gi

        gi.require_version("Secret", "1")
        from gi.repository import Secret

        schema = Secret.Schema.new(
            "org.freedesktop.Secret.Generic",
            Secret.SchemaFlags.NONE,
            {"service": Secret.SchemaAttributeType.STRING},
        )
        token = Secret.password_lookup_sync(schema, {"service": "gh:github.com"}, None)
        if token:
            token = token.strip()
            remote_url = f"https://Iam-dr-jay:{token}@github.com/Iam-dr-jay/trojan-horse-preview.git"
            subprocess.run(["git", "push", remote_url, "main:main"], cwd=TROJAN_DIR, check=True)
            print("[SUCCESS] Pushed updated USDT wallet live to https://theroadman.me/trojan-horse-preview/?mode=invoice")
            return
    except Exception:
        pass

    subprocess.run(["git", "push", "origin", "main"], cwd=TROJAN_DIR, check=True)
    print("[SUCCESS] Pushed updated USDT wallet live to origin/main")


def main() -> None:
    parser = argparse.ArgumentParser(description="Inject USDT wallet into Trojan Horse Invoice Portal & push live")
    parser.add_argument("wallet", help="USDT Wallet Address (TRC20 / BEP20 / Solana)")
    parser.add_argument(
        "--network",
        choices=["auto", "trc20", "bep20", "solana", "all"],
        default="auto",
        help="Target network slot (default: auto-detect from address prefix)",
    )
    parser.add_argument("--no-push", action="store_true", help="Update local files without git push")
    args = parser.parse_args()

    wallet = args.wallet.strip()
    if len(wallet) < 20:
        print("[ERROR] Wallet address appears invalid (too short).", file=sys.stderr)
        sys.exit(1)

    network = detect_network(wallet) if args.network == "auto" else args.network
    for path in TARGET_FILES:
        if path.exists():
            original = path.read_text(encoding="utf-8")
            updated = replace_wallet_in_text(original, wallet, network)
            path.write_text(updated, encoding="utf-8")
            print(f"[UPDATED] {path} (network={network} -> {wallet})")

    if not args.no_push:
        push_to_github_pages(wallet, network)


if __name__ == "__main__":
    main()
