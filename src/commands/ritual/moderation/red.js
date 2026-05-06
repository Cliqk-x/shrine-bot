const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'red',
  description: 'Issue a warning',

  options: [
    {
      name: 'target',
      description: 'User to warn',
      type: 6, // USER
      required: true
    }
  ],

  async execute(interaction) {
    const user = interaction.options.getUser('target');

    const embed = new EmbedBuilder()
      .setColor('#ef4444')
      .setTitle('🔴 Cursed Technique: Red')
      .setDescription(`${user.tag} has been struck with a warning.`)
      .addFields({
        name: '⚠️ Message',
        value: 'Do not test the shrine again...'
      })
      .setFooter({ text: 'Destruction is controlled...' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};