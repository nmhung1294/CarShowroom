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

app.get('/manager', checkLogin, function(req, res) {
    let qry = "SELECT COUNT(ord_id) AS total, salesmen.name FROM orders INNER JOIN salesmen USING(sal_id) GROUP BY sal_id, salesmen.name ORDER BY total DESC";
    _connect.query(qry, function(err, data) {
        if (err) console.log(err);
        res.render('manager',{
            result: data
        })
    })
})

app.get('/manager', function(req, res) {
    let qry = "SELECT COUNT(ord_id) AS total, salesmen.name FROM orders INNER JOIN salesmen USING(sal_id) GROUP BY sal_id, salesmen.name ORDER BY total DESC";
    _connect.query(qry, function(err, data) {
        if (err) console.log(err);
        res.render('manager',{
            result: data
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

app.listen(PORT, function() {
    console.log('http://localhost:' + PORT)
})


