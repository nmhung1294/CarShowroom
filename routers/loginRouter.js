const _connect = require('../connect');

module.exports = function(app, sstorage) {
    app.get('/login', function(req, res) {
        res.render('login', {
            err_msg : ''
        })
    });
    app.post('/login', function(req, res) {
        let sql = "select sal_id, email, passwords from logins where email = ? and passwords = ?";
        console.log(req.body);
        _connect.query(sql, [req.body.email, req.body.pass], (err, data) => {
            if (err || data.length == 0) {
                console.log(err);
                res.render('login', {
                    err_msg : "Thông tin đăng nhập không đúng"
                })
            }
            else {
                let acc = JSON.stringify(data[0]);
                sstorage.setItem('manager_login', acc);
                res.redirect('/manager');
            }
        })
    })
}