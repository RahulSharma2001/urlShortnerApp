import express from "express";
import { nanoid } from "nanoid";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("short", { shortUrl: "", isActive: false });
});

app.post("/api/v1/shortUrl", (req, res) => {
  const id = nanoid(8);
  const longUrl = req.body.longUrl;
  const currentUrl = req.protocol + "://" + req.get("host");

  let data = {};
  try {
    if (fs.existsSync("urlData.json"))
      data = JSON.parse(fs.readFileSync("urlData.json", "utf8"));

    data[id] = longUrl;

    fs.writeFileSync("urlData.json", JSON.stringify(data));

    res.render("short", {
      shortUrl: `${currentUrl}/${id}`,
      isActive: true,
    });
  } catch (e) {
    res.render("short", { shortUrl: e, isActive: true });
  }
});

app.get("/:shortUrl", (req, res) => {
  const data = JSON.parse(fs.readFileSync("urlData.json", "utf-8"));
  const longUrl = data[req.params.shortUrl];
  res.redirect(longUrl);
});

app.listen(PORT, () => console.log(`Server up and running ${PORT}`));
