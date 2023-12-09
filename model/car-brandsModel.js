const util = require('node:util');
const _connect = require('../connect');
const query = util.promisify(_connect.query).bind(_connect);

class Brand {
}

Brand.getAll = async function (req, callback) {
    let _page = req.query.page ? req.query.page : 1;
    let data = await query("select count(*) as total from carbrands");
    let rows = data[0].total;
    
    let _limit = 3;
    let start_limit = (_page - 1)*_limit;
    let id = req.query.name;
    let qry = "select * from carbrands";
    if (id) {
        qry += " where bra_id = ?";
    }
    qry += " limit " + start_limit + ", " + _limit;
    let totalPage = Math.ceil(rows/_limit)
    await query(qry,[id],function(err, data){
        callback(err, data, totalPage, _page);
    });
}

Brand.edit_carbrands = async function(req, callback){
    let id = req.params.bra_id;
    await query("select * from carbrands where bra_id = ?",[id], (err,result)=>{
            if (err) {
                res.send("Server error: " + err);
            }
            else {
                callback(result);
            }
    });
}

Brand.save_carbrands = function(req, callback) {
    let bra_id = req.body.bra_id;
    let brand_name = req.body.name;
    let description = req.body.description;
    let qry = "UPDATE carbrands SET brand_name = ?, description = ? WHERE bra_id = ?";
    try {
        _connect.query(qry, [brand_name, description, bra_id], function(err, data){
            callback(err, data);

        });
    } catch (error) {
        console.error(error);
    }
}


Brand.add_carbrand = async function(req, callback) {
    let brand_name = req.body.brand_name;
    let description = req.body.description;
    let data = await query("select count(*) as total from carbrands");
    let rows = data[0].total;
    let bra_id = brand_name.slice(0, 3).toUpperCase() + (rows + 1);
    try {
        let qry = "INSERT INTO carbrands VALUES (?, ?, ?)";
        await query(qry, [bra_id, brand_name, description]);
        callback();
    } catch (error) {
        console.error(error);
    }
}

Brand.del_carbrands = function(req, callback){
    let bra_id_to_delete = req.params.bra_id; // bra_id bạn muốn xóa

    // Xóa hoặc cập nhật các dòng tương ứng trong bảng 'cars'
    let sql = `DELETE FROM cars WHERE bra_id = ?`;
    let data = [bra_id_to_delete];
    _connect.query(sql, data, (error, results) => {
        if (error) {
            return console.error(error.message);
        }
             // Xóa hoặc cập nhật các dòng tương ứng trong bảng 'imports'
        sql = `DELETE FROM imports WHERE bra_id = ?`;
        _connect.query(sql, data, (error, results) => {
            if (error) {
                return console.error(error.message);
            }
        
            // Cuối cùng, xóa dòng trong bảng 'carbrands'
            sql = `DELETE FROM carbrands WHERE bra_id = ?`;
            _connect.query(sql, data, (error, results) => {
                if (error) {
                    return console.error(error.message);
                }
                else {
                    callback();
                }

            });
        });
    });

}
module.exports = Brand;