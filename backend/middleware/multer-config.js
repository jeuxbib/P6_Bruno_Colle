const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        /**Elimine les espaces du nom de fichier
         * les remplaces par des underscors
         * supprime l'extension
         * regénere l'extension et le callback ajoute la date + l'extension au nom
        */
        const name = file.originalname.split(' ').join('_').slice(0,-4);
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');