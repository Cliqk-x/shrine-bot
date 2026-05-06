// src/systems/cooldownSystem.js

const cooldowns = new Map();

function checkCooldown(userId, action, duration) {
  const key = `${userId}:${action}`;
  const now = Date.now();

  if (cooldowns.has(key)) {
    const expireTime = cooldowns.get(key);

    if (now < expireTime) {
      const timeLeft = Math.ceil((expireTime - now) / 1000);
      return timeLeft;
    }
  }

  cooldowns.set(key, now + duration);
  return 0;
}

module.exports = { checkCooldown };