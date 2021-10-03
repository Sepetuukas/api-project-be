const express = require("express");
const app = express();
const port = 3000;
const vision = require("@google-cloud/vision");
const fs = require("fs");

var cors = require("cors");
app.use(cors());
app.use(express.json());

const client = new vision.ImageAnnotatorClient({
  keyFilename: "API_KEY.json",
});

app.get("/", (req, res) => {
  let rawdata = fs.readFileSync("data.json");
  let jsonData = JSON.parse(rawdata);
  res.send(jsonData);
});

app.post("/images", (req, res) => {
  let rawdata = fs.readFileSync("data.json");
  let jsonData = JSON.parse(rawdata);

  client
    .labelDetection(req.body.imageUrl)
    .then((results) => {
      const labels = results[0].labelAnnotations.map(
        (result) => result.description
      );
      // Write to DB
      fs.writeFileSync("data.json", JSON.stringify([...jsonData, labels]));
      res.send(labels);
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Images app listening at http://localhost:${port}`);
});
