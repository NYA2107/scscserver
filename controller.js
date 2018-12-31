const Komputer = require('./komputer.js')
const Admin = require('./admin.js')
const Connection = require('./connection.js')
const async = require('async')
const each = require ('async/each')

class Controller{
	constructor(){
		this.conn = new Connection()
		this.komputerQuery = new Komputer(this.conn)
		this.adminQuery = new Admin(this.conn)
	}
	estabilishConnection(){
		this.conn.connect(err => {
			if (err) {
			  console.error('error connecting: ' + err.stack);
			  return;
			}
			console.log('connected as id ' + conn.threadId);
		  });
	}
	login(req,res){
		const data = this.komputerQuery.getKomputerLogin(req.body.idKomputer, req.body.password);
		data
		.then(result =>{
			if(result.length){
				res.json(result[0].idKomputer)
			}else{
				res.status(400).json(error)
			}
		})
		.catch(error =>{
			res.status(400).json('GAGAL');
		})
	}

	infoMasuk(req, res){
		const admin = this.adminQuery.getAdmin(req.body.idAdmin)
		const keluhan = this.komputerQuery.getKeluhan(req.body.idKomputer)
		const kelengkapan = this.komputerQuery.getKelengkapan(req.body.idKomputer)
		Promise.all([admin,keluhan,kelengkapan])
		.then(result =>{
			let temp = []
			temp.push(result[0][0])
			temp[0].keluhan = []
			temp[0].kelengkapan = []
			result[1].forEach(v=>{
				temp[0].keluhan.push(v.keluhan)
			})
			result[2].forEach(v=>{
				temp[0].kelengkapan.push(v.kelengkapan)
			})
			res.json(temp)
		})
	}

	setChoosenSolusi(req,res){
		const data = this.komputerQuery.setChoosenSolusi(req.body.idKomputer,req.body.idSolusi);
		const setTanggal = this.komputerQuery.setTanggalValidasi(req.body.idKomputer, req.body.tanggalValidasi)
		Promise.all([data,setTanggal]).then(result=>{
			res.send(result)
		})
		.catch(error =>{
			res.status(400).json(error);
		})
	}

	clearChoosenSolusi(req, res){
		const data = this.komputerQuery.clearChoosenSolusi(req.body.idKomputer);
		data
		.then(result =>{
			res.send(result)
		})
		.catch(error =>{
			res.status(400).json(error);
		})
	}

	validasi(req,res){
		let solArr;
		let issArr;
		const solusi = this.komputerQuery.getSolusiPermasalahan(req.body.idKomputer)
		solusi.then(result =>{
			// res.send(result)
			solArr = result
			const issue = this.komputerQuery.getIssuePermasalahan(req.body.idKomputer)
			issue.then(result =>{
				issArr = result
				issArr.forEach(v =>{
					v.solusi = []
					v.checked = null
				})
				solArr.forEach(value =>{
					issArr.forEach(v =>{
						if(value.idIssue === v.idIssue){
							v.solusi.push(value)
						}
						if(value.choosen && value.idIssue === v.idIssue){
							v.checked = value.idSolusi
						}
					})
				})
				return issArr 
			})
			.then(result =>{
				const teknisi = this.komputerQuery.getTeknisiKomputer(req.body.idKomputer)	
				const tanggal = this.komputerQuery.getTanggalValidasi(req.body.idKomputer)
				teknisi.then(res =>{
					let temp = res[0]
					temp.issues = result
					return temp
				}).then(r =>{
					return r
				})
				.then(r =>{
					tanggal.then(result =>{
						r.tanggalValidasi = result[0].tanggalValidasi
						res.send(r)
					})
				})	
			})	
		}).catch(error =>{
			res.status(400).json(error);
		})
	}

	cancel(req, res){
		const tanggalDikerjakan = this.komputerQuery.setTanggalDikerjakan(req.body.idKomputer, 'cancel')
		const tanggalSelesai = this.komputerQuery.setTanggalSelesai(req.body.idKomputer, 'cancel')
		Promise.all([tanggalDikerjakan,tanggalSelesai])
		.then(result =>{
			const tanggalValidasi = this.komputerQuery.setTanggalValidasi(req.body.idKomputer, req.body.tanggalValidasi)
			tanggalValidasi.then(result =>{
				res.send(result)
			})
		})
		.catch(err=>{
			res.send(err)
		})
	}

	dikerjakan(req, res){
		const teknisi = this.komputerQuery.getTeknisi(req.body.idTeknisi)
		const solusi = this.komputerQuery.getSolusiDikerjakan(req.body.idKomputer)
		teknisi
		.then(result =>{
			return result
		})
		.then(result =>{
			solusi.then(r=>{
				result[0].solusis = r
				res.send(result)
			})
		})
	}

