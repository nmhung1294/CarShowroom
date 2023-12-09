const cusCtrl = require('../controller/customersController');

module.exports=  function(app) {
    app.get('/customers', cusCtrl.customers);
    app.get('/delete-customer/:cus_id', cusCtrl.del_customer);
    app.get('/edit-customers/:cus_id', cusCtrl.edit_customer);
    app.post('/edit-customer', cusCtrl.save_customer);
    app.post('/submit-form', cusCtrl.add_cus_from_cus);
}