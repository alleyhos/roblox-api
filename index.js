// ==============================
// 기본 모듈
// ==============================
console.log("DISCORD_TOKEN:", process.env.DISCORD_TOKEN ? "LOADED" : "MISSING");

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

// ==============================
// 환경변수
// ==============================
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

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
  } else if (cmd === "!ban") {
    payload = { type: "ban", username, reason };
  } else if (cmd === "!unban") {
    payload = { type: "unban", username };
  }

  if (!payload) return;

  commandQueue.push(payload);
  msg.reply(`✅ 명령 등록됨: ${cmd} ${username}`);
});

// ==============================
// Discord 로그인 완료
// ==============================
client.once("clientReady", () => {
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
// 서버 실행
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Roblox API running on port ${PORT}`);
});

// ==============================
// Discord 봇 로그인
// ==============================
if (!DISCORD_TOKEN) {
  console.warn("⚠️ DISCORD_TOKEN이 없어 Discord 봇은 실행되지 않습니다.");
} else {
  client.login(DISCORD_TOKEN);
}
