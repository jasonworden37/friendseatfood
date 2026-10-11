// Tiny turkeys running around the page. Styles live in style.css (.turkey).
(function () {
    const turkeySvg = `
        <svg viewBox="0 0 60 60" aria-hidden="true">
            <g class="turkey-tail">
                <ellipse cx="22" cy="16" rx="5" ry="14" fill="#c0392b" transform="rotate(-60 22 34)"/>
                <ellipse cx="22" cy="16" rx="5" ry="14" fill="#e67e22" transform="rotate(-30 22 34)"/>
                <ellipse cx="22" cy="16" rx="5" ry="14" fill="#f1c40f" transform="rotate(0 22 34)"/>
                <ellipse cx="22" cy="16" rx="5" ry="14" fill="#e67e22" transform="rotate(30 22 34)"/>
                <ellipse cx="22" cy="16" rx="5" ry="14" fill="#c0392b" transform="rotate(60 22 34)"/>
            </g>
            <line class="turkey-leg" x1="25" y1="44" x2="23" y2="56" stroke="#e6a23c" stroke-width="3" stroke-linecap="round"/>
            <line class="turkey-leg turkey-leg-b" x1="31" y1="44" x2="33" y2="56" stroke="#e6a23c" stroke-width="3" stroke-linecap="round"/>
            <ellipse cx="28" cy="36" rx="13" ry="11" fill="#7a4a2a"/>
            <circle cx="40" cy="24" r="6.5" fill="#8b5a3c"/>
            <circle cx="42" cy="22" r="2" fill="#fff"/>
            <circle cx="42.6" cy="22" r="1" fill="#222"/>
            <polygon points="45.5,23 51,25.5 45.5,27.5" fill="#f1c40f"/>
            <path d="M44 27 q3 5 -0.5 7 q-2 -3 0.5 -7z" fill="#d63031"/>
        </svg>`;

    // [css class, speech bubble]
    const turkeys = [
        ['t1', ''],
        ['t2', ''],
        ['t3', ''],
        ['t4', 'gobble!'],
        ['t5', 'not the turkey!!'],
    ];

    const layer = document.createElement('div');
    layer.className = 'turkey-layer';
    layer.setAttribute('aria-hidden', 'true');

    turkeys.forEach(([cls, bubble]) => {
        const turkey = document.createElement('div');
        turkey.className = 'turkey ' + cls;
        turkey.innerHTML = turkeySvg + (bubble ? `<span class="turkey-bubble">${bubble}</span>` : '');
        layer.appendChild(turkey);
    });

    document.body.prepend(layer);
})();
