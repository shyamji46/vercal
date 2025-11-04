import express from "express";
import fetch from "node-fetch";

const app = express();
app.get("/proxy", async (req, res) => {
  const r = await fetch("https://www.battlegroundsmobileindia.com");
  const text = await r.text();
  res.send(text);
});
app.listen(3000);
