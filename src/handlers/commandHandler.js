const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const commandPath = path.join(__dirname, '../commands');

  const load = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        load(fullPath);
      } else if (file.endsWith('.js')) {
        const command = require(fullPath);
        client.commands.set(command.name, command);
      }
    }
  };

  load(commandPath);
};