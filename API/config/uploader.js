const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, `${req.query.id}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500000
    }
});

module.exports = upload;