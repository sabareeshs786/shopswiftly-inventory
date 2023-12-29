const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../../controller/productController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

const uploader = async (req, res, next) => {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, '../images/');
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            },
        });
        const upload = multer({ storage: storage });

        await upload.single('image');
        next();
    }
    catch(error){
        console.log("Error in uploading image : ", error);
    }
}

router.route('/:category')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), productController.getProduct)
    
router.post('/add-product', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), uploader, productController.addProduct)

module.exports = router;