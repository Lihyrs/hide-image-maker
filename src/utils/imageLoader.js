import img2base64 from '../processer/image2base64';

class imageLoader {
    static http(url) {
        if (!/^https{0,1}:\/{2}/.test(url)) {
            // console.log(url)
            return Promise.reject(new Error('图片地址错误'));
        }
        const img = new Image();
        // 当为线上图片时，需要设置 crossOrigin 属性；
        img.crossOrigin = 'anonymous';
        return new Promise((resolve, reject) => {
            img.onload = () => {
                resolve(img2base64(img));
            };

            img.onerror = (e) => {
                // console.log('http===>', e);
                reject(new Error('image load error'));
            };

            img.src = url;
        });
    }

    // 通过<input type="file" />
    static local(file) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (e) => {
                // console.log('local===>', e);
                reject(new Error('image load error'));
            };

            reader.readAsDataURL(file);
        });
    }
}

export default imageLoader;
