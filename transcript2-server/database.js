const sqlite3 = require('sqlite3').verbose();
const util = require('util');

let database = new sqlite3.Database("database.db");
database.run = util.promisify(database.run);
database.all = util.promisify(database.all);

database.run("CREATE TABLE IF NOT EXISTS authTable (username TEXT, password TEXT)");
database.run("CREATE TABLE IF NOT EXISTS saveTable (username TEXT, name TEXT, value TEXT)");

module.exports = {
	checkAuth: async function(username, password) {
		let res = await database.all("SELECT * FROM authTable WHERE username = ? AND password = ?", [ username, password ]);
		return [res.length > 0, null];
	},
	createAuth: async function(username, password) {
		let res = await database.all("SELECT * FROM authTable WHERE username = ?", [ username ]);
		if (res.length > 0) {
			return [null, "Username is already in use."];
		}
		await database.run("INSERT INTO authTable (username, password) VALUES (?, ?)", [ username, password ]);
		return [true, null];
	},
	createSave: async function(username, name, value) {
		let res = await database.all("SELECT * FROM saveTable WHERE username = ? AND name = ?", [ username, name ]);
		if (res.length > 0) {
			return [null, "Name is already in use."];
		}
		await database.run("INSERT INTO saveTable (username, name, value) VALUES (?, ?, ?)", [ username, name, value ]);
		return [true, null];
	},
	updateSave: async function(username, name, value) {
		let res = await database.all("SELECT * FROM saveTable WHERE username = ? AND name = ?", [ username, name ]);
		if (res.length == 0) {
			return [null, "Name not found."];
		}
		await database.run("UPDATE saveTable SET value = ? WHERE username = ? AND name = ?", [ value, username, name ]);
		return [true, null];
	},
	enumSave: async function(username) {
		let _res = await database.all("SELECT * FROM saveTable WHERE username = ?", [ username ]);
		let res = [];
		for (let x of _res) {
			res.push(x.name);
		}
		return [res, null];
	},
	readSave: async function(username, name) {
		let res = await database.all("SELECT * FROM saveTable WHERE username = ? AND name = ?", [ username, name ]);
		if (res.length == 0) {
			return [null, "Name not found."];
		}
		return [JSON.parse(res[0].value), null];
	},
	deleteSave: async function(username, name) {
		await database.run("DELETE FROM saveTable WHERE username = ? AND name = ?", [ username, name ]);
		return [true, null];
	}
};