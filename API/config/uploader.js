const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, `${req.query.id}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (req.query.id === undefined){
        cb(null, false);
        return;
    }
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 500000
    }
});

module.exports = upload;