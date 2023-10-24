const express = require('express');
const _connect = require('./connect')
const app = express();
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.get('', function(req, res){
    res.render('home');
})

app.listen(PORT, function() {
    console.log('http://localhost//' + PORT);
});
