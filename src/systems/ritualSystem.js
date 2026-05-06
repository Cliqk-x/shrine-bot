const users = new Map(); // temporary (replace with DB later)

async function pray(userId) {
  if (!users.has(userId)) {
    users.set(userId, { faith: 0 });
  }

  const user = users.get(userId);

  const reward = Math.floor(Math.random() * 50) + 10;

  user.faith += reward;

  return { reward, total: user.faith };
}

module.exports = { pray };