const references = document.querySelectorAll('.prose .footnote-ref');

if (references.length) {
    const popup = document.createElement('div');
    popup.className = 'footnote-popup';
    popup.id = 'footnote-popup';
    popup.setAttribute('role', 'dialog');
    popup.hidden = true;
    popup.innerHTML = '<div class="footnote-popup-content"></div><div class="footnote-popup-actions"><a>View in footnotes</a><button type="button" aria-label="Close footnote">×</button></div>';
    document.body.append(popup);

    const content = popup.querySelector('.footnote-popup-content');
    const endnoteLink = popup.querySelector('.footnote-popup-actions a');
    const closeButton = popup.querySelector('button');
    let activeReference;
    let pinned = false;
    let closeTimer;

    function position() {
        if (window.innerWidth <= 600) {
            popup.style.left = '';
            popup.style.top = '';
            return;
        }

        const reference = activeReference.getBoundingClientRect();
        const width = popup.getBoundingClientRect().width;
        const height = popup.getBoundingClientRect().height;
        const left = Math.max(12, Math.min(reference.left - 24, window.innerWidth - width - 12));
        const below = reference.bottom + 10;
        const above = reference.top - height - 10;
        const top = below + height <= window.innerHeight - 12 ? below : Math.max(12, above);
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    }

    function hide() {
        clearTimeout(closeTimer);
        popup.hidden = true;
        activeReference?.setAttribute('aria-expanded', 'false');
        activeReference = undefined;
        pinned = false;
    }

    function show(reference, pin) {
        clearTimeout(closeTimer);
        if (activeReference !== reference) {
            activeReference?.setAttribute('aria-expanded', 'false');
            const note = document.getElementById(reference.getAttribute('href').slice(1));
            const copy = note.cloneNode(true);
            copy.removeAttribute('id');
            copy.querySelectorAll('.footnote-backref').forEach(link => link.remove());
            content.replaceChildren(...copy.childNodes);
            endnoteLink.href = reference.href;
            popup.setAttribute('aria-label', `Footnote ${reference.textContent}`);
            activeReference = reference;
            reference.setAttribute('aria-expanded', 'true');
        }
        pinned = pin;
        popup.hidden = false;
        position();
    }

    function scheduleHide() {
        clearTimeout(closeTimer);
        if (!pinned) closeTimer = setTimeout(() => {
            if (!popup.matches(':hover') && !activeReference?.matches(':hover, :focus')) hide();
        }, 150);
    }

    for (const reference of references) {
        reference.setAttribute('aria-controls', popup.id);
        reference.setAttribute('aria-expanded', 'false');
        reference.setAttribute('aria-haspopup', 'dialog');
        reference.addEventListener('mouseenter', () => {
            if (matchMedia('(hover: hover)').matches && !pinned) show(reference, false);
        });
        reference.addEventListener('mouseleave', scheduleHide);
        reference.addEventListener('focus', () => {
            if (!pinned) show(reference, false);
        });
        reference.addEventListener('blur', scheduleHide);
        reference.addEventListener('click', event => {
            event.preventDefault();
            if (activeReference === reference && pinned) {
                hide();
            } else {
                show(reference, true);
                if (event.detail === 0) closeButton.focus();
            }
        });
    }

    popup.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    popup.addEventListener('mouseleave', scheduleHide);
    closeButton.addEventListener('click', () => {
        const reference = activeReference;
        if (document.activeElement === closeButton) {
            pinned = true;
            reference.focus();
        }
        hide();
    });
    endnoteLink.addEventListener('click', hide);
    document.addEventListener('pointerdown', event => {
        if (activeReference && !popup.contains(event.target) && !activeReference.contains(event.target)) hide();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && activeReference) {
            const reference = activeReference;
            if (popup.contains(document.activeElement)) {
                pinned = true;
                reference.focus();
            }
            hide();
        }
    });
    window.addEventListener('resize', () => {
        if (activeReference) position();
    });
    window.addEventListener('scroll', () => {
        if (activeReference && !pinned) hide();
        else if (activeReference) position();
    }, { passive: true });
}
