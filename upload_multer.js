const multer = require('multer');
var storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'public/img');
    },
    filename : (req, file, callback) =>{
        callback(null, file.originalname)
    }
});

const upload = multer({storage:storage});
module.exports = upload;