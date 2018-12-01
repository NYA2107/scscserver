const bodyParser = require('body-parser')
const sql = require('mysql')
const express = require('express')
var cors = require('cors')
const app = express()
const randomId = require('random-id');
 

// process.env.PORT || 
const port = 2000
const User = require('./user.js')
const Komputer = require('./komputer.js')
const Admin = require('./admin.js')

//CREATE CONNECTION
const conn = sql.createConnection({
	host     : '127.0.0.1',
  	user     : 'root',
  	password : '',
  	database : 'scsc'
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
app.use(cors())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });
  

//CREATE QUERY OBJECT
const userQuery = new User(conn);
const komputerQuery = new Komputer(conn);
const adminQuery = new Admin(conn);

const getRandomId = () =>{
	const len = 10
	const pattern = 'aA0' 
	return randomId(len, pattern)
}

//GET "/"
app.get('/',(req, res)=>{
	res.send({
		hai:'haaaaaa'
	})
})


app.post('/infoMasuk',(req,res)=>{
	const admin = adminQuery.getAdmin(req.body.idAdmin)
	const keluhan = komputerQuery.getKeluhan(req.body.idKomputer)
	const kelengkapan = komputerQuery.getKelengkapan(req.body.idKomputer)
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

})

app.post('/clearSolusi', (req,res)=>{
	const data = komputerQuery.clearSolusi(req.body.idKomputer);
	data
	.then(result =>{
		res.send(result)
	})
	.catch(error =>{
		res.status(400).json(error);
	})
})

app.post('/setSolusi', (req,res)=>{
	const data = komputerQuery.setSolusi(req.body.idKomputer,req.body.idSolusi);
	const setTanggal = komputerQuery.setTanggalValidasi(req.body.idKomputer, req.body.tanggalValidasi)
	Promise.all([data,setTanggal]).then(result=>{
		res.send(result)
	})
	.catch(error =>{
		res.status(400).json(error);
	})
})

app.post('/validasi',(req,res)=>{
	let solArr;
	let issArr;
	const solusi = komputerQuery.getSolusiPermasalahan(req.body.idKomputer)
	solusi.then(result =>{
		// res.send(result)
		solArr = result
		const issue = komputerQuery.getIssuePermasalahan(req.body.idKomputer)
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
			const teknisi = komputerQuery.getTeknisi(req.body.idKomputer)	
			const tanggal = komputerQuery.getTanggalValidasi(req.body.idKomputer)
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
})

app.post('/cancel', (req,res)=>{
	const cancel = komputerQuery.setTanggalDikerjakan(req.body.idKomputer, 'cancel')
	const cancelS = komputerQuery.setTanggalSelesai(req.body.idKomputer, 'cancel')
	Promise.all([cancel,cancelS]).then(result =>{
		const tanggal = komputerQuery.setTanggalValidasi(req.body.idKomputer, req.body.tanggalValidasi)
		tanggal.then(result =>{
			res.send(result)
		})
	})
	.catch(err=>{
		res.send(err)
	})
})

app.post('/dikerjakan', (req,res)=>{
	const teknisi = komputerQuery.getTeknisiKomputer(req.body.idTeknisi)
	const solusi = komputerQuery.getSolusiDikerjakan(req.body.idKomputer)
	teknisi.then(result =>{
		return result
	})
	.then(result =>{
		solusi.then(r=>{
			result[0].solusis = r
			res.send(result)
		})
	})
})

app.post('/selesai', (req,res)=>{
	const teknisi = komputerQuery.getTeknisiKomputer(req.body.idTeknisi)
	const solusi = komputerQuery.getSolusiDikerjakan(req.body.idKomputer)
	const tambahan = komputerQuery.getBiayaTambahan(req.body.idKomputer)
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
	
})

app.post('/diambil', (req,res)=>{
	
})

app.post('/login', (req,res)=>{
	const data = komputerQuery.getKomputerLogin(req.body.idKomputer, req.body.password);
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
})
app.post('/komputer',(req, res)=>{
	const data = komputerQuery.getKomputer(req.body.idKomputer);
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