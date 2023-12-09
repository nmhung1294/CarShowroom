const util = require('node:util');
const _connect = require('../connect');
const query = util.promisify(_connect.query).bind(_connect);

class Car {
}

Car.getAll = async function (req, callback) {
    let _page = req.query.page ? req.query.page : 1;
    let data = await query("select count(*) as total from cars");
    let rows = data[0].total;
    
    let _limit = 3;
    let start_limit = (_page - 1)*_limit;
    let id = req.query.name;
    let qry = "select * from cars";
    if (id) {
        qry += " where car_id = ?";
    }
    qry += " limit " + start_limit + ", " + _limit;
    let totalPage = Math.ceil(rows/_limit)
    await query(qry,[id],function(err, data){
        callback(err, data, totalPage, _page);
    });
}


Car.edit_cars = async function(req, callback){
    let id = req.params.car_id;
    await query("select * from cars where car_id = ?",[id], (err,result)=>{
            if (err) {
                res.send("Server error: " + err);
            }
            else {
                callback(result);
            }
    });
}

