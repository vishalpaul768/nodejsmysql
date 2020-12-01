var express = require("express");
var mysql = require('mysql');
var bodyParser = require('body-parser');  
const e = require("express");
var cors = require('cors')

var urlencodedParser = bodyParser.urlencoded({ extended: false })  

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});



var app = express();

app.use(cors())

app.use(bodyParser.json())

app.listen(3000, () => {
	console.log("Server running on port 3000");
});

/*Registration Api*/
app.post("/register", (req, res) => {
	let data = [
		req.body.name,
		req.body.email,
		req.body.password,
		req.body.city,
		req.body.state,
		req.body.country,
	];
	var sql = `INSERT INTO users (name, email, password, city, state, country) VALUES (?,?,?,?,?,?)`;
	con.query(sql, data, function (err, result) {
		if (err) {
			res.status(400).json({ error : err.message });
		}
		res.status(200).json({ success: true });
	});
});
/*Registration Api*/

/*Login Api*/
app.post("/login", (req, res) => {
	let data = [
		req.body.email,
		req.body.password
	];
	var sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
	con.query(sql, data, function (err, result) {
		if (err) {
			res.status(400).json(err);
		}
		if (result.length > 0) {
			res.status(200).json(result[0]);
		} else {
			res.status(404).json({
				error: 'Invalid email or pasword.'
			});
		}
	});
});
/*Login Api*/

/*Get Profile Api*/
app.get("/details/:id", urlencodedParser, (req, res) => {
	let data = [
		req.params.id
	];
	var sql = `SELECT * FROM users WHERE id = ?`;
	con.query(sql, data, function (err, result) {
		if (err) {
			res.status(400).json(err);
			return console.error(err.message);
		}
		if (result.length > 0) {
			res.status(200).json(result[0]);
		} else {
			res.status(404).json();
		}
	});
});
/*Get Profile Api*/

/*Profile Update Api*/
app.post("/details/:id", urlencodedParser, (req, res) => {
	let data = [
		req.body.name,
		req.body.email,
		req.body.password,
		req.body.city,
		req.body.state,
		req.body.country,
		req.params.id
	];
	var sql = `UPDATE users SET name = ?, email = ?, password = ?, city = ?, state = ?, country = ? WHERE id = ?`;
	con.query(sql, data, function (err, result) {
		if (err) {
			res.status(400).json({ error : err.message});
			return console.error(err.message);
		}
		res.status(200).json({
			name : req.body.name,
			email: req.body.email,
			password : req.body.password,
			city: req.body.city,
			state: req.body.state,
			country: req.body.country
		});
	});
});
/*Profile Update Api*/