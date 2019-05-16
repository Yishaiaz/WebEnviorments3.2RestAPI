const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.status(200).json({'test':true});
    console.log("Got GET Request");
});

const port = process.env.PORT || 3000; //environment variable
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});