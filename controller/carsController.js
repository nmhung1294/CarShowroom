const  Car = require('../model/carsModel');

exports.cars = async function(req, res){
    Car.getAll(req, function (err, result, totalPage, _page, id){
        if (err) console.log(err);
        res.render('cars',{
            res : result,
            totalPage : totalPage,
            _page: _page,
            id : id
        });
    })
}
exports.add_car = function(req, res) {
    res.render('add-cars');
}
exports.add_cars = async function(req, res) {
    Car.add_cars(req, function(){
        res.redirect('/cars');
    })
}

