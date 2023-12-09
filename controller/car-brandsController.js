const Brand = require('../model/car-brandsModel');

exports.add_carbrands = function(req, res) {
    res.render('add-carbrands');
}
exports.del_carBrands = async function(req, res){
    Brand.del_carbrands(req, function(){
        res.redirect('/car_brands');
    });
}
exports.brands = async function(req, res){
    Brand.getAll(req, function (err, result, totalPage, _page){
        res.render('car-brands',{
            res : result,
            totalPage : totalPage,
            _page: _page
        });
    })
}

exports.edit_carbrands = async function(req, res) {
    Brand.edit_carbrands(req, function(result){
        res.render('edit-carbrands',{
            res : result[0]
        });
    });
}
exports.save_carbrands = async function(req, res) {
    Brand.save_carbrands(req,function(err, data){
        if(err) console.log(err);
        res.redirect('/car_brands');
    })
}

exports.add_carbrand = async function(req, res) {
    Brand.add_carbrand(req, function(){
        res.redirect('/car_brands');
    })
}

