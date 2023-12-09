const Order = require('../model/ordersModel');

exports.orders =  async function(req, res){
    Order.getAll(req, function (err, result, totalPage, _page){
        if (err) console.log(err);
        res.render('orders',{
            res : result,
            totalPage : totalPage,
            _page: _page
        });
    })
}

exports.addOder = async function(req, res) {
    res.render('add-orders')
}
exports.addOders = async function(req, res) {
    Order.addOrder(req, function(){
        res.redirect('/orders');
    })
}

