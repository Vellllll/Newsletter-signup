const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(request, response){
    response.sendFile(__dirname + "/signup.html");
});

app.post("/signin", function(request, response){
    const first_name = request.body.inputFirstName;
    const last_name = request.body.inputLastName;
    const email = request.body.inputEmail;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first_name,
                    LNAME: last_name
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/8d34cefa65";

    const options = {
        method: "POST",
        auth: "arvel:18a1b48a488c1def7599bfdea9cf6169a-us21"
    }

    const req = https.request(url, options, function(res){
        if(res.statusCode === 200){
            response.sendFile(__dirname + "/success.html");
        } else {
            response.sendFile(__dirname + "/failure.html");
        }

        res.on("data", function(data){
            console.log(JSON.parse(data));
        });
        
    });

    req.write(jsonData);
    req.end();
});

app.post("/failure", function(request, response){
    response.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("The server is running....");
});

// API Key
// 8a1b48a488c1def7599bfdea9cf6169a-us21

// List Key 
// 8d34cefa65