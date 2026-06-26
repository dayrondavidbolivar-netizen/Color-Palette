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


  function colorGenerator(){
    const rgb = rgbGenerator();
    const hsl = rgbToHsl(rgb.r,rgb.g,rgb.b);

    return{
        rgb:rgb,
        hsl:hsl,
    }
  }
}



