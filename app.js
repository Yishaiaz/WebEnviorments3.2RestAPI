const express = require("express");
const azureControler = require("./dbControllers/azureDb");
const poiModule = require("./Modules/pointOfInterest");
const app = express();

// ENABLES US TO PARSE JSON'S DIRECTLY FROM REQ/RES
app.use(express.json() );

// REST API routes:

// 1: LOGIN todo: complete database check and token handling.
app.post("/users/login", (req, res)=>{
    var username = req.body["username"];
    var password = req.body["Password"];

    res.status(200).json({
        "username":username,
        "password": password
    });
});

// 2: GET RANDOM POI todo: connect to db
app.get("/poi/getrandomPOI", (req, res)=>{
    var minimalRank = req.body["minimalRank"];
    console.log(minimalRank);
    res.status(200).json({
        'poi1':{
            'poi_data': {
                'id':'123',
                'title': 'Haifa',
                'image_url': 'https://www.thenational.ae/image/policy:1.763876:1535285300/Haifa.jpg?f=16x9&w=1200&$p$f$w=83e38b4'
            }
        },
        'poi2':{
            'poi_data': {
                'id':'123',
                'title': 'Haifa',
                'image_url': 'https://www.thenational.ae/image/policy:1.763876:1535285300/Haifa.jpg?f=16x9&w=1200&$p$f$w=83e38b4'
            }
        },
        'poi3':{
            'poi_data': {
                'id':'123',
                'title': 'Haifa',
                'image_url': 'https://www.thenational.ae/image/policy:1.763876:1535285300/Haifa.jpg?f=16x9&w=1200&$p$f$w=83e38b4'
            }
        }
    });
});

// 3: RESTORE PASSWORD todo: validate with db and retrieve password.
app.post("/users/restorePassword", (req, res)=>{
    var data = {
        'username': req.body['username'],
        'question':req.body['question'],
        'answer': req.body['answer']
    };
    console.log(data);
    res.status(200).json({
        'password': '123'
    });
});

// 4: INSERT QUESTION todo:connect to db
app.post("/users/insertQuestionToUser", (req,res)=>{
    var data={
        'username': req.body['username'],
        'question':req.body['question'],
        'answer': req.body['answer']
    };
    console.log(data);
    res.status(200).json({
        'success':1
    });
});

// 5: ADD USER todo: connect to db
app.post("/users/addUser", (req, res)=>{
    var newUserData = {
        username: req.body['userName'],
        firstName: req.body['firstName'],
        lastName: req.body['lastName'],
        city: req.body['city'],
        country: req.body['country'],
        email: req.body['Email'],
        firstCategoryName : req.body['categoryName1'],
        secondCategoryName : req.body['categoryName2'],
        securityQuestion: req.body['Q'],
        securityAns: req.body['A']
    };
    console.log(newUserData);
    res.status(200).json({
        token: "token"
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

// 7: GET POI DETAILS todo: connect to the db
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

// 8: GET ALL POI todo: connect to db
app.get("/poi/getallpoi", (req, res)=>{
    var result = poiModule.getAll()
        .then((data)=>
        res.status(200).send(data))
        .catch((err)=>{
            console.log(err);
            res.status(400).send("Not Found");
        });
});

// 9: GET ALL POI BY CATEGORY todo: connect to db
app.get("/poi/getallpoibycategory", (req, res)=>{
    var categoryName = req.body['categoryName'];
    console.log(categoryName);
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

// 13: GET ALL POI REVIEWS todo: connect to db
app.get("/poi/getallpoireviews", (req, res)=>{
    var poiName = req.body['POIName'];
    console.log(poiName);
    var ansDict={};
    for(var i=0; i<=2; i++){
        ansDict[i] = {
            rating:4,
            content:"wonderfull great",
            date: "20/5/2030"
        };
    }
    res.status(200).json({
        poiReviews: ansDict
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

// 15: GET POSSIBLE COUNTRIES FOR REGISTRATION todo: connect ot db or global variable
app.get("/getpossiblecountriesforregistration", (req, res)=>{
    var ansDict={};
    for(var i=0; i<=2; i++){
        ansDict[i] = {
            countryId: 'IL',
            countryName:"Israel"
        };
    }
    res.status(200).json({
        countries: ansDict
    });
});

// 16: GET SEARCH RESULTS BY POI NAME
app.get("/poi/getsearchresultsbypoiname", (req, res)=>{
    var poiName = req.body["POIName"];
    console.log(poiName);
    var ansDict={};
    for(var i=0; i<=3; i++){
        ansDict[i] = {
            POIName:"Haifa"
        };
    }
    res.status(200).json({
        searchResults: ansDict
    });
});

// 17: SET USER FAVOURITE POI
app.put("/users/setuserfavouritepoi", (req, res)=>{
    var newFavouritePoi= req.body;
    console.log(newFavouritePoi);
    res.status(200).send("worked");
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

// 21: ADD POI REVIEW todo: connect to db
app.post("/poi/addpoireview", (req, res)=>{
    var poiName = req.body['POIName'];
    var rating = req.body['rating'];
    var content = req.body['content'];

    res.status(200).send(poiName+","+rating+","+content);
});




const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});