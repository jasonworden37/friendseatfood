// Tiny turkeys running around the page. Click/tap one to bonk it and score.
// Styles live in style.css (.turkey).
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

    // [css class, speech bubble, points, seconds per lap (min, max)]
    // Turkeys with a bubble always run right so the text isn't mirrored.
    const turkeys = [
        ['t1', '', 1, 9, 22],
        ['t2', '', 1, 9, 22],
        ['t3', '', 2, 7, 16],
        ['t4', 'gobble!', 1, 10, 24],
        ['t5', 'not the turkey!!', 5, 7, 14],
    ];

    const featherColors = ['#c0392b', '#e67e22', '#f1c40f', '#7a4a2a'];
    const respawnMs = 2500;

    let score = 0;

    const layer = document.createElement('div');
    layer.className = 'turkey-layer';

    const scoreboard = document.createElement('div');
    scoreboard.className = 'turkey-score';
    layer.appendChild(scoreboard);

    function renderScore() {
        scoreboard.textContent = `Turkeys: ${score}`;
        scoreboard.classList.toggle('visible', score > 0);
    }

    function burst(x, y, points) {
        for (let i = 0; i < 8; i++) {
            const feather = document.createElement('span');
            feather.className = 'turkey-feather';
            const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
            const dist = 30 + Math.random() * 30;
            feather.style.left = x + 'px';
            feather.style.top = y + 'px';
            feather.style.background = featherColors[i % featherColors.length];
            feather.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
            feather.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
            feather.style.setProperty('--rot', Math.random() * 360 + 'deg');
            layer.appendChild(feather);
            setTimeout(() => feather.remove(), 900);
        }

        const plus = document.createElement('span');
        plus.className = 'turkey-points';
        plus.textContent = '+' + points;
        plus.style.left = x + 'px';
        plus.style.top = y + 'px';
        layer.appendChild(plus);
        setTimeout(() => plus.remove(), 900);
    }

    function random(min, max) {
        return min + Math.random() * (max - min);
    }

    // New speed, height and direction for each lap
    function randomizeRun(turkey, minSec, maxSec, canTurn) {
        turkey.style.top = random(2, 90) + 'vh';
        turkey.style.bottom = 'auto';
        turkey.style.animationDuration = random(minSec, maxSec).toFixed(1) + 's';
        if (canTurn) {
            turkey.style.animationName = Math.random() < 0.5 ? 'run-left' : 'run-right';
        }
    }

    function restartRun(turkey, minSec, maxSec, canTurn) {
        turkey.style.animation = 'none';
        void turkey.offsetWidth;
        turkey.style.animation = '';
        turkey.style.animationDelay = '0s';
        randomizeRun(turkey, minSec, maxSec, canTurn);
    }

    function bonk(turkey, points, event, respawn) {
        if (turkey.classList.contains('dead')) {
            return;
        }
        event.preventDefault();
        turkey.classList.add('dead');

        score += points;
        renderScore();

        const rect = turkey.getBoundingClientRect();
        burst(rect.left + rect.width / 2, rect.top + rect.height / 2, points);

        // Respawn from the edge of the screen
        setTimeout(() => {
            turkey.classList.remove('dead');
            respawn();
        }, respawnMs);
    }

    turkeys.forEach(([cls, bubble, points, minSec, maxSec]) => {
        const turkey = document.createElement('div');
        turkey.className = 'turkey ' + cls;
        turkey.setAttribute('aria-hidden', 'true');
        turkey.innerHTML = turkeySvg + (bubble ? `<span class="turkey-bubble">${bubble}</span>` : '');

        const canTurn = !bubble;
        const respawn = () => restartRun(turkey, minSec, maxSec, canTurn);

        turkey.addEventListener('pointerdown', (event) => bonk(turkey, points, event, respawn));
        // Leg and bob animations bubble up here too, so only react to the run itself
        turkey.addEventListener('animationiteration', (event) => {
            if (event.target === turkey) {
                respawn();
            }
        });

        // Keep the staggered start from the CSS delays, but randomize the first lap
        randomizeRun(turkey, minSec, maxSec, canTurn);
        layer.appendChild(turkey);
    });

    renderScore();
    document.body.prepend(layer);
})();
