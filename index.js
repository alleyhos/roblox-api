const express = require("express");
const app = express();

app.use(express.json());

// ===== 명령 큐 =====
let queue = [];

// Discord → 명령 등록
app.post("/command", (req, res) => {
  queue.push(req.body);
  res.sendStatus(200);
});

// Roblox → 명령 요청
app.get("/roblox", (req, res) => {
  if (queue.length === 0) {
    return res.json({ type: "none" });
  }
  res.json(queue.shift());
});

// Railway 필수 포트
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Roblox API running on", PORT);
});
