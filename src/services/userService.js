const users = new Map();

function createBaseUser(userId) {
  return {
    userId,
    shrine: { level: 1, exp: 0 },
    currency: { coins: 0, gems: 0 },
    inventory: [],
    pity: { count: 0 }
  };
}

function getUser(userId) {
  if (!users.has(userId)) {
    users.set(userId, createBaseUser(userId));
  }
  return users.get(userId);
}

function saveUser(user) {
  users.set(user.userId, user);
  return user;
}

function addCoins(userId, amount) {
  const user = getUser(userId);
  user.currency.coins += amount;
  return saveUser(user);
}

function addExp(userId, amount) {
  const user = getUser(userId);
  user.shrine.exp += amount;
  return saveUser(user);
}

module.exports = {
  getUser,
  saveUser,
  addCoins,
  addExp
};