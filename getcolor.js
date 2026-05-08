import { getColorFromURL } from 'color-thief-node';

async function main() {
    try {
        const dominantColor = await getColorFromURL('logo.png');
        console.log('Dominant color RGB:', dominantColor);
        const hex = '#' + dominantColor.map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
        console.log('Dominant color HEX:', hex);
    } catch (e) {
        console.error(e);
    }
}
main();
