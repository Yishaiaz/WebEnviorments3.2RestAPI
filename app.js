const express = require("express");
const azureControler = require("./dbControllers/azureDb");
const poiModule = require("./Modules/pointOfInterest");
const questionModule = require("./Modules/Question");
const countriesModule = require("./Modules/Countries");
const userModule = require("./Modules/user");
const jwt= require('jsonwebtoken');
const app = express();
const secret="myPrivateKey";

// ENABLES US TO PARSE JSON'S DIRECTLY FROM REQ/RES
app.use(express.json() );

// REST API routes:
// app.use('/private', userModule(req, res, next));

//middleware
app.use('/private', function (req, res, next) {
    const token = req.header("x-auth-token");
    // no token
    if (!token){
        res.status(401).send("Access denied.");
    }
    else{
        // verify token
        try {
            const decoded = jwt.verify(token, secret);
            req.decoded = decoded;
            next();
        } catch (exception) {
            res.status(400).send("Invalid token.");
        }
    }
});


// 1: LOGIN
app.post("/users/login", (req, res)=>{
    var username = req.body["username"];
    var password = req.body["password"];

    var result = userModule.userLogin(username,password)
        .then((username)=>{
            let payload = { username: username };
            let options = { expiresIn: "1d" };
            const token = jwt.sign(payload, secret, options);
            res.status(200).send(token)
        })
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 2: GET RANDOM POI
app.get('/poi/getrandomPOI/:minimalRank', (req, res)=>{
    var minimalRank = req.params.minimalRank;
    //var minimalRank = req.params.minimalRank;
    var result = poiModule.getRandomPOI(minimalRank)
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 3: RESTORE PASSWORD
app.post("/users/restorePassword", (req, res)=>{
    var data = {
        'username': req.body['username'],
        'question':req.body['question'],
        'answer': req.body['answer']
    };
    console.log(data);
    userModule.restorePassword(req.body['username'],req.body['question'],req.body['answer'])
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});


// 5: ADD USER
app.post("/users/addUser", (req, res)=>{
    var username= req.body['userName'];
    var password=req.body['password'];
    var firstName= req.body['firstName'];
    var lastName= req.body['lastName'];
    var city= req.body['city'];
    var country= req.body['country'];
    var email= req.body['Email'];
    var securityQuestion1= req.body['Q1'];
    var securityAns1= req.body['A1'];
    var securityQuestion2= req.body['Q2'];
    var securityAns2= req.body['A2'];
    var categories=req.body['categories'];

    if(categories.length<2)
        res.status(400).send("register failed. you need at least 2 categories");
    else{
        userModule.addUser(username,password,firstName,lastName,city,country,email,securityQuestion1,securityAns1, securityQuestion2,securityAns2)
            .then((data)=>userModule.addUserCategories(username,categories))
            .then((username)=>{
                let payload = { username: username };
                let options = { expiresIn: "1d" };
                const token = jwt.sign(payload, secret, options);
                res.status(200).send(token)
            })
            .catch((err)=>{
                console.log(err);
                res.status(400).send("Not Found");
            });
    }
});

// 6: GET 2 POPULAR POI BY USER ID ((ID)=>INTERESTS) todo: connect to db
app.get("/private/users/get2popularpoi", (req, res)=>{
    var username= req.decoded['username'];
    userModule.get2popularpoi(username)
        .then((token)=>
            res.status(200).send(token))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 7: GET POI DETAILS
app.get("/poi/getpoidetails/:POIName", (req, res)=>{
    var poiName = req.params.POIName;
    poiName = "'"+poiName+"'";
    var result = poiModule.getPOIDetails(poiName)
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 8: GET ALL POI
app.get("/poi/getallpoi", (req, res)=>{
    var result = poiModule.getAll()
        .then((data)=>
        res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 9: GET ALL POI BY CATEGORY
app.get("/poi/getallpoibycategory/:categoryName", (req, res)=>{
    var categoryName = req.params.categoryName;
    console.log(categoryName);
    var results = poiModule.getPOIByCategory(categoryName)
        .then((data)=>{
            console.log(data);
            res.status(200).send(data);

        })
        .catch((err)=>{
            console.log(err);
            res.status(404).send("Not Found");
        });
});

// 10: GET USER LAST 2 SAVED POI todo: connect to db
app.get("/private/users/getuserlast2savedpoi", (req, res)=>{
    var username= req.decoded['username'];
    console.log(username);
    res.status(200).json({
        'poi1':{
            'poi_data': {
                'id':'123',
                'title': 'Haifa',
                'image_url': 'https://www.thenational.ae/image/policy:1.763876:1535285300/Haifa.jpg?f=16x9&w=1200&$p$f$w=83e38b4',
                'description': 'night shot of Haifa bay.<br>great'
            }
        }
    });
});

// 11: GET N [NUMBER] RANDOM IMAGES
app.get("/poi/getnrandomimages/:numOfImages", (req, res)=>{
    var numberOfRandomImagesRequested = parseInt(req.params.numOfImages);
    console.log(numberOfRandomImagesRequested);
    var results = poiModule.getRandomImgUrls(numberOfRandomImagesRequested)
        .then((data)=>{
            console.log(data);
            res.status(200).send(data);

        })
        .catch((err)=>{
            console.log(err);
            res.status(404).send("Not Found");
        });
});

// 12: UPDATE USER CATEGORIES todo: connect to db
app.put("/private/users/updateusercategories", (req, res)=>{
    var username= req.decoded['username'];
    var newCategories = req.body;
    console.log(newCategories);
    res.status(200).send('worked');
});

// 13: GET ALL POI REVIEWS
app.get("/poi/getallpoireviews/:poiName", (req, res)=>{
    var poiName = req.params.poiName;
    poiModule.getAllPOIReviews(poiName)
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });

});

// 14: GET USER AUTH QUESTION (SECURITY Q) todo: connect to db
app.get("/private/users/getuserauthquestion", (req, res)=>{
    var username= req.decoded['username'];
    console.log(username);

    res.status(200).json({
        question:"why?"
    });
});

// 15: GET POSSIBLE COUNTRIES FOR REGISTRATION
app.get("/getpossiblecountriesforregistration", (req, res)=>{
    var result = countriesModule.getAll()
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 16: GET SEARCH RESULTS BY POI NAME
app.get("/poi/getsearchresultsbypoiname/:name", (req, res)=>{
    // var poiName = "'"+req.params.name+"'";
    var poiName =req.params.name;
    console.log(poiName);
    poiModule.searchPOI(poiName)
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 17: SET USER FAVOURITE POI
// todo: change documentation for
app.put("/users/setuserfavouritepoi", (req, res)=>{
    var newFavouritePoi= req.body['poi'];
    var username = req.body['username'];
    console.log(newFavouritePoi);
    userModule.addFavouritePOIToUser(username, newFavouritePoi)
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});



// 18: GET USER FAVOURITE POI todo: connect to db
app.get("/private/users/getuserfavouritepoi", (req, res)=>{
    var username= req.decoded['username'];
    var poiName = req.body["username"];
    console.log(poiName);
    var ansDict={};
    for(var i=0; i<=3; i++){
        ansDict[i] = {
            POIName:"Haifa",
            imgUrl: "https://www.templers-haifa.co.il/wp-content/uploads/2014/12/templers-haifa-25-12-2014-ben-gurion.jpg"
        };
    }
    res.status(200).send(ansDict);
});

// 19: ADD USER FAVOURITE POI
app.put("/users/adduserfavouritepoi", (req, res)=>{
    var newFavouritePoi= req.body['newfavouritepoiname'];
    var username = req.body['username'];
    console.log(newFavouritePoi);
    userModule.addFavouritePOIToUser(username, newFavouritePoi)
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 20: REMOVE USER FAVOURITE POI todo: connect to db
app.delete("/private/users/removeuserfavouritepoi", (req, res)=>{
    var username= req.decoded['username'];
    var poiName= req.body["POIName"];
    console.log(username+","+poiName);
    res.status(200).send("deleted: "+poiName);
});

// 21: ADD POI REVIEW
app.post("/poi/addpoireview", (req, res)=>{
    var poiName = req.body['POIName'];
    var rating = req.body['rating'];
    var content = req.body['content'];
    var username = req.body['username'];

    poiModule.addReview(poiName,content,rating,username)
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

//***********************    added functions   *****************************************************************

// 22: GET ALL Questions
app.get("/getallquestions", (req, res)=>{
    var result = questionModule.getAll()
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 22: GET ALL Countries
app.get("/getallcountries", (req, res)=>{
    var result = countriesModule.getAll()
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});