# Text Hyperlinker for Latin and Ancient Greek

A free, browser‑based tool that turns Latin or Ancient Greek text into clickable words. Each word links directly to morphological analysis on Perseus or Logeion (Morpho). No installation, no server – just open the HTML file and start.

## Features

- Paste any Latin or Ancient Greek text (from OCR, typing, copying).
- Click any word in the processed output to see its morphology.
- Choose between two dictionaries:
  - **Perseus morphological analysis**
  - **Logeion (Morpho)**
- Clean, distraction‑free retro interface.
- Keyboard shortcuts for speed (Arrow keys + Enter, Ctrl+Enter).
- Fully client‑side – your text never leaves your browser.

## Usage

1. Open `index.html` (or the file you saved) in a modern web browser.
2. Select **Ancient Greek** or **Latin**.
3. Paste your text into the box.
4. Click **Process** (or press `Ctrl+Enter`).
5. Click any blue, underlined word in the output area.
6. A popup appears – choose **Perseus** or **Morpho** (or navigate with ↑/↓ and Enter).
7. The analysis opens in a new tab.

## How it works

The script splits the text into tokens, strips punctuation, and wraps every recognisable word in a clickable `<span>`. The popup constructs the correct URL for the selected dictionary and opens it when you click.

## Note on text preparation

If you’re working from a scan or PDF, you can first OCR it with a tool like [Antigrapheus](https://antigrapheus.com) (or any other OCR software), then paste the resulting text here.

## Dependencies

None. Everything runs in the browser – pure HTML, CSS, and vanilla JavaScript.

## Author

Marino Marinović

## License

Free to use, modify, and share. No warranty.
