import tmpElement from '../utils/tmpEleInstanceMaker';

function img2base64(img, type = 'image/png') {
    let cvs; let ctx; let b64;

    cvs = tmpElement.getInstance().create('canvas');

    cvs.height = img.naturalHeight || img.height;
    cvs.width = img.naturalWidth || img.width;

    ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0);

    b64 = cvs.toDataURL(type);

    tmpElement.getInstance().removeElement(cvs.id);
    cvs = null;
    ctx = null;

    return b64;
}

export default img2base64;
