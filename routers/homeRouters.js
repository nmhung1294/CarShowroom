const homeCtrl = require('../controller/homeController');
module.exports = function(app) {
    app.get('/', homeCtrl.home);
    app.get('/home', homeCtrl.home);
    app.get('/api/cars', homeCtrl.getCarsByBrand);
}
