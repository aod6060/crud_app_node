const express = require('express')
const app = express()
const port = 3000

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("./database.db")

const bodyParser = require('body-parser')


app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

// View all / root
app.get('/', (req, res) => {
    db.all("SELECT * FROM message", (err, rows) => {
        console.log(rows)
        res.render('view_all', {rows: rows})
    });
   //app.render('view_all')
});

// New Message
app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', (req, res) => {
    db.run("INSERT INTO message (message) VALUES (?)", req.body.message);
    res.redirect('/')
});

// Edit Message
app.get('/edit/:id', (req, res) => {
    db.all('SELECT * FROM message WHERE id='+req.params.id, (err, rows) => {
        console.log(rows);
        res.render('edit', {rows: rows, id: req.params.id});
    });
});

app.post('/edit/:id', (req, res) => {
    db.run("UPDATE message SET message=? WHERE id=?", req.body.message, req.params.id);
    res.redirect('/edit/'+req.params.id);
});


// Delete Message
app.get('/delete/:id', (req, res) => {
    db.all("SELECT * FROM message WHERE id="+req.params.id, (err, rows) => {
        console.log(rows);
        res.render('delete', {rows: rows, id: req.params.id});
    });
});

app.post('/delete/:id', (req, res) => {
    db.run('DELETE FROM message WHERE id=?', req.params.id);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});