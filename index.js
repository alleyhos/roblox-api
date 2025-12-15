// ==============================
// 기본 모듈
// ==============================
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

// ==============================
// 명령 큐 (Roblox로 전달)
// ==============================
let commandQueue = [];

// ==============================
// Discord 봇 설정
// ==============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ==============================
// Discord 메시지 명령 처리
// ==============================
client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith("!")) return;

  const [cmd, username, ...reasonArr] = msg.content.split(" ");
  const reason = reasonArr.join(" ") || "사유 없음";

  if (!username) {
    msg.reply("❌ Roblox 사용자 이름을 입력하세요.");
    return;
  }

  let payload = null;

  if (cmd === "!kick") {
    payload = { type: "kick", username, reason };
  } 
  else if (cmd === "!ban") {
    payload = { type: "ban", username, reason };
  } 
  else if (cmd === "!unban") {
    payload = { type: "unban", username };
  }

  if (!payload) return;

  commandQueue.push(payload);
  msg.reply(`✅ 명령 등록됨: ${cmd} ${username}`);
});

// ==============================
// Discord 로그인 완료 로그
// ==============================
client.once("ready", () => {
  console.log(`🤖 Discord bot logged in as ${client.user.tag}`);
});

// ==============================
// Roblox → 명령 요청 API
// ==============================
app.get("/roblox", (req, res) => {
  if (commandQueue.length === 0) {
    return res.json({ type: "none" });
  }
  const cmd = commandQueue.shift();
  res.json(cmd);
});

// ==============================
// 서버 실행 (Railway)
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Roblox API running on ${PORT}`);
});

// ==============================
// Discord 봇 로그인 (⚠️ 맨 마지막)
// ==============================
if (!process.env.TOKEN) {
  console.error("❌ TOKEN 환경변수가 설정되지 않았습니다.");
} else {
  client.login(process.env.TOKEN);
}
