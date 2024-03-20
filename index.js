import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createShortUrlAndSave, getOriginalUrl } from "./app.js";

dotenv.config();

const app = express();

// Basic Configuration
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res, next) => {
  createShortUrlAndSave(req.body.url, (err, data) => {
    if (err) next(err);
    res.json(data);
  });
});

app.get("/api/shorturl/:short_url", (req, res, next) => {
  const { short_url } = req.params;
  getOriginalUrl(short_url, (err, data) => {
    if (err) next(err);
    if (data) {
      res.redirect(data);
    } else {
      res.json({ error: "No short url found" });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
