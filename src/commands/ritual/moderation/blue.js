const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'blue',
  description: 'Repel a user (kick)',

  options: [
    {
      name: 'target',
      description: 'User to repel',
      type: 6, // USER
      required: true
    }
  ],

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: 'You lack cursed energy.',
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({
        content: 'Target not found in this realm.',
        ephemeral: true
      });
    }

    await member.kick();

    const embed = new EmbedBuilder()
      .setColor('#3b82f6')
      .setTitle('🔵 Cursed Technique: Blue')
      .setDescription(`${user.tag} has been forcefully repelled.`)
      .setFooter({ text: 'Space itself bends...' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};