	selesai(req,res){
		const teknisi = this.komputerQuery.getTeknisi(req.body.idTeknisi)
		const solusi = this.komputerQuery.getSolusiDikerjakan(req.body.idKomputer)
		const tambahan = this.komputerQuery.getBiayaTambahan(req.body.idKomputer)
		teknisi.then(result =>{
			return result
		})
		.then(result =>{
			solusi.then(r=>{
				result[0].solusis = r
				return result
			})
			.then(result =>{
				tambahan.then(re =>{
					result[0].tambahan = re
					res.send(result)
				})
			})
		})
	}
	komputer(req,res){
		const data = this.komputerQuery.getKomputer(req.body.idKomputer);
		data
		.then(result =>{
			let menuDisabled = []
			let tanggalTemp = []
			tanggalTemp.push(result[0].tanggalMasuk)
			tanggalTemp.push(result[0].tanggalValidasi)
			tanggalTemp.push(result[0].tanggalDikerjakan)
			tanggalTemp.push(result[0].tanggalSelesai)
			tanggalTemp.push(result[0].tanggalKeluar)
			tanggalTemp.forEach((v,i)=>{
				if(v){
					menuDisabled.push(false)
				}else{
					menuDisabled.push(true)
				}
			})
			let temp = result;
			temp[0].menuDisabled = menuDisabled
			res.json(temp);
		})
		.catch(error =>{
			res.status(400).json(error);
		})
	}

	semuaKomputer(req,res){
		const data = this.komputerQuery.getSemuaKomputer();
		data
		.then(result =>{
			res.send(result)
		})	
	}

	getIssueSolusi(issue,solusi){
		let solArr;
		let issArr;
		return (
			solusi.then(result =>{
				solArr = result
				return issue
			})
			.then(result =>{
				issArr = result
				issArr.forEach(v =>{
					v.solusi = []
					v.checked = null
				})
				solArr.forEach(value =>{
					issArr.forEach(v =>{
						if(value.idIssue === v.idIssue){
							v.solusi.push(value)
						}
						if(value.choosen && value.idIssue === v.idIssue){
							v.checked = value.idSolusi
						}
					})
				})
				return issArr 
			})
		);
	}

