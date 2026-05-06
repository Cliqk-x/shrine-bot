const { QuickDB } = require("quick.db");
const db = new QuickDB();

async function checkSpam(userId, guildId) {
  const key = `spam_${guildId}_${userId}`;
  const now = Date.now();

  let data = await db.get(key) || {
    count: 0,
    last: 0
  };

  if (now - data.last < 3000) {
    data.count++;
  } else {
    data.count = 0;
  }

  data.last = now;

  await db.set(key, data);

  if (data.count >= 3) {
    return { penalty: true };
  }

  return { penalty: false };
}

module.exports = { checkSpam };