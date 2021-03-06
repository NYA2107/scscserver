const puretext = require('puretext')
class Sms{
	sendSms(req, res){
		let text = {
	      // To Number is the number you will be sending the text to.
	      toNumber: req.body.number,
	      // From number is the number you will buy from your admin dashboard
	      fromNumber: '+15594724536',
	      // Text Content
	      smsBody: req.body.msg,
	      //Sign up for an account to get an API Token
	      apiToken: '3xbj7v'
	  	}

		puretext.send(text, function (err, response) {
			if(err){
				console.log(err)
				res.send(err)
			}else{
				res.send(response)
				console.log(response)
			}
		})
	}
}

module.exports = Sms;