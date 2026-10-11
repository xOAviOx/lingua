# Lingua

Lingua is our Web Programming course project. It is a small programming language with a web playground where someone can write code and see the output. We are building it step by step so we can explain every part during our end-semester viva.

## What works now

- Four linked pages: Playground, Docs, About, and Feedback.
- A short Docs tutorial with the current syntax, examples, rules, and planned features.
- A code box with a Run button, Ctrl + Enter shortcut, and two examples.
- A simple JavaScript runner for `let`, `print`, numbers, strings, and `+`, `-`, `*`, `/` expressions.
- Error messages that show the line number.
- A feedback form with name, email, and message validation.
- An Express route that saves valid feedback in `data/feedback.json`.

The language runner is intentionally small. It reads one statement per line. It does not support loops, conditions, or functions yet. Maths is calculated from left to right, so it does not use normal operator precedence yet.

## How to run it

Install Node.js, then run these commands in the project folder:

```text
npm install
npm start
```

Open `http://localhost:3000` in a browser. Use the server URL for the feedback form, because a page opened directly from a file cannot submit to the API.

## How the parts work

`playground.html` holds the code box and output area. `playground.js` listens for the Run button, reads the code line by line, stores values in a JavaScript object, and shows printed results in the page.

`feedback.html` has the form. `feedback.js` checks the fields and sends JSON with `fetch`. `server.js` checks the data again and writes it to `data/feedback.json`. We validate on both sides so the page gives quick feedback and the server does not accept bad input.

`docs.html` teaches the current syntax. `about.html` explains the project to visitors. `playground.css` styles all four pages.

## Course roadmap

| Evaluation | Course focus | Project work |
| --- | --- | --- |
| Phase 1 | HTML and CSS | Responsive playground design. |
| Phase 2 | JavaScript, DOM, forms, local JSON | Linked pages, working interactions, validation, form submission, and JSON saving. |
| Final phase | Full-stack app and MongoDB | Improve the language runner and move saved data to MongoDB. |

For the final demo, we want to show a short program running, a helpful error, a valid and invalid form submission, and the saved JSON data. We will add more language features only when the basic flow is reliable and easy to explain.
