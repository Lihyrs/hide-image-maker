
import grayscale from './processer/grayscale';
import tmpElement from './utils/tmpEleInstanceMaker';
import { COLOR_BLACK_8BIT_VAL, COLOR_WHITE_8BIT_VAL } from './common/constants';
import getImgInfo from './utils/getImageInfo';


class hideImage {
    constructor() {
        this.white = {};
        this.black = {};
    }

    /**
     * 当背景色为白色时，所有具有透明度的白色像素全部显示为纯白色，
     * 而当背景色为黑色时，所有具有透明度的黑色会显示为纯黑色。
     * 因此我们只需要把图片一的所有像素根据其灰度值转换成不同透明度的黑色，
     * 将图片二的所有像素根据其灰度值转换成不同透明度的白色，并将两图的所有像素按照任意规律交叉排列，即可生成隐藏图。
     * 这样当背景色为黑色时，图一的所有像素将会显示为纯黑色
     * @param front {string}
     * @param background {string}
     * @return {Promise.<image base64>}
     */
    async makeHideImage(front, background) {
        let ret;
        let retCtx; let retCvs;
        let wd;
        let ht;
        let tmp;

        if (!front || !background) {
            return Promise.reject(new Error('缺少图像'));
        }

        retCvs = tmpElement.getInstance().create('canvas');
        tmp = new Image();

        tmp.src = front;
        this.white = await getImgInfo(tmp, false);
        tmp.src = background;
        this.black = await getImgInfo(tmp, false);

        wd = Math.max(this.white.width, this.black.width);
        ht = Math.max(this.white.height, this.black.height);


        // 像素数组
        ret = new Uint8ClampedArray(wd * ht * 4);

        this.white.offset = {
            width: wd - this.white.width ? (wd - this.white.width) / 2 : 0,
            height: ht - this.white.height ? (ht - this.white.height) / 2 : 0,
        };
        this.black.offset = {
            width: wd - this.black.width ? (wd - this.black.width) / 2 : 0,
            height: ht - this.black.height ? (ht - this.black.height) / 2 : 0,
        };

        retCvs.width = wd;
        retCvs.height = ht;

        this.making(ret, wd, ht);

        retCtx = retCvs.getContext('2d');
        retCtx.putImageData(new ImageData(ret, wd), 0, 0);

        tmpElement.getInstance().removeElement(retCvs.id);

        return Promise.resolve(retCvs.toDataURL('image/png'));
    }


    making(retPixels, wd, ht) {
        if (!retPixels) {
            return;
        }
        let ret = retPixels;
        for (let x = 0; x < wd; x++) {
            for (let y = 0; y < ht; y++) {
                let validPixel;
                let coorX; let coorY;
                let isFront;

                isFront = (x + y) % 2 === 1;
                validPixel = true;

                if (isFront) {
                    coorX = x - this.white.offset.width;
                    if (coorX > this.white.width - 1) validPixel = false;
                    coorY = y - this.white.offset.height;
                    if (coorY > this.white.height - 1) validPixel = false;
                } else {
                    coorX = x - this.black.offset.width;
                    if (coorX > this.black.width - 1) validPixel = false;
                    coorY = y - this.black.offset.height;
                    if (coorY > this.black.height - 1) validPixel = false;
                }


                validPixel = validPixel && coorX >= 0 && coorY >= 0;
                if (!validPixel) {
                    continue;
                }


                let retIdxBase;
                let imgIdxBase = 0;
                let r; let g; let b;
                let pixels;
                let tmpWd;

                retIdxBase = ((y) * wd + (x)) * 4 - 1;
                pixels = isFront ? this.white.pixels : this.black.pixels;
                tmpWd = isFront ? this.white.width : this.black.width;
                imgIdxBase = ((coorY) * tmpWd + (coorX)) * 4 - 1;
                r = pixels[imgIdxBase + 1];
                g = pixels[imgIdxBase + 2];
                b = pixels[imgIdxBase + 3];


                if (isFront) {
                    // 将所有像素转为黑色
                    ret[retIdxBase + 3] = COLOR_BLACK_8BIT_VAL;
                    ret[retIdxBase + 2] = COLOR_BLACK_8BIT_VAL;
                    ret[retIdxBase + 1] = COLOR_BLACK_8BIT_VAL;
                    // 设定透明度为255 - gray(反相颜色)
                    ret[retIdxBase + 4] = 255 - grayscale.calcGray(r, g, b);
                } else {
                    // 将所有像素转为白色
                    ret[retIdxBase + 3] = COLOR_WHITE_8BIT_VAL;
                    ret[retIdxBase + 2] = COLOR_WHITE_8BIT_VAL;
                    ret[retIdxBase + 1] = COLOR_WHITE_8BIT_VAL;
                    ret[retIdxBase + 4] = grayscale.calcGray(r, g, b);
                }
            }
        }
    }
}

export default hideImage;
