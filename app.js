function generateRandomRGB() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
    };
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

    let hue;
    if (delta === 0) {
        hue = 0;
    } else if (max === r) {
        hue = ((g - b) / delta) % 6;
    } else if (max === g) {
        hue = (b - r) / delta + 2;
    } else {
        hue = (r - g) / delta + 4;
    }

    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;

    return {
        hue,
        saturation: Math.round(saturation * 100),
        lightness: Math.round(lightness * 100),
    };
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b]
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('');
}

function getTextColor(r, g, b) {
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 190 ? '#000000' : '#ffffff';
}

let palette = [];
let userSelectSize = 6;

const container = document.querySelector('.paletteGenerator');
const paletteGeneratorBtn = document.querySelector('.paletteGeneratorBtn');
const sizeBtns = document.querySelectorAll('.sizeBtn');
const savedPaletteBtn = document.querySelector('.savedPaletteBtn');
const paletteNameInput = document.querySelector('.paletteName');
const toast = document.querySelector('.toast');
const footer = document.querySelector('.gradientFooter');

function fillPalette(size, { regenerateUnlocked = false } = {}) {
    const next = [];

    for (let i = 0; i < size; i++) {
        const existing = palette[i];

        if (existing && (existing.locked || !regenerateUnlocked)) {
            next.push(existing);
        } else {
            next.push({ ...generateRandomRGB(), locked: false });
        }
    }

    palette = next;
}

function renderPalette() {
    container.innerHTML = '';

    palette.forEach((color, index) => {
        const { r, g, b, locked } = color;
        const hsl = rgbToHsl(r, g, b);
        const hex = rgbToHex(r, g, b);
        const colorName = ntc.name(hex)[1];
        const textColor = getTextColor(r, g, b);

        const card = document.createElement('article');
        card.classList.add('colorCard');
        card.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        card.style.color = textColor;

        card.innerHTML = `
            <div class="colorInfo">
                <span class="rgbLabel" id="rgbLabel-${index}">RGB</span>
                <button type="button" class="rgbValue" aria-labelledby="rgbLabel-${index}">${r}, ${g}, ${b}</button>
                <span class="hslLabel" id="hslLabel-${index}">HSL</span>
                <button type="button" class="hslValue" aria-labelledby="hslLabel-${index}">${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%</button>
                <button type="button" class="lockBtn${locked ? ' locked' : ''}" aria-pressed="${locked}" aria-label="${locked ? 'Unlock' : 'Lock'} this color">${locked ? '🔒' : '🔓'}</button>
            </div>
            <span class="colorName">${colorName}</span>
        `;

        container.appendChild(card);

        card.querySelector('.rgbValue').addEventListener('click', () => {
            navigator.clipboard.writeText(`${r}, ${g}, ${b}`);
            showToast('RGB copied!');
        });

        card.querySelector('.hslValue').addEventListener('click', () => {
            navigator.clipboard.writeText(`${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%`);
            showToast('HSL copied!');
        });

        card.querySelector('.lockBtn').addEventListener('click', () => {
            palette[index].locked = !palette[index].locked;
            renderPalette();
        });
    });

    updateGradient();
}

function updateGradient() {
    const colors = palette.map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);
    footer.style.background = `linear-gradient(to right, ${colors.join(', ')})`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('visible'), 2000);
}

paletteGeneratorBtn.addEventListener('click', () => {
    fillPalette(userSelectSize, { regenerateUnlocked: true });
    renderPalette();
});

sizeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        userSelectSize = Number(btn.dataset.size);

        sizeBtns.forEach((b) => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        fillPalette(userSelectSize, { regenerateUnlocked: false });
        renderPalette();
    });
});

savedPaletteBtn.addEventListener('click', () => {
    const name = paletteNameInput.value.trim();

    if (!name) {
        showToast('Please enter a palette name');
        return;
    }

    const colors = palette.map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);
    const savedPalettes = JSON.parse(localStorage.getItem('palettes') || '[]');

    savedPalettes.push({ name, colors });
    localStorage.setItem('palettes', JSON.stringify(savedPalettes));

    showToast(`Palette "${name}" saved!`);
    paletteNameInput.value = '';
});

fillPalette(userSelectSize, { regenerateUnlocked: true });
renderPalette();