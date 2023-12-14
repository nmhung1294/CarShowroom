const Employee = require('../model/employeesModel');

exports.employees =  async function(req, res){
    Employee.getAll(req, function (err, result, totalPage, _page, id){
        res.render('employees',{
            employees_res : result,
            totalPage : totalPage,
            _page: _page,
            id : id
        });
    })
}

exports.edit_employee= async function(req, res) {
    Employee.edit_employee(req, function(result){
        res.render('edit-employee',{
            res : result[0]
        });
    });
}

exports.save_employee = async function(req, res) {
    Employee.save_salesman(req, function(){
        res.redirect('/employees');
    })
}

exports.add_employees = async function(req, res) {
    res.render('add-employees');
}

exports.add_employee = async function(req, res) {
    Employee.add_salesman(req, function(){
        res.redirect('/employees');
    })
}

exports.del_salesman = async function(req, res) {
    Employee.delete_salesman(req, function() {
        res.redirect('/employees');
    })
}