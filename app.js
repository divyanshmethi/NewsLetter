const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
//Using this we can specify static folder which contains all the static files
app.use(express.static('public'));
//We can access these static files by using relative URL's relative to the public folder

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
  const firstName = req.body.firstName;
  const lastName = req.body.secondName;
  const email = req.body.email;
  //This structure is taken from Mailchimp API
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);
  const options =
  {
    method: "POST",
    auth: "divyansh:process.env.KEY"
  }
  const request = https.request(process.env.URL,options,function(response){ //Callback giving response from Mailchimp server
      if(response.statusCode === 200)
      {
        res.sendFile(__dirname + "/success.html");
      }
      else {
        res.sendFile(__dirname + "/failure.html");
      }
      response.on('data',function(data){
        console.log(JSON.parse(data));
      })
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");  //Redirects the used to home route
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is started at port 3000");
})
