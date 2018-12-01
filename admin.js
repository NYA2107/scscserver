
class Admin{
	constructor(conn){
		this.conn = conn;
	}
	runQuery(query, resolve, reject){
		this.conn.query(query,(error, results, fields) => {
			if(error){
				reject({msg:error})
			}else{
				resolve(results);	
			}
		});
    }
    getAdmin(id){
        const query =  `SELECT * FROM admin WHERE idAdmin = '${id}'`;
        return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
} 
module.exports = Admin;
