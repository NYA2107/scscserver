
class Connection{
	constructor(){
        this.sql = require('mysql')
		return this.sql.createConnection({
			host     : '127.0.0.1',
			user     : 'root',
			password : '',
			database : 'scsc'
		})	
	}
}

module.exports = Connection;