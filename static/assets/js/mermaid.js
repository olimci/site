const blocks = document.querySelectorAll('.prose pre > code.language-mermaid');

if (blocks.length) {
    const { default: mermaid } = await import('https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.15.0/mermaid.esm.min.mjs');
    const style = getComputedStyle(document.documentElement);
    const prose = getComputedStyle(document.querySelector('.prose'));
    const fontSize = parseFloat(prose.fontSize);

    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: prose.fontFamily,
        fontSize: prose.fontSize,
        themeVariables: {
            darkMode: true,
            background: style.getPropertyValue('--theme-code').trim(),
            primaryColor: style.getPropertyValue('--theme-row').trim(),
            primaryTextColor: style.getPropertyValue('--theme-text').trim(),
            primaryBorderColor: style.getPropertyValue('--theme-border-strong').trim(),
            lineColor: style.getPropertyValue('--theme-link').trim(),
            fontFamily: prose.fontFamily,
            fontSize: prose.fontSize,
        },
        sequence: {
            useMaxWidth: true,
            diagramMarginX: 10,
            diagramMarginY: 4,
            actorMargin: 30,
            width: 110,
            height: 36,
            messageMargin: 24,
            noteMargin: 6,
            mirrorActors: true,
            actorFontFamily: prose.fontFamily,
            messageFontFamily: prose.fontFamily,
            noteFontFamily: prose.fontFamily,
            actorFontSize: fontSize,
            messageFontSize: fontSize,
            noteFontSize: fontSize,
        },
    });

    const diagrams = Array.from(blocks, block => {
        const diagram = document.createElement('pre');
        diagram.className = 'mermaid';
        diagram.textContent = block.textContent;
        block.parentElement.replaceWith(diagram);
        return diagram;
    });

    await mermaid.run({ nodes: diagrams });
}
