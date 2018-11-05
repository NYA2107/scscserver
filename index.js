const bodyParser = require('body-parser')
const sql = require('mysql')
const express = require('express')
const app = express()
const port = 2000
const User = require('./user.js')

//CREATE CONNECTION
const conn = sql.createConnection({
	host     : 'sql12.freemysqlhosting.net',
  	user     : 'sql12264262',
  	password : 'cly7v3qe6M',
  	database : 'sql12264262'
})

//ESTABILISH CONNECTION
conn.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + conn.threadId);
});

//JSON PARSER MIDLEWARE
app.use(bodyParser.json());

//CREATE USER QUERY OBJECT
const userQuery = new User(conn);

//GET "/"
app.get('/',(req, res)=>{
	res.send("<h1>HALLO</h1>")
})

//LOGIN
app.get('/allUser', (req, res) => {
	const data = userQuery.getAllUser();
	data
	.then(result =>{
		res.json(result);
	})
	.catch(error =>{
		res.status(400).json(error);
	});
});

//REGISTER
app.post('/register', (req, res) => {
	const data = userQuery.addUser(req.body.username,req.body.password);
	data
	.then(result =>{
		res.json({
			msg:"suckseed"
		});
	})
	.catch(error =>{
		res.status(400).json(error);
	});
});


//PORT LISTENER
app.listen(port, () => console.log(`Example app listening on port ${port}!`))