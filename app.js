const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(process.env.PORT || 3000, () => console.log('server is running'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html')
})

app.post('/', function (req, res) {
  const firstName = req.body.fName
  const lastName = req.body.lName
  const email = req.body.email

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  }
  const jsonData = JSON.stringify(data)
  const url = 'https://us5.api.mailchimp.com/3.0/lists/6167c0a26b'
  const options = {
    method: 'POST',
    auth: 'key:985043ef48fb112245e68c09241cc001-us5',
  }
  const request = https.request(url, options, function (response) {

    if (response.statusCode===200){
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on('data', function (data) {
      console.log(JSON.parse(data))
    })
  })
  request.write(jsonData)
  request.end();
})

app.post("/failure", (req,res)=>
  res.redirect("/")
)

app.post("/success", (req,res)=>
res.redirect("/"))


