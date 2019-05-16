const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.status(200).json({
        'test':true,
    });
});


app.get("/user/:id", (req, res)=>{
    res.status(200).json({
        'id': req.params.id
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});