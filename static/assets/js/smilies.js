document.addEventListener("DOMContentLoaded", () => {
    const smilies = {
        ":)": "emoticon_smile",
        ";)": "emoticon_wink",
        ":D": "emoticon_grin",
        ":(": "emoticon_unhappy",
        ":P": "emoticon_tongue",
        ":O": "emoticon_surprised",
        ":lol:": "emoticon_happy",
        ":evil:": "emoticon_evilgrin",
        "^_^": "emoticon_waii",
    };
    const pattern = /(^|[\s(])(:lol:|:evil:|\^_\^|:\)|;\)|:D|:\(|:P|:O)(?=$|[\s.,!?;:])/g;
    const walker = document.createTreeWalker(
        document.querySelector("main"),
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                return node.parentElement.closest("pre, code, a, script, style")
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT;
            },
        },
    );
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
        const text = node.textContent;
        pattern.lastIndex = 0;
        if (!pattern.test(text)) continue;
        pattern.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let offset = 0;
        for (const match of text.matchAll(pattern)) {
            fragment.append(text.slice(offset, match.index) + match[1]);
            const image = document.createElement("img");
            image.className = "smilie";
            image.src = `/assets/silk/${smilies[match[2]]}.png`;
            image.alt = match[2];
            fragment.append(image);
            offset = match.index + match[0].length;
        }
        fragment.append(text.slice(offset));
        node.replaceWith(fragment);
    }
});
