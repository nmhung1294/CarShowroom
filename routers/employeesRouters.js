const empCtrl = require('../controller/employeesController');

module.exports=  function(app) {
    app.get('/employees', empCtrl.employees);
    app.get('/add-employee', empCtrl.add_employees);
    app.get('/edit-employee/:sal_id', empCtrl.edit_employee);
    app.post('/edit-employee', empCtrl.save_employee);
    app.post('/add-employees', empCtrl.add_employee);
    app.get('/delete-employee/:sal_id',empCtrl.del_salesman);
}