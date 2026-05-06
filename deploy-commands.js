require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

// 📦 Recursive command loader
const load = (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      load(fullPath);
    } else if (file.endsWith('.js')) {
      try {
        const cmd = require(fullPath);

        if (!cmd.name || !cmd.description) {
          console.warn(`⚠️ Skipping ${file} (missing name/description)`);
          continue;
        }

        const commandData = {
          name: cmd.name,
          description: cmd.description,
          options: cmd.options || [],
          dm_permission: cmd.dm ?? false
        };

        commands.push(commandData);

        console.log(`✅ Loaded command: ${cmd.name}`);
      } catch (err) {
        console.error(`❌ Error loading ${fullPath}`);
        console.error(err);
      }
    }
  }
};

// 📂 Load commands
const commandsPath = path.join(__dirname, 'src', 'commands');
load(commandsPath);

// 🔐 Validate env
if (!process.env.TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
  console.error('❌ Missing .env values!');
  process.exit(1);
}

// 🌐 Setup REST
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// 🚀 Deploy commands
(async () => {
  try {
    console.log('\n⏳ Registering commands...');
    console.log(`📦 Total commands: ${commands.length}`);

    if (commands.length === 0) {
      console.warn('⚠️ No commands found. Check your folders.');
      return;
    }

    await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: commands }
);
    console.log('✅ Commands registered successfully!\n');
  } catch (error) {
    console.error('❌ Failed to register commands:');
    console.error(error);
  }
})();