const userService = require('./src/services/userService');

const userId = "test123";

let user = userService.getUser(userId);
console.log("Initial:", user);

userService.addCoins(userId, 100);
userService.addExp(userId, 50);

user = userService.getUser(userId);
console.log("After update:", user);