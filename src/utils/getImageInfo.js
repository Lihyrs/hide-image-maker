import tmpElement from './tmpEleInstanceMaker';
import grayscale from '../processer/grayscale';

function getImageInfo(image, wannaGray = false) {
    let img;
    let src;
    let pixels;

    src = image.src;

    if (!src) {
        return Promise.reject(new Error('非法参数'));
    }

    img = tmpElement.getInstance().create('img');

    if (!img) {
        return new Promise().reject(new Error('无法创建元素'));
    }

    return new Promise((resolve, reject) => {
        img.onload = () => {
            let gs; let height; let width;

            height = img.naturalHeight;
            width = img.naturalWidth;

            if (!wannaGray) {
                let cvs; let ctx;

                cvs = tmpElement.getInstance().create('canvas');
                cvs.height = height;
                cvs.width = width;

                ctx = cvs.getContext('2d');
                ctx.drawImage(img, 0, 0);

                pixels = ctx.getImageData(0, 0, width, height).data;

                tmpElement.getInstance().removeElement(cvs.id);
            } else {
                gs = grayscale.create(img);
                pixels = gs.pixels;
                src = gs.base64;
            }


            resolve({
                pixels,
                width,
                height,
                src,
            });
        };

        img.onerror = (e) => {
            reject(e);
        };

        img.src = src;
    });
}

export default getImageInfo;
