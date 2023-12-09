const util = require('node:util');
const _connect = require('../connect');
const query = util.promisify(_connect.query).bind(_connect);

class Customer {
}

Customer.getAll = async function (req, callback) {
    let _page = req.query.page ? req.query.page : 1;
    let data = await query("select count(*) as total from customers");
    let rows = data[0].total;
    
    let _limit = 3;
    let start_limit = (_page - 1)*_limit;
    let id = req.query.name;
    let qry = "select * from customers";
    if (id) {
        qry += " where cus_id = ?";
    }
    qry += " limit " + start_limit + ", " + _limit;
    let totalPage = Math.ceil(rows/_limit)
    _connect.query(qry,[id], function(err, data){
        callback(err, data, totalPage, _page);
    });
}

Customer.del_customer = function(req, callback){
    let id = req.params.cus_id;
    
    // Xóa các bản ghi liên quan trong bảng logins
    let deleteLoginsQry = "DELETE FROM logins WHERE cus_id = ?";
    
    // Xóa các bản ghi liên quan trong bảng orders
    let deleteOrdersQry = "DELETE FROM orders WHERE cus_id = ?";
    
    // Xóa các bản ghi liên quan trong bảng payments
    let deletePaymentsQry = "DELETE FROM payments WHERE cus_id = ?";
    
    // Xóa khách hàng từ bảng customers
    let deleteCustomerQry = "DELETE FROM customers WHERE cus_id = ?";
    
    _connect.query(deleteLoginsQry, [id], function(err, data){
        if (err) {
            console.error(err);
            res.status(500).send("Server error: " + err);
        } else {
            _connect.query(deleteOrdersQry, [id], function(err, data){
                if (err) {
                    console.error(err);
                    res.status(500).send("Server error: " + err);
                } else {
                    _connect.query(deletePaymentsQry, [id], function(err, data){
                        if (err) {
                            console.error(err);
                            res.status(500).send("Server error: " + err);
                        } else {
                            _connect.query(deleteCustomerQry, [id], function(err, data){
                                if (err) {
                                    console.error(err);
                                    res.status(500).send("Server error: " + err);
                                } else {
                                    callback();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

Customer.edit_customer = function(req, callback){
    let id = req.params.cus_id;
    _connect.query("select * from customers where cus_id = ?",[id], (err,result)=>{
            if (err) {
                res.send("Server error: " + err);
            }
            else {
                callback(result);
            }
    });
}

Customer.save_customer = function(req, callback) {
    let cus_id = req.body.cus_id;
    let name = req.body.name;
    let email = req.body.email;
    let phone_number = req.body.phone_number;
    let address = req.body.address;
    let qry = "update customers set name = '"+name+"', email = '"+email+"', phone_number = '"+phone_number+"', address = '"+address+"' where cus_id = '"+cus_id+"'";

    try {
        _connect.query(qry);
        callback();
    } catch (error) {
        console.error(error);
        res.send('Có lỗi xảy ra');
    }
}

Customer.add_cus_from_cus = async function(req, callback) {
    let _name = req.body.name;
    let _phoneNumber = req.body.phoneNumber;
    let _email = req.body.email;
    let _address = req.body.address;
    
    // Sử dụng try-catch để xử lý lỗi
    try {
        let data = await query("select count(*) as total from customers");
        let rows = data[0].total + 1;
        let id = `MHCS${rows}`;
        let qry = "insert into customers values ('"+id + "', '" + _name + "', '" + _email + "','" + _phoneNumber + "','" + _address +"')";
        await query(qry);
        setTimeout(()=>{
            callback();
        },1500);
    } catch (error) {
        console.error(error);
        res.send('Có lỗi xảy ra');
    }
}
module.exports = Customer;