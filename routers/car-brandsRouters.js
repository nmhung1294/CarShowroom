const brandCtrl = require('../controller/car-brandsController');

module.exports = function(app) {
    app.get('/car_brands', brandCtrl.brands);
    app.get('/delete-carbrands/:bra_id', brandCtrl.del_carBrands);
    app.get('/edit-carbrands/:bra_id', brandCtrl.edit_carbrands);
    app.get('/add-carbrands', brandCtrl.add_carbrands);
    app.post('/edit-carbrands', brandCtrl.save_carbrands);
    app.post('/add-carbrands', brandCtrl.add_carbrand)
}