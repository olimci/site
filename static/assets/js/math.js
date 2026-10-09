// Only math-enabled posts load this script and its KaTeX dependencies.
renderMathInElement(document.querySelector(".prose"), {
    delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
});
