const express = require("express");
const azureControler = require("./dbControllers/azureDb");
const poiModule = require("./Modules/pointOfInterest");
const questionModule = require("./Modules/Question");
const countriesModule = require("./Modules/Countries");
const userModule = require("./Modules/user");
const app = express();

// ENABLES US TO PARSE JSON'S DIRECTLY FROM REQ/RES
app.use(express.json() );

// REST API routes:

// 1: LOGIN
app.post("/users/login", (req, res)=>{
    var username = "'"+req.body["username"]+"'";
    var password = "'"+req.body["password"]+"'";

    var result = userModule.userLogin(username,password)
        .then((data)=>
            res.status(200).send(data))
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

// // 4: INSERT QUESTION todo:connect to db
// app.post("/users/insertQuestionToUser", (req,res)=>{
//     var data={
//         'username': req.body['username'],
//         'question':req.body['question'],
//         'answer': req.body['answer']
//     };
//     console.log(data);
//     res.status(200).json({
//         'success':1
//     });
// });

// 5: ADD USER todo: handle the categories and todo: return token .
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

    var result = userModule.addUser(username,password,firstName,lastName,city,country,email,securityQuestion1,securityAns1, securityQuestion2,securityAns2)
        .then((user)=>userModule.addUserCategories(username,categories))
        .then((data)=>
            res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 6: GET 2 POPULAR POI BY USER ID ((ID)=>INTERESTS) todo: connect to db
app.get("/poi/get2popularpoi", (req, res)=>{
    var username = req.body['username'];
    console.log(username);
    res.status(200).json({
        'poi1':{
            'poi_data': {
                'id':'123',
                'title': 'Haifa',
                'image_url': 'https://www.thenational.ae/image/policy:1.763876:1535285300/Haifa.jpg?f=16x9&w=1200&$p$f$w=83e38b4',
                'description': 'night shot of Haifa bay.<br>wonderful'
            }
        },
        'poi2':{
            'poi_data': {
                'id':'123',
                'title': 'Haifa',
                'image_url': 'https://www.thenational.ae/image/policy:1.763876:1535285300/Haifa.jpg?f=16x9&w=1200&$p$f$w=83e38b4',
                'description': 'night shot of Haifa bay.<br>great'
            }
        }
    });
});

// 7: GET POI DETAILS
app.get("/poi/getpoidetails", (req, res)=>{
    var poiName = req.body['POIName'];
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
app.get("/poi/getuserlast2savedpoi", (req, res)=>{
    var username = req.body['username'];
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

// 11: GET N [NUMBER] RANDOM IMAGES todo: connect to db
app.get("/poi/getnrandomimages", (req, res)=>{
    var numberOfRandomImagesRequested = req.body['numOfImages'];
    console.log(numberOfRandomImagesRequested);
    var ansDict={};
    for(var i=0; i<=parseInt(numberOfRandomImagesRequested); i++){
        ansDict[i] = {
            img_url:"https://www.templers-haifa.co.il/wp-content/uploads/2014/12/templers-haifa-25-12-2014-ben-gurion.jpg"
        };
    }
    res.status(200).json({
        imagesJson: ansDict
    });
});

// 12: UPDATE USER CATEGORIES todo: connect to db
app.put("/users/updateusercategories", (req, res)=>{
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
app.get("/users/getuserauthquestion", (req, res)=>{
    var username = req.body['username'];
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

// 17: SET USER FAVOURITE POI todo: connect to db
// todo: change the documentation to receive {username, newfavouritepoiname}
app.put("/users/setuserfavouritepoi", (req, res)=>{
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



// 18: GET USER FAVOURITE POI todo: connect to db
app.get("/users/getuserfavouritepoi", (req, res)=>{
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

// 19: ADD USER FAVOURITE POI todo: connect to db
app.put("/users/adduserfavouritepoi", (req, res)=>{
    var poiName = req.body;
    console.log(poiName);
    res.status(200).send('worked');
});

// 20: REMOVE USER FAVOURITE POI todo: connect to db
app.delete("/users/removeuserfavouritepoi", (req, res)=>{
    var username = req.body["username"];
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