# Sky Hop

Sky Hop is a lightweight browser game built as a simple open-source starter project. It is intentionally small, easy to understand, and easy to extend. The goal is to provide a playable prototype that you can quickly share, iterate on, and improve collaboratively.

## Features

- Endless runner gameplay
- Keyboard controls (Space or Up Arrow to jump)
- Score tracking and local best score
- Clean, responsive canvas-based UI
- Easy to expand with sound, menus, enemies, and power-ups

## How to run

You can run the game by opening `index.html` directly in a browser, or by serving the project locally.

### Option 1: open directly

Open `index.html` in your browser.

### Option 2: run a local web server

From the project folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Controls

- Jump: `Space` or `ArrowUp`
- Restart after game over: `Enter`

## Project structure

```text
.
├── index.html
├── style.css
├── game.js
├── README.md
└── LICENSE
```

## Roadmap ideas

- Add sound effects and music
- Create start menu and pause screen
- Add multiple obstacle patterns and power-ups
- Add mobile touch controls
- Add sprite art and animation
- Add leaderboard or local save data

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome. Feel free to open issues, suggest improvements, or submit pull requests.

---

This project is a clean starting point for a public GitHub launch and can be expanded into a larger game over time.
