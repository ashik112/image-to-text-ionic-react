import { createWorker, PSM, OEM } from 'tesseract.js';
import Jimp  from 'jimp';

const worker = createWorker({
  logger: m => console.log(m),
});

const formatNormalImage = (imageData) => {
  return new Promise( async (resolve, reject) => {
    try {
      await Jimp.read(imageData)
        .then(image => {
          image.quality(100)
            .resize(Jimp.AUTO, 400)
//            .autocrop().scaleToFit(256, 256)
//            .rgba(false)
            .greyscale() // set greyscale
            .contrast(1)
//            .invert()
//            .color([{apply: 'desaturate', params: [90]}])
            .getBase64(Jimp.MIME_PNG, async (err, src) => {
              if(!err) {
                console.log(src);
                resolve(src);
              } else {
                reject(err);
              }
            });
        })
        .catch(err => {
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
};

const formatBase64Image = (imageData) => {
  return new Promise( async (resolve, reject) => {
    try {
      const buffer = await Buffer.from(imageData.slice(imageData.indexOf('base64') + 7), 'base64');
      await Jimp.read(buffer, (err, image) => {
        if (err) {
          reject(err);
        }
        else {
          image.quality(100)
            .contrast(1)
            .resize(Jimp.AUTO, 500)
            .color([{apply: 'desaturate', params: [90]}])
            .greyscale() // set greyscale
            .getBase64(Jimp.MIME_PNG, async (err, src) => {
              if(!err) {
                console.log(src);
                resolve(src);
              } else {
                reject(err);
              }
            });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

const doOCR = async (img) => {
  let imageData = null;
  try {
    if(img.toString().includes('base64')) {
      imageData = await formatBase64Image(img);
    } else {
      imageData = await formatNormalImage(img);
    }
    await worker.load();
    await worker.loadLanguage('ben');
    await worker.initialize('ben');
    await worker.setParameters({
//      lang: 'eng',
//      init_oem: OEM.TESSERACT_ONLY,
//      tessedit_char_whitelist: '0123456789',
//      tessedit_pageseg_mode: 1,
//      textord_tabfind_find_tables: true,
//      textord_tablefind_recognize_tables: true,
    });
    const { data } = await worker.recognize(imageData);
    await worker.terminate();
    return {
      data: {
        image: imageData,
        text: data.text,
        details: data,
      }
    }
  }catch (e) {
    console.log(e);
  }
};
export {
  doOCR,
};
