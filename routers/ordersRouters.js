const ordCtrl = require('../controller/ordersController');

module.exports = function(app) {
    app.get('/orders', ordCtrl.orders);
    app.get('/add-orders', ordCtrl.addOder);
    app.post('/add-orders', ordCtrl.addOders);
}