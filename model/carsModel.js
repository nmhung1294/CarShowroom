const util = require('node:util');
const _connect = require('../connect');
const query = util.promisify(_connect.query).bind(_connect);

class Car {
}

Car.getAll = async function (req, callback) {
    let _id = req.query.name;
    let _page = req.query.page ? req.query.page : 1;
    let qryRows = "SELECT COUNT(*) AS total FROM imports INNER JOIN cars on cars.model = imports.car_model";
    if (_id) {
        var id = "%" + _id + "%";
        qryRows += " WHERE imports.car_model LIKE ? OR imports.brand_name LIKE ?";
    }
    let data = await query(qryRows, [id, id]);
    let rows = data[0].total;
    let _limit = 5;
    let start_limit = (_page - 1) * _limit;
    let qry = "SELECT imports.*, cars.Year as publish, cars.status, cars.mileage FROM imports INNER JOIN cars ON imports.car_model = cars.model";
    if (_id) {
        var id = "%" + _id + "%";
        qry += " WHERE imports.imp_id LIKE ? OR imports.car_model LIKE ? OR imports.brand_name LIKE ?";
    }
    qry += " ORDER BY imp_id";
    qry += " LIMIT " + start_limit + ", " + _limit;
    let totalPage = Math.ceil(rows / _limit)
    await query(qry, [id, id, id], function (err, data) {
        callback(err, data, totalPage, _page, id);
    });
}


Car.add_cars = async function (req, callback) {
    try {
        console.log(req.body);
        const brand = req.body.brand;
        const model = req.body.model;
        const priceEach = req.body.priceEach;
        const amount = req.body.amount;
        const publish = req.body.publish;
        const color = req.body.color;
        const status = req.body.status;
        const mileage = req.body.mileage;
        const car_descript = req.body.car_descript;
        const logo = req.files['image1'][0].originalname;
        const car_img = req.files['image2'][0].originalname;
        console.log(logo);
        console.log(car_img);

        let data = await query("select count(*) as total from imports");
        let rows = data[0].total +1;
        let result = await query("SELECT DATE(CURRENT_DATE) as date");
        let date = result[0].date;
    
        let qry = "INSERT INTO imports VALUES (?, ?, ?, ?, ?, ?)";
        await query(qry, [rows, date, amount, priceEach, brand, model]);

        let results = await query('SELECT * FROM carbrands WHERE brand_name = ?', [brand]);
        console.log(results);
        if (results.length === 0) {
            data = await query("select count(*) as total from carbrands");
            rows = data[0].total;
            let bra_id = brand.slice(0, 3).toUpperCase() + (rows + 1);
            console.log(bra_id);
            await query('INSERT INTO carbrands (bra_id, brand_name, description, logo) VALUES (?, ?, ?, ?)', [bra_id, brand,'later',logo]);
            let car_id = (brand.slice(0, 3) + model.slice(0, 3)).toUpperCase();
            console.log(car_id);
            let result = await query(`SELECT bra_id FROM carbrands WHERE brand_name = '${brand}'`);
            let carData = {
                car_id: car_id,
                bra_id: result[0].bra_id,
                model: model,
                Year: publish,
                color: color,
                status: status,
                mileage: mileage,
                price: priceEach,
                car_descript: car_descript,
                image: car_img
            };
            await query(`INSERT INTO cars (car_id, bra_id, model, Year, color, status, mileage, price, car_descript, image) VALUES ('${carData.car_id}', '${carData.bra_id}', '${carData.model}', '${carData.Year}', '${carData.color}', '${carData.status}', ${carData.mileage}, ${carData.price}, '${carData.car_descript}', '${carData.image}')`);
            callback();
        }
    } catch (err) {
        console.log(err);
    }
}



module.exports = Car;