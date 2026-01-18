# Calculator App

A clean, web-based calculator application inspired by iOS/Google design. It supports basic arithmetic operations, keyboard input, and a collapsible history panel. The UI is responsive and uses modern fonts (Inter & Roboto Mono).

---

## Features

* Basic arithmetic: add, subtract, multiply, divide
* Decimal support and percentage
* Toggle sign (+/-)
* Clear (AC) and backspace support
* Keyboard support for numbers, operators, Enter, Escape, and Backspace
* Calculation history with a collapsible panel
* Responsive layout for mobile and desktop

---

## Demo

Open `index.html` in your browser to run the calculator locally.

---

## File structure

```
calculator-project/
├── index.html       # Main HTML
├── styles.css       # Styling (CSS)
├── script.js        # Calculator logic (JavaScript)
└── README.md        # This file
```

---

## Installation & Usage

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/calculator-app.git
cd calculator-app
```

2. Open `index.html` in your browser (double-click or use a local server):

```bash
# optional: use a simple http server
npx http-server .
# or
python -m http.server 8000
```

3. Use the calculator with mouse/touch or keyboard.

---

## Keyboard Shortcuts

* Numbers `0-9` and `.` to enter digits
* `+`, `-`, `*`, `/` to select operations
* `Enter` or `=` to evaluate
* `Escape` to clear (AC)
* `Backspace` to delete the last digit

---

## Implementation Notes

* **History**: Each calculation is pushed into an in-memory `history` array and rendered inside the history panel. The panel toggles open/closed using the history toggle button.
* **Precision**: Results longer than 10 characters are rounded and formatted using `toFixed(8)` to avoid long floating-point outputs.
* **Error handling**: Division by zero displays `Error` and prevents further calculation until reset.
* **Accessibility**: Buttons are focusable and keyboard events are mapped to calculator functionality.

---

## Styling

* Uses CSS variables for easy theming (`--primary`, `--secondary`, `--text`, etc.).
* Responsive grid layout for calculator buttons with a wider zero button (`grid-column: span 2`).

---

## Customization Ideas

* Persist history to `localStorage` so history survives page reloads.
* Add scientific functions (sin, cos, tan, log, power).
* Add copy-to-clipboard for results.
* Improve keyboard accessibility (ARIA labels, focus outline).

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

---

## License

This project is released under the MIT License. See `LICENSE` for details.

---

## Contact

If you have questions or want help customizing the calculator, create an issue or contact me via GitHub.
