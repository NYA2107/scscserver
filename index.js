const bodyParser = require('body-parser')
const express = require('express')
var cors = require('cors')
const app = express()
const Controller = require('./controller.js')

// process.env.PORT || 
const port = 2000

//JSON PARSER MIDLEWARE
app.use(bodyParser.json());
app.use(cors())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
  




const control = new Controller()

app.get('/',(req, res)=>{
	res.send({
		hai:'HAII'
	})
})

app.post('/infoMasuk',(req,res)=>{
	control.infoMasuk(req, res)
})

app.post('/clearSolusi', (req,res)=>{
	control.clearChoosenSolusi(req,res)
})

app.post('/setSolusi', (req,res)=>{
	control.setChoosenSolusi(req,res)
})

app.post('/validasi',(req,res)=>{
	control.validasi(req,res)
})

app.post('/cancel', (req,res)=>{
	control.cancel(req,res)
})

app.post('/dikerjakan', (req,res)=>{
	control.dikerjakan(req, res)
})
app.post('/selesai', (req,res)=>{
	control.selesai(req, res)
})
app.post('/login', (req,res)=>{
	control.login(req,res)
})
app.post('/komputer',(req, res)=>{
	control.komputer(req,res)
})
app.get('/semuaKomputer',(req,res)=>{
	control.semuaKomputer(req,res)
})
app.post('/komputerDetail',(req,res)=>{
	control.komputerDetail(req,res)
})
app.post('/ambilKomputer',(req,res)=>{
	control.ambilKomputer(req,res)
})

app.post('/loginAdmin',(req,res)=>{
	control.loginAdmin(req,res)
})
app.post('/admin',(req,res)=>{
	control.admin(req,res)
})
app.get('/randomId',(req,res)=>{
	control.randomId(req,res)
})
app.post('/addKeluhan',(req,res)=>{
	control.addKeluhan(req,res)
})
app.post('/addKelengkapan',(req,res)=>{
	control.addKelengkapan(req,res)
})
app.get('/allKeluhan',(req,res)=>{
	control.getAllKeluhan(req,res)
})
app.get('/allKelengkapan',(req,res)=>{
	control.getAllKelengkapan(req,res)
})
app.post('/addKomputer',(req,res)=>{
	control.addKomputer(req,res)
})
app.post('/setPassword',(req,res)=>{
	control.setPassword(req,res)
})
app.post('/loginTeknisi',(req,res)=>{
	control.loginTeknisi(req,res)
})
app.post('/kerjakan',(req,res)=>{
	control.kerjakan(req,res)
})
app.post('/issueSolusiKomputer',(req,res)=>{
	control.issueSolusiKomputer(req,res)
})
app.post('/addIssue',(req,res)=>{
	control.addIssue(req,res)
})
app.post('/addSolusi',(req,res)=>{
	control.addSolusi(req,res)
})
app.post('/addBiayaTambahan',(req,res)=>{
	control.addBiayaTambahan(req,res)
})
app.get('/allIssue',(req,res)=>{
	control.getAllIssue(req,res)
})
app.get('/allSolusi',(req,res)=>{
	control.getAllSolusi(req,res)
})
app.get('/allBiayaTambahan',(req,res)=>{
	control.getAllBiayaTambahan(req,res)
})
app.post('/addPermasalahanKomputer',(req,res)=>{
	control.addPermasalahanKomputer(req,res)
})
app.post('/setTanggalValidasi',(req,res)=>{
	control.setTanggalValidasi(req,res)
})
app.post('/setTanggalDikerjakan',(req,res)=>{
	control.setTanggalDikerjakan(req,res)
})
app.post('/setTanggalSelesai',(req,res)=>{
	control.setTanggalSelesai(req,res)
})
app.post('/solusiDikerjakan',(req,res)=>{
	control.addSolusiDikerjakan(req,res)
})
app.post('/biayaTambahanKomputer',(req,res)=>{
	control.setBiayaTambahanKomputer(req,res)
})
app.post('/setCatatanTeknisi',(req,res)=>{
	control.setCatatanTeknisi(req,res)
})





//PORT LISTENER
app.listen(port, () => console.log(`Example app listening on port ${port}!`))