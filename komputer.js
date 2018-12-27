class Komputer{
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
    getKomputer(id){
        const query =  `SELECT * FROM komputer WHERE idKomputer = '${id}'`;
        return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getTanggalValidasi(id){
		const query =  `SELECT tanggalValidasi FROM komputer WHERE idKomputer = '${id}'`;
        return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getTeknisiKomputer(idKomputer){
		const query =  `SELECT teknisi.* FROM komputer, teknisi WHERE komputer.idTeknisi = teknisi.idTeknisi AND idKomputer = '${idKomputer}'`;
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getTeknisi(idTeknisi){
		const query =  `SELECT * FROM teknisi WHERE teknisi.idTeknisi = '${idTeknisi}'`;
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getAdminKomputer(idKomputer){
		const query =  `SELECT admin.* FROM komputer, admin WHERE komputer.idAdmin = admin.idAdmin AND idKomputer = '${idKomputer}'`;
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getKomputerLogin(id,password){
		const query =  `SELECT * FROM komputer WHERE idKomputer = '${id}' AND password = '${password}'`;
        return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getKeluhan(idKomputer){
		const query = `SELECT keluhan FROM keluhan, komputer, memiliki_keluhan WHERE komputer.idKomputer = memiliki_keluhan.idKomputer AND keluhan.idKeluhan = memiliki_keluhan.idKeluhan AND memiliki_keluhan.idKomputer = '${idKomputer}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getKelengkapan(idKomputer){
		const query = `SELECT kelengkapan FROM kelengkapan, komputer, memiliki_kelengkapan WHERE komputer.idKomputer = memiliki_kelengkapan.idKomputer AND kelengkapan.idKelengkapan = memiliki_kelengkapan.idKelengkapan AND memiliki_kelengkapan.idKomputer = '${idKomputer}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getChoosenSolusi(idKomputer){
		const query = `SELECT solusi.solusi, solusi.harga FROM solusi WHERE solusi.idSolusi IN (SELECT permasalahan.IdSolusi FROM permasalahan, solusi, komputer WHERE komputer.idKomputer = permasalahan.idKomputer AND permasalahan.choosen = 1 AND komputer.idKomputer = '${idKomputer}')`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getSolusiDikerjakan(idKomputer){
		const query = `SELECT solusi.solusi, solusi.harga FROM solusi WHERE solusi.idSolusi IN (SELECT solusi_dikerjakan.IdSolusi FROM solusi_dikerjakan, solusi, komputer WHERE komputer.idKomputer = solusi_dikerjakan.idKomputer AND komputer.idKomputer = '${idKomputer}')`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getBiayaTambahan(idKomputer){
		const query = `SELECT biaya_tambahan.tambahan, biaya_tambahan.harga FROM biaya_tambahan WHERE idTambahan IN(SELECT memiliki_biaya_tambahan.idTambahan FROM komputer, memiliki_biaya_tambahan WHERE komputer.idKomputer = memiliki_biaya_tambahan.idKomputer AND komputer.idKomputer = '${idKomputer}')`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getIssuePermasalahan(idKomputer){
		const query = `SELECT DISTINCT issue.idIssue, issue.issue, issue.warnLevel FROM permasalahan, issue, komputer WHERE komputer.idKomputer = permasalahan.idKomputer AND issue.idIssue = permasalahan.idIssue AND komputer.idKomputer = '${idKomputer}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getSolusiPermasalahan(idKomputer){
		const query = `SELECT issue.idIssue, solusi.idSolusi, solusi.solusi, solusi.harga, permasalahan.choosen FROM permasalahan, issue, solusi, komputer WHERE komputer.idKomputer = permasalahan.idKomputer AND issue.idIssue = permasalahan.idIssue AND solusi.idSolusi = permasalahan.IdSolusi AND komputer.idKomputer = '${idKomputer}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	clearChoosenSolusi(id){
		const query = `UPDATE permasalahan SET choosen = NULL WHERE permasalahan.idKomputer = '${id}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	setChoosenSolusi(idKomputer,idSolusi){
		const query = `UPDATE permasalahan SET choosen = 1 WHERE permasalahan.idSolusi = ${idSolusi} AND permasalahan.idKomputer = '${idKomputer}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	setTanggalValidasi(idKomputer, tanggalValidasi){
		const query = `UPDATE komputer SET tanggalValidasi = '${tanggalValidasi}' WHERE komputer.idKomputer = '${idKomputer}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	setTanggalSelesai(idKomputer, tanggalSelesai){
		const query = `UPDATE komputer SET tanggalSelesai = '${tanggalSelesai}' WHERE komputer.idKomputer = '${idKomputer}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	setTanggalDikerjakan(idKomputer, tanggalDikerjakan){
		const query = `UPDATE komputer SET tanggalDikerjakan = '${tanggalDikerjakan}' WHERE komputer.idKomputer = '${idKomputer}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	setDiambil(idKomputer,namaKeluar,tanggalKeluar){
		const query = `UPDATE komputer SET namaKeluar = '${namaKeluar}', tanggalKeluar = '${tanggalKeluar}' WHERE komputer.idKomputer = '${idKomputer}';`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getSemuaKomputer(){
		const query = `SELECT * FROM komputer WHERE 1`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
	getAdminLogin(idAdmin, password){
		const query = `SELECT * FROM admin WHERE idAdmin = '${idAdmin}' AND password = '${password}'`
		return new Promise((resolve,reject)=>{
			this.runQuery(query, resolve, reject);
		})
	}
} 
module.exports = Komputer;
