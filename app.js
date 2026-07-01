function rgbGenerator (){

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor (Math.random() * 256);

    return {r,g,b};
}

function rgbToHsl(r,g,b){
    
    r = r/255;
    g = g/255;
    b = b/255;

    const max = Math.max (r,g,b);
    const min = Math.min (r,g,b);
    const delta = max - min;


    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs (2* lightness-1));

    let hue;

    if (delta === 0){
        hue = 0;
    } else if (max === r){
        hue = ((g-b) / delta) % 6;
    } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  hue = Math.round (hue * 60);
  if (hue < 0) hue += 360;

  return {

    hue : hue,
    saturation : Math.round(saturation * 100),
    lightness : Math.round (lightness * 100)
  };

}


  function colorGenerator(){
    const rgb = rgbGenerator();
    const hsl = rgbToHsl(rgb.r,rgb.g,rgb.b);

    return{
        rgb:rgb,
        hsl:hsl,
    }
  }



 function renderPalette(quantity){
    const container = document.querySelector('.paletteGenerator');
    container.innerHTML ='';

    for (let i = 0; i < quantity; i++){

        let color = colorGenerator();

        if (lockedColors[i]) {
            color = lockedColors[i];
        } else {color = colorGenerator()};

            let r, g, b, hue, saturation, lightness;

        if (lockedColors[i]) {
            r = lockedColors[i].r;
            g = lockedColors[i].g;
            b = lockedColors[i].b;
            const hsl = rgbToHsl(r, g, b);
            hue = hsl.hue;
            saturation = hsl.saturation;
            lightness = hsl.lightness;
        } else {
            const generated = colorGenerator();
            r = generated.rgb.r;
            g = generated.rgb.g;
            b = generated.rgb.b;
            hue = generated.hsl.hue;
            saturation = generated.hsl.saturation;
            lightness = generated.hsl.lightness;
        }


       
        const hex = rgbToHex(r,g,b);
        const colorName = ntc.name(hex)[1];

        const card  = document.createElement('div');
        card.classList.add("colorCard");
        card.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        const textColor = getTextColor(r, g, b);
        card.style.color = textColor;


        card.innerHTML = `
            <div class="colorInfo">
                <span class="rgbLabel">RGB</span>
                <span class="rgbValue">${r}, ${g}, ${b}</span>
                <span class="hslLabel">HSL</span>
                <span class="hslValue">${hue}, ${saturation}, ${lightness}</span>
                <button class="lockBtn">🔒</button>
            </div>
            <span class="colorName">${colorName}</span>
        `;




        container.appendChild(card);
        const rgbValue = card.querySelector('.rgbValue');
        const hslValue = card.querySelector('.hslValue');

    rgbValue.addEventListener('click', function() {
    navigator.clipboard.writeText(`${r}, ${g}, ${b}`);
    showToast('RGB copied!');
});

    hslValue.addEventListener('click', function() {
    navigator.clipboard.writeText(`${hue}, ${saturation}%, ${lightness}%`);
    showToast('HSL copied!');
});
      const lockBtn = card.querySelector('.lockBtn');

      lockBtn.addEventListener('click', function() {
        if (lockedColors[i]) {
            lockedColors[i] = null;
            lockBtn.classList.remove('locked');
        } else {
            lockedColors[i] = {r,g,b};
            lockBtn.classList.add('locked');
        }
      });


    }
    
    updateGradient();

  }

const paletteGeneratorBtn = document.querySelector('.paletteGeneratorBtn');

paletteGeneratorBtn.addEventListener('click', function() {renderPalette(userSelectSize)});

let userSelectSize = 6;
let lockedColors = [];
const sizeBtn = document.querySelectorAll('.sizeBtn');

sizeBtn.forEach(function(btn) {

    btn.addEventListener('click', function(){
        userSelectSize = Number(btn.dataset.size);
        sizeBtn.forEach(function(b){
            b.classList.remove('active');
        })

        btn.classList.add('active');
        renderPalette(userSelectSize);
    })
});

function updateGradient(){
    const footer = document.querySelector('.gradientFooter');
    const cards = document.querySelectorAll('.colorCard');
    const colors = [];

    cards.forEach(function(card){
        colors.push(card.style.backgroundColor);
    });

    footer.style.background = `linear-gradient(to right, ${colors.join(', ')})`;

}

function rgbToHex(r,g,b){
    return '#' + [r,g,b].map(function(value){
        return value.toString(16).padStart(2,'0');
    }).join('');
}

function showToast(message) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(function() {
    toast.classList.remove('visible');
    }, 2000);

}

const savedPaletteBtn = document.querySelector('.savedPaletteBtn');
const paletteName = document.querySelector('.paletteName');

savedPaletteBtn.addEventListener('click', function(){

    const name = paletteName.value;

    if (!name){
        showToast('Please enter a palette name');
        return;
    }

    const cards = document.querySelectorAll('.colorCard');
    const colors = [];

    cards.forEach(function(card) {
        colors.push(card.style.backgroundColor)
    });

    const palette ={
        name : name,
        colors : colors,
    }

    const savedPalettes = JSON.parse(localStorage.getItem('palettes') || '[]');

    savedPalettes.push(palette);
    localStorage.setItem('palettes', JSON.stringify(savedPalettes));
    showToast(`Palette "${name}" saved!`);
    paletteName.value = '';

});

function getTextColor (r,g,b){
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 190 ? '#000000' : '#ffffff';

}