	komputerDetail(req,res){
		const admin 			= this.komputerQuery.getAdminKomputer(req.body.idKomputer)
		const teknisi 			= this.komputerQuery.getTeknisiKomputer(req.body.idKomputer)
		const komputer 			= this.komputerQuery.getKomputer(req.body.idKomputer)
		const kelengkapan 		= this.komputerQuery.getKelengkapan(req.body.idKomputer)
		const keluhan 			= this.komputerQuery.getKeluhan(req.body.idKomputer)
		const issue 			= this.komputerQuery.getIssuePermasalahan(req.body.idKomputer)
		const solusi 			= this.komputerQuery.getSolusiPermasalahan(req.body.idKomputer)
		const solusiDikerjakan	= this.komputerQuery.getSolusiDikerjakan(req.body.idKomputer)
		const choosenSolusi		= this.komputerQuery.getChoosenSolusi(req.body.idKomputer)
		const biayaTambahan		= this.komputerQuery.getBiayaTambahan(req.body.idKomputer)
		const issueSolusi 		= this.getIssueSolusi(issue,solusi)

		const data 				= [
			{
				"tanggalMasuk": null,
				"namaKomputer": null,
				"namaMasuk": null,
				"noHPMasuk": null,
				"namaAdmin": null,
				"noHPAdmin": null,
				"kelengkapan": [],
				"keluhan": []
			},
			{
				"tanggalValidasi": null,
				"catatanTeknisi": null,
				"namaTeknisi": null,
				"noHPTeknisi": null,
				"issueSolusi": [],
				"choosenSolusi": [],
				"totalBiaya": null
			},
			{
				"tanggalDikerjakan":null,
				"solusiDikerjakan": [],
				"totalBiaya": null
			},
			{
				"tanggalSelesai": null,
				"solusiDikerjakan": [],
				"biayaTambahan": [],
				"totalBiaya": null
			},
			{
				"tanggalKeluar": null,
				"namaKeluar": null
			}
		]

		komputer
		.then(result =>{
			let r = result[0]
			data[0].tanggalMasuk 		= 	r.tanggalMasuk
			data[0].namaKomputer 		=  	r.namaKomputer
			data[0].namaMasuk 			=	r.namaMasuk
			data[0].noHPMasuk			=	r.noHP
			data[1].tanggalValidasi 	= 	r.tanggalValidasi
			data[1].catatanTeknisi 		= 	r.catatanTeknisi
			data[2].tanggalDikerjakan	=	r.tanggalDikerjakan
			data[3].tanggalSelesai		=	r.tanggalSelesai
			data[4].tanggalKeluar		=	r.tanggalKeluar
			data[4].namaKeluar			=	r.namaKeluar
			return admin
		})
		.then(result =>{
			
			let r = result[0]
			data[0].namaAdmin			=	r.nama
			data[0].noHPAdmin			=	r.noHP
			return teknisi
		})
		.then(result =>{
			let r = result[0]
			if(result[0] != null){
				data[1].namaTeknisi			=	r.namaTeknisi
				data[1].noHPTeknisi			=	r.noHP
			}
			return issueSolusi
		})
		.then(result =>{
			if(result[0] != null){
				data[1].issueSolusi 		=	result
			}
				return kelengkapan
		})
		.then(result =>{
			if(result[0] != null){
				data[0].kelengkapan = result
			}
			return keluhan
		})
		.then(result =>{
			if(result[0] != null){
				data[0].keluhan = result
			}
			return choosenSolusi
		})
		.then(result =>{
			if(result[0] != null){
				data[1].choosenSolusi =  result
				let totalBiaya = 0
				result.forEach(v =>{
					totalBiaya += v.harga
				})
				data[1].totalBiaya = totalBiaya
			}
			return solusiDikerjakan
		})
		.then(result =>{
			if(result[0] != null){
				data[2].solusiDikerjakan = result
				let totalBiaya = 0
				data[2].solusiDikerjakan.forEach(v =>{
					totalBiaya += v.harga
				})
				data[2].totalBiaya = totalBiaya
				data[3].solusiDikerjakan = result
			}
			return biayaTambahan
		})
		.then(result =>{
			if(result[0] != null){
				data[3].biayaTambahan = result
				let totalBiaya = 0
				data[3].solusiDikerjakan.forEach(v =>{
					totalBiaya += v.harga
				})
				data[3].biayaTambahan.forEach(v =>{
					totalBiaya += v.harga
				})
				data[3].totalBiaya = totalBiaya
			}
			res.send(data)
		})
		.catch(err =>{
			console.log(err)
		})
	}
	ambilKomputer(req,res){
		const ambil = this.komputerQuery.setDiambil(req.body.idKomputer, req.body.namaKeluar, req.body.tanggalKeluar)
		ambil
		.then(result =>{
			res.send('succes')
		})
		.catch(err =>{
			res.send('gagal')
		})
	}
	loginAdmin(req,res){
		const admin = this.komputerQuery.getAdminLogin(req.body.idAdmin, req.body.password)
		admin
		.then(result =>{
			if(result[0] == undefined){
				throw err
			}else{
				res.send(result[0].idAdmin)
			}
		})
		.catch(err =>{
			res.send('gagal')
		})
	}
	admin(req,res){
		const admin = this.adminQuery.getAdmin(req.body.idAdmin)
		admin
		.then(result =>{
			if(result[0] == undefined){
				throw err
			}else{
				res.send(result)
			}
		})
		.catch(err =>{
			res.send('gagal')
		})
	}

