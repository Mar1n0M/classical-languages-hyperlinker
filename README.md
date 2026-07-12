# Text Hyperlinker for Latin and Ancient Greek

A free, browser‑based tool that turns Latin or Ancient Greek text into clickable words; each word links directly to morphological analysis on Perseus or Logeion (Morpho).

## Usage

1. Open web location.
2. Select **Ancient Greek** or **Latin**.
3. Paste your text into the box.
4. Click **Process** (or press `Ctrl+Enter`).
5. Click any word in the output area.
6. A popup appears — choose **Perseus** or **Morpho** (or navigate with ↑/↓ and Enter).
7. The analysis opens in a new tab.

## How it works

The script splits the text into tokens, strips punctuation, and wraps every recognisable word in a clickable `<span>`. The popup constructs the correct URL for the selected dictionary and opens it when you click.

## Author

Marino Marinović (2026)

## License

CC BY-SA 4.0 — Attribution-ShareAlike 4.0 International
