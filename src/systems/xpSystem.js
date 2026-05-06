const { QuickDB } = require("quick.db");
const db = new QuickDB();

// 🧠 XP formula
function xpNeeded(level) {
  return Math.floor(50 * Math.pow(level, 1.5));
}

// 🎲 Random XP gain
function getXpGain(min = 15, max = 25) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 📊 Get user data
async function getUser(userId, guildId) {
  const key = `xp_${guildId}_${userId}`;

  let data = await db.get(key);

  if (!data) {
    data = {
      xp: 0,
      level: 1
    };
    await db.set(key, data);
  }

  return data;
}

// ⚡ Add XP
async function addXP(userId, guildId, amount) {
  const key = `xp_${guildId}_${userId}`;
  let user = await getUser(userId, guildId);

  user.xp += amount;

  let leveledUp = false;

  while (user.xp >= xpNeeded(user.level)) {
    user.xp -= xpNeeded(user.level);
    user.level++;
    leveledUp = true;
  }

  await db.set(key, user);

  return {
    ...user,
    leveledUp
  };
}

module.exports = {
  getUser,
  addXP,
  getXpGain,
  xpNeeded
};