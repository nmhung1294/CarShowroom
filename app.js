const express = require('express');
const app = express();
const sstorage = require('node-sessionstorage');
const login = require('./routers/loginRouter');
const util = require('node:util');
const _connect = require('./connect');
const query = util.promisify(_connect.query).bind(_connect);
const { constrainedMemory } = require('node:process');
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const homeRouters = require('./routers/homeRouters')
const cusRouters = require('./routers/customersRouters')
const brandRouters = require('./routers/car-brandsRouters')
const employRouters = require('./routers/employeesRouters');
const ordersRouters = require('./routers/ordersRouters');
const payRouters = require('./routers/paymentRouters');
const carsRouters = require('./routers/carsRouters');
// Sử dụng body-parser để lấy dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: true }));
homeRouters(app);
login(app, sstorage);

function checkLogin(req, res, next) {
    let acc = sstorage.getItem('manager_login');
    if (!acc) {
        res.redirect('/login');
    } else {
        next();
    }
}

app.get('/manager', checkLogin, async function (req, res) {
    let result = await query("SELECT COUNT(ord_id) AS total, salesmen.name FROM orders INNER JOIN salesmen USING(sal_id) GROUP BY sal_id, salesmen.name ORDER BY total DESC");
    let qry2 = "SELECT import_summary.brand_name, import_summary.car_model, (import_summary.total_quantity - COALESCE(sold_cars.sold_quantity, 0)) as remaining_cars "
                    + "FROM ( " 
                        + "SELECT brand_name, car_model, SUM(quantity) as total_quantity "
                        + "FROM imports "
                        + "GROUP BY brand_name, car_model "
                    + ") as import_summary "
                    + "INNER JOIN cars ON import_summary.car_model = cars.model "
                    + "LEFT JOIN ( "
                        + "SELECT car_id, COUNT(*) as sold_quantity "
                        + "FROM orders "
                        + "GROUP BY car_id "
                    + ") as sold_cars ON cars.car_id = sold_cars.car_id";
    _connect.query(qry2, function(err, data){
        if (err) console.log(err);
        console.log(data);
        res.render('manager', {
            result: result,
            results:data
        })
    })
})


carsRouters(app);
ordersRouters(app);
payRouters(app);
cusRouters(app);
brandRouters(app);
employRouters(app);

//=====================================car_brands==================================//
app.use(express.static('public'));

app.listen(PORT, function () {
    console.log('http://localhost:' + PORT)
})


