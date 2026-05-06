const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'hollowpurple',
  description: 'Erase a user from existence (ban)',

  // 👇 PUT OPTIONS HERE
  options: [
    {
      name: 'target',
      description: 'User to ban',
      type: 6, // USER type
      required: true
    }
  ],

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: 'You lack cursed energy.', ephemeral: true });
    }

    const user = interaction.options.getUser('target');

    await interaction.guild.members.ban(user.id);

    const embed = new EmbedBuilder()
      .setColor('#ef4444')
      .setTitle('💀 Hollow Purple')
      .setDescription(`${user.tag} has been erased from existence.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};