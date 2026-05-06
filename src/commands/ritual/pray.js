const { EmbedBuilder } = require('discord.js');
const xpSystem = require('../../systems/xpSystem');
const { checkCooldown } = require('../../systems/cooldownSystem');
const { checkSpam } = require('../../systems/antiSpamSystem');

// 📊 Progress bar
function createBar(current, max, size = 10) {
  const progress = Math.floor((current / max) * size);
  const empty = size - progress;
  return "🟪".repeat(progress) + "⬛".repeat(empty);
}

// 🌌 Flavor text
const messages = [
  "A quiet blessing flows through you...",
  "The shrine acknowledges your devotion...",
  "A distant spirit whispers your name...",
  "Energy gathers around your soul...",
  "The divine gaze rests upon you..."
];

module.exports = {
  name: 'pray',
  description: 'Offer your prayers',

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply("❌ This command is server-only.");
    }

    // 🔥 prevent interaction timeout
    await interaction.deferReply();

    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    // ⏱️ Cooldown (30s)
    const cd = await checkCooldown(userId, guildId, "pray", 30000);

    if (cd.onCooldown) {
      return interaction.editReply({
        content: `⏳ You must wait **${Math.ceil(cd.remaining / 1000)}s** before praying again.`
      });
    }

    // 🧠 Anti-spam
    const spam = await checkSpam(userId, guildId);

    // 🎲 XP gain
    let xpGain = xpSystem.getXpGain();

    if (spam.penalty) {
      xpGain = Math.floor(xpGain / 2);
    }

    const result = await xpSystem.addXP(userId, guildId, xpGain);

    const needed = xpSystem.xpNeeded(result.level);
    const bar = createBar(result.xp, needed);

    // 🎁 Rarity system
    let rarity = "Common";
    if (xpGain > 22) rarity = "Rare ✨";
    if (xpGain > 25) rarity = "Divine 🔥";

    // 🌌 Random message
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    // 🎨 Embed
    const embed = new EmbedBuilder()
      .setColor(result.leveledUp ? 0xf1c40f : 0x8e44ad)
      .setAuthor({
        name: `${interaction.user.username} offered a prayer`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTitle(result.leveledUp ? "🌟 LEVEL UP!" : "⛩️ SHRINE 神社")
      .setDescription(`✨ You gained **${xpGain} XP**`)

      .addFields(
        {
          name: "📊 Progress",
          value: `Level **${result.level}**\n${bar}\n**${result.xp}/${needed} XP**`,
          inline: true
        },
        {
          name: "🎁 Blessing",
          value: rarity,
          inline: true
        },
        {
          name: "🌌 Status",
          value: result.leveledUp ? "Ascended ⬆️" : "Stable",
          inline: true
        }
      )

      .setFooter({ text: randomMsg })
      .setTimestamp();

    // ⚠️ Spam warning
    if (spam.penalty) {
      embed.addFields({
        name: "⚠️ Calm down",
        value: "You're praying too fast. XP reduced."
      });
    }

    // 🎉 Level up message
    if (result.leveledUp) {
      embed.addFields({
        name: "Ascension",
        value: `You reached **Level ${result.level}**`
      });
    }

    await interaction.editReply({ embeds: [embed] });
  }
};