const express  = require("express");
const fs = require('fs');
const cors = require("cors");
const app = express();
app.use(cors());

app.use(express.json());

app.get('', (req,res)=>{
    res.send('runngin')
});

app.post("/save-answers", (req, res) => {
  const answers = req.body;

  fs.writeFile("public/assets/answers.json", JSON.stringify(answers, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Error saving answers");
    }
    res.status(200).send("Answers saved successfully");
  });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
