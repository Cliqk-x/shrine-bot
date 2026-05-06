const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'duel',
  description: 'Start a cursed duel',
  dm: true,

  options: [
    {
      name: 'target',
      description: 'Who to fight',
      type: 6,
      required: true
    }
  ],

  async execute(interaction) {
    // ❌ block in servers
    if (interaction.guild) {
      return interaction.reply({
        content: '⚠️ Duels can only occur in the spiritual realm (DMs).',
        ephemeral: true
      });
    }

    const opponent = interaction.options.getUser('target');

    if (opponent.bot) {
      return interaction.reply({
        content: 'You cannot fight a spiritless entity.',
        ephemeral: true
      });
    }

    if (opponent.id === interaction.user.id) {
      return interaction.reply({
        content: 'You cannot fight yourself.',
        ephemeral: true
      });
    }

    // 🧪 basic stats
    let playerHP = 100;
    let enemyHP = 100;

    const playerAttack = Math.floor(Math.random() * 30) + 10;
    const enemyAttack = Math.floor(Math.random() * 30) + 10;

    playerHP -= enemyAttack;
    enemyHP -= playerAttack;

    let result;
    if (playerHP > enemyHP) result = '🏆 You dominated the cursed battle.';
    else if (enemyHP > playerHP) result = '💀 You were overwhelmed by cursed energy.';
    else result = '⚖️ The battle ended in equilibrium.';

    const embed = new EmbedBuilder()
      .setColor('#7c3aed')
      .setTitle('⚔️ Curse Duel')
      .setDescription(
        `**${interaction.user.username} vs ${opponent.username}**\n\n` +
        `⚔️ You dealt **${playerAttack}** damage\n` +
        `💥 Opponent dealt **${enemyAttack}** damage\n\n` +
        `❤️ Your HP: ${playerHP}\n` +
        `🩸 Opponent HP: ${enemyHP}\n\n` +
        `${result}`
      )
      .setFooter({ text: 'Cursed energy clashes violently...' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};