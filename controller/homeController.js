const util = require('node:util');
const _connect = require('../connect');
const query = util.promisify(_connect.query).bind(_connect);
exports.home = function(req, res) {
    const _connect = require('../connect');
    const query = util.promisify(_connect.query).bind(_connect);
    let qry = "select carbrands.bra_id, carbrands.logo from carbrands";
    query(qry, function(err, data){
        if (err) console.log(err);
        res.render('home', {
            result : data
        });
    })
}

exports.getCarsByBrand = function(req, res) {
    const brandId = req.query.brand;
    let qry = brandId ? "SELECT cars.*, brand_name FROM cars JOIN carbrands USING(bra_id) WHERE bra_id = ?" : "SELECT cars.*, brand_name FROM cars JOIN carbrands USING(bra_id)";
    query(qry, [brandId], function(err, data){
        if (err) console.log(err);
        res.json(data);
    })
}


