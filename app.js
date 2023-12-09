const express = require('express');
const app = express();
const util = require('node:util');
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
// Sử dụng body-parser để lấy dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: true }));

homeRouters(app);
app.get('/manager', function(req, res) {
    res.render('manager')
})
app.get('/cars', function(req, res){
    res.render('cars',{
        totalPage : 10
    });
}) 

ordersRouters(app);
payRouters(app);
cusRouters(app);
brandRouters(app);
employRouters(app);
// app.get('/add-customers', function(req, res){
//     res.render('add-customers');
// });

// app.get('/delete-customer/:cus_id', function(req, res){
//     let id = req.params.cus_id;
    
//     // Xóa các bản ghi liên quan trong bảng logins
//     let deleteLoginsQry = "DELETE FROM logins WHERE cus_id = ?";
    
//     // Xóa các bản ghi liên quan trong bảng orders
//     let deleteOrdersQry = "DELETE FROM orders WHERE cus_id = ?";
    
//     // Xóa các bản ghi liên quan trong bảng payments
//     let deletePaymentsQry = "DELETE FROM payments WHERE cus_id = ?";
    
//     // Xóa khách hàng từ bảng customers
//     let deleteCustomerQry = "DELETE FROM customers WHERE cus_id = ?";
    
//     _connect.query(deleteLoginsQry, [id], function(err, data){
//         if (err) {
//             console.error(err);
//             res.status(500).send("Server error: " + err);
//         } else {
//             _connect.query(deleteOrdersQry, [id], function(err, data){
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send("Server error: " + err);
//                 } else {
//                     _connect.query(deletePaymentsQry, [id], function(err, data){
//                         if (err) {
//                             console.error(err);
//                             res.status(500).send("Server error: " + err);
//                         } else {
//                             _connect.query(deleteCustomerQry, [id], function(err, data){
//                                 if (err) {
//                                     console.error(err);
//                                     res.status(500).send("Server error: " + err);
//                                 } else {
//                                     res.redirect('/customers');
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// });

//Thêm customer từ home
// app.post('/submit-form', async function(req, res) {
//     let _name = req.body.name;
//     let _phoneNumber = req.body.phoneNumber;
//     let _email = req.body.email;
//     let _address = req.body.address;
    
//     // Sử dụng try-catch để xử lý lỗi
//     try {
//         let data = await query("select count(*) as total from customers");
//         let rows = data[0].total;
//         let id = "MHCS"+(rows+1);
//         let qry = "insert into customers values ('"+id + "', '" + _name + "', '" + _email + "','" + _phoneNumber + "','" + _address +"')";
//         await query(qry);
//         setTimeout(()=>{
//             res.redirect('/home');
//         },1500);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Có lỗi xảy ra');
//     }
// });

//update customers
// app.get('/edit-customers/:cus_id', (req,res)=>{
//     let id = req.params.cus_id;
//     _connect.query("select * from customers where cus_id = ?",[id], (err,result)=>{
//             res.render('edit-customers',{
//                 res : result[0]
//             });
//     });
// })
// app.post('/edit-customer', async function(req, res) {
//     let cus_id = req.body.cus_id;
//     let name = req.body.name;
//     let email = req.body.email;
//     let phone_number = req.body.phone_number;
//     let address = req.body.address;

//     let qry = "update customers set name = '"+name+"', email = '"+email+"', phone_number = '"+phone_number+"', address = '"+address+"' where cus_id = '"+cus_id+"'";

//     try {
//         await query(qry);
//         res.redirect('/customers');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Có lỗi xảy ra');
//     }
// });
app.get('/add-cars', function(req, res) {
    res.render('add-cars');
});
app.post('/add-cars', function(req, res){
    
})

//=====================================car_brands==================================//
app.use(express.static('public'));

app.listen(PORT, function() {
    console.log('http://localhost:' + PORT)
})


