import { engineName } from "../parameters/index";

if (engineName === 'MV') {
    ImageManager.loadLight = function(filename) {
        return this.loadBitmap('img/lights/', filename.substring(0, filename.length), true);
    };
} else {
    ImageManager.loadLight = function(filename) {
        const url = 'img/lights/' + Utils.encodeURI(filename + '.png');
        return Bitmap.load(url);
    };
}