	randomId(req,res){
		const randomId = require('random-id');
		const len = 10
		const pattern = 'aA0'
		const checkLoop = true
		const id = randomId(len, pattern)
		console.log('aa')
		const komputer = this.komputerQuery.getKomputer(id)
		komputer
		.then(result =>{
			if(result[0] == undefined){
				res.send(id)
			}else{
				res.send('sudah ada')
			}
		})		
	}
	addKeluhan(req,res){
		const keluhan = this.komputerQuery.addKeluhan(req.body.keluhan)
		keluhan
		.then(result =>{
			res.send('succes')
		})
		.catch(err =>{
			res.status(400).send('error')
		})
	}
	addKelengkapan(req,res){
		const kelengkapan = this.komputerQuery.addKelengkapan(req.body.kelengkapan)
		kelengkapan
		.then(result =>{
			res.send('succes')
		})
		.catch(err =>{
			res.status(400).send('error')
		})
	}
	getAllKeluhan(req,res){
		const keluhan = this.komputerQuery.getAllKeluhan()
		keluhan
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(400).send('error')
		})
	}
	getAllKelengkapan(req,res){
		const kelengkapan = this.komputerQuery.getAllKelengkapan()
		kelengkapan
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(400).send('error')
		})
	}
	addKomputer(req,res){
		const komputer = this.komputerQuery.addKomputer(req.body.idKomputer, req.body.password, req.body.namaKomputer, req.body.noHP, req.body.namaMasuk, req.body.tanggalMasuk, req.body.idAdmin)
		komputer
		.then(result =>{
			req.body.kelengkapan.forEach(v =>{
				this.komputerQuery.addKelengkapanKomputer(req.body.idKomputer, v)
				.then(result =>{
					console.log(result)
				})
				.catch(err =>{
					res.status(400).send(err)
				})
			})
		})
		.then(()=>{
			req.body.keluhan.forEach(v =>{
				this.komputerQuery.addKeluhanKomputer(req.body.idKomputer, v)
				.then(result =>{
					console.log(result)
				})
				.catch(err =>{
					res.status(400).send(err)
				})
			})
		})
		.then(()=>{
			res.send('succes')
		})
		.catch(err =>{
			res.status(400).send(err)
		})
	}
	setPassword(req,res){
		this.komputerQuery.setPassword(req.body.idKomputer, req.body.password)
		.then(result =>{
			res.send('succes')
		})
		.catch(err =>{
			res.status(400).send('error')
		})
	}

	loginTeknisi(req,res){
		const teknisi = this.komputerQuery.getTeknisiLogin(req.body.idTeknisi, req.body.password)
		teknisi
		.then(result =>{
			if(result[0] == undefined){
				throw err
			}else{
				res.send(result[0].idTeknisi)
			}
		})
		.catch(err =>{
			res.send('gagal')
		})
	}
	kerjakan(req,res){
		const teknisi = this.komputerQuery.setIdTeknisiKomputer(req.body.idKomputer, req.body.idTeknisi)
		teknisi
		.then(result =>{
			res.send('succes')
		})
		.catch(err =>{
			res.status(400).send('gagal')
		})
	}
	issueSolusiKomputer(req,res){
		const issue 			= this.komputerQuery.getIssuePermasalahan(req.body.idKomputer)
		const solusi 			= this.komputerQuery.getSolusiPermasalahan(req.body.idKomputer)
		const issueSolusi 		= this.getIssueSolusi(issue,solusi)
		issueSolusi
		.then(result =>{
			res.send(result)
		})
	}
	addIssue(req,res){
		const issue = this.komputerQuery.addIssue(req.body.issue, req.body.warnLevel)
		issue
		.then(result =>{
			res.send('succes')
		})
		.catch(err =>{
			res.status(200).send('gagal')
		})
	}
	addSolusi(req,res){
		const solusi = this.komputerQuery.addSolusi(req.body.solusi, req.body.harga)
		solusi
		.then(result =>{
			res.send('succes')
		})
		.catch(err =>{
			res.status(200).send('gagal')
		})
	}
	addBiayaTambahan(req,res){
		const tambahan = this.komputerQuery.addBiayaTambahan(req.body.tambahan, req.body.harga)
		.then(result =>{
			res.send('succes')
		})
		.catch(err =>{
			res.status(200).send('gagal')
		})
	}
	getAllIssue(req,res){
		const issue = this.komputerQuery.getAllIssue()
		issue
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
	getAllSolusi(req,res){
		const solusi = this.komputerQuery.getAllSolusi()
		solusi
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
	addPermasalahanKomputer(req,res){
		const permasalahan = this.komputerQuery.addPermasalahanKomputer(req.body.idKomputer, req.body.idIssue, req.body.idSolusi)
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
	setTanggalValidasi(req,res){
		const tanggal = this.komputerQuery.setTanggalValidasi(req.body.idKomputer, req.body.tanggalValidasi)
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
	addSolusiDikerjakan(req,res){
		const solusi = this.komputerQuery.addSolusiDikerjakan(req.body.idKomputer,req.body.idSolusi)
		solusi
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
	setTanggalDikerjakan(req,res){
		const tanggal = this.komputerQuery.setTanggalDikerjakan(req.body.idKomputer, req.body.tanggalDikerjakan)
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
	getAllBiayaTambahan(req,res){
		const tambahan = this.komputerQuery.getAllBiayaTambahan()
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
	setBiayaTambahanKomputer(req,res){
		const tambahan = this.komputerQuery.setBiayaTambahanKomputer(req.body.idKomputer, req.body.idTambahan)
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
	setTanggalSelesai(req,res){
		const tanggal = this.komputerQuery.setTanggalSelesai(req.body.idKomputer, req.body.tanggalSelesai)
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
	setCatatanTeknisi(req,res){
		const tanggal = this.komputerQuery.setCatatanTeknisi(req.body.idKomputer, req.body.catatan)
		.then(result =>{
			res.send(result)
		})
		.catch(err =>{
			res.status(200).send(err)
		})
	}
}

module.exports = Controller;