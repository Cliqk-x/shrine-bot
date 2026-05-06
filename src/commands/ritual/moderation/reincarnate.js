module.exports = {
  name: 'reincarnate',
  description: 'Bring a user back (unban)',

  options: [
    {
      name: 'userid',
      description: 'User ID to unban',
      type: 3, // STRING
      required: true
    }
  ],

  async execute(interaction) {
    const userId = interaction.options.getString('userid');

    await interaction.guild.members.unban(userId);

    await interaction.reply(`♻️ <@${userId}> has been reincarnated.`);
  }
};