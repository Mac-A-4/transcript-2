const express = require('express');
const cookie_session = require('cookie-session');
const cors = require('cors');
const database = require('./database');
const https = require('https');
const fs = require('fs');

const app = express();
app.use(cookie_session({
	maxAge: 6 * 60 * 60 * 1000,
	keys: [ 'sdfghuawhuidaowfhbsevctsftegddwhiduhauihwdgautfvtasegdsyhfuijriodujgudhrygftsefdtry' ]
}));
app.use(cors({
	origin: ['http://localhost:3000', 'http://rivendelltranscript.com'],
	credentials: true
}));
app.use(express.json());
app.use(express.static(__dirname + "/static", {dotfiles: 'allow'}));

app.post('/auth/login', async (req, res) => {
	req.session.username = undefined;
	let username = req.body.username;
	let password = req.body.password;
	let [ success, err ] = await database.checkAuth(username, password);
	res.contentType('text/plain');
	if (err) {
		res.status(400);
		res.send(err);
	}
	else if (success) {
		req.session.username = username;
		res.status(200);
		res.send("Success.");
	}
	else {
		res.status(400);
		res.send("Invalid username or password.");
	}
});

app.get('/auth/check', async (req, res) => {
	res.status(200);
	res.contentType('application/json');
	res.send(JSON.stringify(req.session.username !== undefined));
});

/*
TODO VALIDATE REGISTRATION DETAILS
*/

app.post('/auth/register', async (req, res) => {
	req.session.username = undefined;
	let username = req.body.username;
	let password = req.body.password;
	let [ success, err ] = await database.createAuth(username, password);
	res.contentType('text/plain');
	if (err) {
		res.status(400);
		res.send(err);
	}
	else if (success) {
		req.session.username = username;
		res.status(200);
		res.send("Success.");
	}
	else {
		res.status(400);
		res.send("Error.");
	}
});

app.post('/auth/release', async (req, res) => {
	req.session.username = undefined;
	res.status(200);
	res.contentType('text/plain');
	res.send("Success.");
});

app.post('/save/create', async (req, res) => {
	if (req.session.username === undefined) {
		res.status(403);
		res.contentType('text/plain');
		res.send("Forbidden.");
		return;
	}
	let name = req.body.name;
	let value = req.body.value;
	let [success, err] = await database.createSave(req.session.username, name, value);
	res.contentType('text/plain');
	if (err) {
		res.status(400);
		res.send(err);
	}
	else if (success) {
		res.status(200);
		res.send("Success.");
	}
	else {
		res.status(400);
		res.send("Error.");
	}
});

app.post('/save/update', async (req, res) => {
	if (req.session.username === undefined) {
		res.status(403);
		res.contentType('text/plain');
		res.send("Forbidden.");
		return;
	}
	let name = req.body.name;
	let value = req.body.value;
	res.contentType('text/plain');
	let [success, err] = await database.updateSave(req.session.username, name, value);
	if (err) {
		res.status(400);
		res.send(err);
	}
	else if (success) {
		res.status(200);
		res.send("Success.");
	}
	else {
		res.status(400);
		res.send("Error.");
	}
});

app.get('/save/enum', async (req, res) => {
	if (req.session.username === undefined) {
		res.status(403);
		res.contentType('text/plain');
		res.send("Forbidden.");
		return;
	}
	let [arr, err] = await database.enumSave(req.session.username);
	if (err) {
		res.status(400);
		res.contentType('text/plain');
		res.send(err);
	}
	else {
		res.status(200);
		res.contentType('application/json');
		res.send(JSON.stringify(arr));
	}
});

app.post('/save/read', async (req, res) => {
	if (req.session.username === undefined) {
		res.status(403);
		res.contentType('text/plain');
		res.send("Forbidden.");
		return;
	}
	let name = req.body.name;
	let [val, err] = await database.readSave(req.session.username, name);
	if (err) {
		res.status(400);
		res.contentType('text/plain');
		res.send(err);
	}
	else {
		res.status(200);
		res.contentType('application/json');
		res.send(JSON.stringify(val));
	}
});

app.post('/save/delete', async (req, res) => {
	if (req.session.username === undefined) {
		res.status(403);
		res.contentType('text/plain');
		res.send("Forbidden.");
		return;
	}
	let name = req.body.name;
	await database.deleteSave(req.session.username, name);
	res.status(200);
	res.contentType('text/plain');
	res.send('Success.');
});

const cert = {
	key: fs.readFileSync('/etc/letsencrypt/live/api.rivendelltranscript.com/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/api.rivendelltranscript.com/cert.pem'),
	ca: fs.readFileSync('/etc/letsencrypt/live/api.rivendelltranscript.com/chain.pem')
};

https.createServer(cert, app).listen(443);

//app.listen(80);
