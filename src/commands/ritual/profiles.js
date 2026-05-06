const { EmbedBuilder } = require('discord.js');
const xpSystem = require('../../systems/xpSystem');

module.exports = {
  name: 'profile',
  description: 'View your profile',

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply("❌ Server only.");
    }

    const user = await xpSystem.getUser(
      interaction.user.id,
      interaction.guild.id
    );

    const needed = xpSystem.xpNeeded(user.level);

    const embed = new EmbedBuilder()
      .setTitle(`📜 ${interaction.user.username}'s Profile`)
      .addFields(
        { name: "Level", value: `${user.level}`, inline: true },
        { name: "XP", value: `${user.xp}/${needed}`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  }
};