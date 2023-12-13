const carCtrl = require('../controller/carsController');
const upload = require('../upload_multer')

module.exports = function(app) {
    app.get('/cars',carCtrl.cars);
    app.get('/add-cars', carCtrl.add_car);
    app.post('/add-cars',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), carCtrl.add_cars);
}