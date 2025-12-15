const express = require("express");
const app = express();

app.get("/roblox", (req, res) => {
  res.json({ type: "none" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Roblox API running on", PORT);
});
