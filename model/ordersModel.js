const util = require('node:util');
const _connect = require('../connect');
const query = util.promisify(_connect.query).bind(_connect);
class Order {
}

Order.getAll = async function (req, callback) {
    let _page = req.query.page ? req.query.page : 1;
    let data = await query("select count(*) as total from orders");
    let rows = data[0].total;
    let _limit = 3;
    let start_limit = (_page - 1)*_limit;
    let id = req.query.ord_id;
    let qry = "select * from orders";
    if (id) {
        qry += " where ord_id = ?";
    }
    qry += " limit " + start_limit + ", " + _limit;
    let totalPage = Math.ceil(rows/_limit)
    _connect.query(qry,[id],function(err, data){
        callback(err, data, totalPage, _page);
    });
}


Order.addOrder = async function(req, callback) {
    let date = req.body.date;
    let status = req.body.status;
    let cus_id = req.body.cus_id;
    let sal_id = req.body.sal_id;
    let car_id = req.body.car_id;
    let data = await query("select count(*) as total from orders");
    let rows = data[0].total;
    let ord_id = "ORD" + (rows + 1);

    // Kiểm tra xem cus_id, sal_id và car_id có tồn tại trong bảng tương ứng không
    let checkCusId = await query("SELECT COUNT(*) as count FROM customers WHERE cus_id = ?", [cus_id]);
    let checkSalId = await query("SELECT COUNT(*) as count FROM salesmen WHERE sal_id = ?", [sal_id]);
    let checkCarId = await query("SELECT COUNT(*) as count FROM cars WHERE car_id = ?", [car_id]);
    if (checkCusId[0].count === 0 || checkSalId[0].count === 0 || checkCarId[0].count === 0) {
        console.error("cus_id, sal_id hoặc car_id không tồn tại trong bảng tương ứng");
        return;
    }

    try {
        let qry = "INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?)";
        await query(qry, [ord_id, date, status, cus_id, sal_id, car_id], function(err, data){
            if (err) console.log(err);
            else {
                // Thêm dữ liệu tương ứng vào bảng payments
                let paymentQry = "INSERT INTO payments (ord_id, cus_id, date, status) VALUES (?, ?, ?,?)";
                query(paymentQry, [ord_id, cus_id, date, status], function(err, data){
                    if (err) console.log(err);
                    else callback();
                });
            }
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = Order;