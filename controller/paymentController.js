const Payment = require('../model/paymentModel');

exports.payments=  async function(req, res){
    Payment.getAll(req, function (err, result, totalPage, _page){
        if (err) console.log(err);
        res.render('payments',{
            res : result,
            totalPage : totalPage,
            _page: _page
        });
    })
}

exports.editPayment = function(req, res) {
    Payment.edit_payment(req, function(result){
        res.render('edit-payments', {
            res : result[0]
        });
    })
}

exports.savePayment = function(req, res) {
    Payment.save_payment(req, function(err,data) {
        if (err) console.log(err);
        res.redirect('/payments');
    })
}