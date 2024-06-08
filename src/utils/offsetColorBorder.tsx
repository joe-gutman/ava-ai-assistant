// create a border on element/s with className that is darker or lighter than the element
const OffsetColorBorder = (params) => {
    Object.entries(params).forEach(([className, offset]) => {
        // console.log(`Key: ${key}, Value: ${value}`);
        const elements = document.querySelectorAll('.' + className);
        elements.forEach((e) => {
            let backgroundColor = rgbToHex(window.getComputedStyle(e).backgroundColor);
            console.log(e, backgroundColor);
            e.style.borderColor = adjustBrightness(backgroundColor, offset);
        });
    });
};

const rgbToHex = (rgb: string): string => {
    // Parse the RGB values, ignoring the alpha channel
    const values = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/).slice(1, 4).map(Number);
    // Convert RGB to hexadecimal
    const hex = "#" + values.map(v => {
        const hexValue = v.toString(16).padStart(2, '0');
        return hexValue;
    }).join("");
    return hex;
};

const adjustBrightness = (hex: string, percent: number): string => {
    let num = parseInt(hex.replace("#", ""), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = (num >> 8 & 0x00FF) + amt;
    let B = (num & 0x0000FF) + amt;

    R = R < 255 ? (R < 0 ? 0 : R) : 255;
    G = G < 255 ? (G < 0 ? 0 : G) : 255;
    B = B < 255 ? (B < 0 ? 0 : B) : 255;

    return `#${(
        0x1000000 +
        R * 0x10000 +
        G * 0x100 +
        B
    ).toString(16).slice(1).toUpperCase()}`;
};

export default OffsetColorBorder;
