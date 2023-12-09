const payCtrl = require('../controller/paymentController');

module.exports = function(app) {
    app.get('/payments', payCtrl.payments);
    app.get('/edit-payments/:ord_id', payCtrl.editPayment);
    app.post('/edit-payments/:ord_id', payCtrl.savePayment);
}