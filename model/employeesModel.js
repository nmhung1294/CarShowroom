const util = require('node:util');
const _connect = require('../connect');
const query = util.promisify(_connect.query).bind(_connect);
class Employee {
}

Employee.getAll = async function (req, callback) {
    let _page = req.query.page ? req.query.page : 1;
    let data = await query("select count(*) as total from salesmen");
    let rows = data[0].total;
    let _limit = 3;
    let start_limit = (_page - 1)*_limit;
    let id = req.query.sal_id;
    let qry = "select * from salesmen";
    if (id) {
        qry += " where sal_id = ?";
    }
    qry += " limit " + start_limit + ", " + _limit;
    let totalPage = Math.ceil(rows/_limit)
    _connect.query(qry,[id],function(err, data){
        callback(err, data, totalPage, _page);
    });
}

Employee.edit_employee = async function(req, callback){
    let id = req.params.sal_id;
    await query("select * from salesmen where sal_id = ?",[id], (err,result)=>{
            if (err) {
                res.send("Server error: " + err);
            }
            else {
                callback(result);
            }
    });
}

Employee.save_salesman = function(req, callback) {
    let sal_id = req.body.sal_id;
    let name = req.body.name;
    let email = req.body.email;
    let phone_number = req.body.phone_number;
    let position = req.body.position;
    let salary = req.body.salary;
    let report_to = req.body.report_to;
    let checkExistenceQuery = "SELECT * FROM salesmen WHERE sal_id = ?";
    _connect.query(checkExistenceQuery, [report_to], function(err, data) {
        if (err) {
            console.log(err);
        } else if (data.length === 0) {
            console.error('Nhân viên mà nhân viên khác báo cáo đến không tồn tại');
        } else {
            let qry = "update salesmen set name = ?, email = ?, phone_number = ?, position = ?, salary = ?, report_to = ? where sal_id = ?";
            try {
                _connect.query(qry, [name, email, phone_number, position, salary, report_to, sal_id], function(err,data){
                    if(err) console.log(err);
                    else{
                        callback();
                    }
                });
            } catch (error) {
                console.error(error);
                res.send('Có lỗi xảy ra');
            }
        }
    });
}

Employee.add_salesman = async function(req, callback) {
        let name = req.body.new_name;
        let email = req.body.new_email;
        let phone_number = req.body.new_phone_number;
        let position = req.body.new_position;
        let salary = req.body.new_salary;
        let report_to = req.body.new_report_to;
        let data = await query("select count(*) as total from salesmen");
        let rows = data[0].total;
        let sal_id = "MHCS" + (rows + 1);
    
        // Kiểm tra xem report_to có tồn tại trong bảng salesmen không
        let checkReportTo = await query("SELECT COUNT(*) as count FROM salesmen WHERE sal_id = ?", [report_to]);
        if (checkReportTo[0].count === 0) {
            console.error("report_to không tồn tại trong bảng salesmen");
            return;
        }
    
        try {
            let qry = "INSERT INTO salesmen VALUES (?, ?, ?, ?, ?, ?, ?)";
            await query(qry, [sal_id, name, email, phone_number, position, salary, report_to], function(err, data){
                if (err) console.log(err);
                else callback();
            });
        } catch (error) {
            console.error(error);
        }
}

Employee.delete_salesman = async function(req, callback) {
    let sal_id = req.params.sal_id;

    // Kiểm tra xem sal_id có tồn tại trong bảng salesmen không
    let checkSalId = await query("SELECT COUNT(*) as count FROM salesmen WHERE sal_id = ?", [sal_id]);
    if (checkSalId[0].count === 0) {
        console.error("sal_id không tồn tại trong bảng salesmen");
        return;
    }

    // Kiểm tra xem có nhân viên nào đang báo cáo cho nhân viên này không
    let checkReportTo = await query("SELECT COUNT(*) as count FROM salesmen WHERE report_to = ?", [sal_id]);
    if (checkReportTo[0].count > 0) {
        console.error("Có nhân viên đang báo cáo cho nhân viên này, không thể xóa");
        return;
    }

    // Kiểm tra xem nhân viên này có đang được tham chiếu trong bảng logins không
    let checkLogins = await query("SELECT COUNT(*) as count FROM logins WHERE sal_id = ?", [sal_id]);
    if (checkLogins[0].count > 0) {
        console.error("Nhân viên này đang được tham chiếu trong bảng logins, không thể xóa");
        return;
    }

    // Kiểm tra xem nhân viên này có đang được tham chiếu trong bảng orders không
    let checkOrders = await query("SELECT COUNT(*) as count FROM orders WHERE sal_id = ?", [sal_id]);
    if (checkOrders[0].count > 0) {
        console.error("Nhân viên này đang được tham chiếu trong bảng orders, không thể xóa");
        return;
    }

    try {
        let qry = "DELETE FROM salesmen WHERE sal_id = ?";
        await query(qry, [sal_id], function(err, data){
            if (err) console.log(err);
            else callback();
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = Employee;