const util = require('node:util');
const _connect = require('../connect');
const query = util.promisify(_connect.query).bind(_connect);

class Payment {
}

Payment.getAll = async function (req, callback) {
    let _page = req.query.page ? req.query.page : 1;
    let data = await query("select count(*) as total from payments");
    let rows = data[0].total;
    let _limit = 3;
    let start_limit = (_page - 1)*_limit;
    let id = req.query.ord_id;
    let qry = "select * from payments";
    if (id) {
        qry += " where ord_id = ?";
    }
    qry += " limit " + start_limit + ", " + _limit;
    let totalPage = Math.ceil(rows/_limit)
    _connect.query(qry,[id],function(err, data){
        callback(err, data, totalPage, _page);
    });
}

Payment.edit_payment = async function(req, callback){
    let id = req.params.ord_id;
    await query("select * from payments where ord_id = ?",[id], (err,result)=>{
            if (err) {
                console.log(err);
            }
            else {
                callback(result);
            }
    });
}

Payment.save_payment = async function(req, callback) {
    let ord_id = req.body.ord_id;
    let cus_id = req.body.cus_id;
    let deposit = req.body.deposit;
    let status = req.body.status;

    let checkExistenceQuery = "SELECT * FROM payments WHERE ord_id = ?";
    _connect.query(checkExistenceQuery, [ord_id], async function(err, data) {
        if (err) {
            console.log(err);
        } else if (data.length === 0) {
            console.error('Thanh toán không tồn tại');
        } else {
            // Get the car_id from the order
            let getCarIdQuery = "SELECT car_id FROM orders WHERE ord_id = ?";
            let carIdData = await query(getCarIdQuery, [ord_id]);
            let car_id = carIdData[0].car_id;

            // Get the price of the car
            let getPriceQuery = "SELECT price FROM cars WHERE car_id = ?";
            let priceData = await query(getPriceQuery, [car_id]);
            let price = priceData[0].price;

            // Calculate the debt
            let debt = price - deposit;

            let qry = "update payments set cus_id = ?, deposit = ?, status = ?, debt = ? where ord_id = ?";
            try {
                _connect.query(qry, [cus_id, deposit, status, debt, ord_id], function(err,data){
                    callback(err, data);
                });
            } catch (error) {
                console.error(error);
                res.send('Có lỗi xảy ra');
            }
        }
    });
}

module.exports = Payment;