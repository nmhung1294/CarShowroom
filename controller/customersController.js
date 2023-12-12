const util = require('node:util');
const _connect = require('../connect');
const query = util.promisify(_connect.query).bind(_connect);

const Customer = require('../model/customersModel');

exports.customers =  async function(req, res){
    Customer.getAll(req, function (err, result, totalPage, _page, id){
        if (err) console.log(err);
        res.render('customers',{
            res : result,
            totalPage : totalPage,
            _page: _page,
            id: id,
        });
    })
}
exports.del_customer = async function(req, res){
    Customer.del_customer(req, function(){
        res.redirect('/customers');
    });
}

exports.edit_customer = async function(req, res) {
    Customer.edit_customer(req, function(result){
        res.render('edit-customers',{
            res : result[0]
        });
    });
}

exports.save_customer = async function(req, res) {
    Customer.save_customer(req,function(){
        res.redirect('/customers');
    })
}

exports.add_cus_from_cus = async function(req, res) {
    Customer.add_cus_from_cus(req, function(){
        res.redirect('/home');
    })
}

exports.add_cus = async function(req, res) {
    Customer.add_cus(req, function(){
        res.redirect('/customers');
    })
}

exports.add_customer = async function(req, res) {
    res.render('add-customers');
}