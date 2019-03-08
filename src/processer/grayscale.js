import tmpElement from '../utils/tmpEleInstanceMaker';

class grayscale {
    static calcGray(red, green, blue, weights = {}) {
        let gray;
        const { r, g, b } = weights;
        if (r && g && b) {
            gray = red * r + green * g + blue * b;
        } else {
            gray = red * 0.299 + green * 0.587 + blue * 0.114;
        }

        return gray;
    }

    static create(img, type = 'image/png') {
        let cvs;
        let ctx;
        let gray;
        let imgData;
        let pixels;
        let base64;
        let ht; let wd;

        cvs = tmpElement.getInstance().create('canvas');


        if (!cvs) {
            throw new Error('元素创建失败');
        }

        ht = img.naturalHeight;
        wd = img.naturalWidth;

        cvs.width = wd;
        cvs.height = ht;
        ctx = cvs.getContext('2d');

        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0, 0, wd, ht);
        pixels = imgData.data;

        for (let i = 0; i < pixels.length; i++) {
            gray = grayscale.calcGray(pixels[i], pixels[i + 1], pixels[i + 2]);
            pixels[i] = gray; // red
            pixels[i + 1] = gray; // green
            pixels[i + 2] = gray; // blue
        }

        ctx.putImageData(imgData, 0, 0);

        base64 = cvs.toDataURL(type);

        tmpElement.getInstance().removeElement(cvs.id);
        cvs = null;
        ctx = null;

        return {
            base64,
            pixels,
            width: wd,
            height: ht,
        };
    }
}

export default grayscale;
