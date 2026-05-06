const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const xpSystem = require('../../systems/xpSystem');
const { checkCooldown } = require('../../systems/cooldownSystem');

module.exports = {
  name: 'ritual',
  description: 'Awaken forbidden spirits',

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply("❌ Server only.");
    }

    await interaction.deferReply();

    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    // ⏱️ cooldown (5 min)
    const cd = await checkCooldown(userId, guildId, "ritual", 300000);

    if (cd.onCooldown) {
      return interaction.editReply({
        content: `⏳ Wait **${Math.ceil(cd.remaining / 1000)}s**`
      });
    }

    // 🎬 Phase 1 — silence
    const start = new EmbedBuilder()
      .setColor(0x1a1a2e)
      .setTitle("...")
      .setDescription("The air suddenly becomes still...")
      .setFooter({ text: "Something is watching you." });

    await interaction.editReply({ embeds: [start] });

    await new Promise(r => setTimeout(r, 2000));

    // 💥 Phase 2 — impact
    const impact = new EmbedBuilder()
      .setColor(0x8e44ad)
      .setTitle("🔮 Ritual Awakening")
      .setDescription("Do you dare awaken the lesser spirits?")
      .setFooter({ text: "Choose your ritual carefully..." });

    // 🔘 Buttons
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('lesser')
        .setLabel('🟢 Lesser Ritual')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId('greater')
        .setLabel('🟣 Greater Ritual')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('forbidden')
        .setLabel('🔴 Forbidden Ritual')
        .setStyle(ButtonStyle.Danger)
    );

    const msg = await interaction.editReply({
      embeds: [impact],
      components: [row]
    });

    // 🎯 Collector (wait for user choice)
    const collector = msg.createMessageComponentCollector({
      filter: i => i.user.id === userId,
      time: 15000
    });

    collector.on('collect', async i => {
      await i.deferUpdate();

      let xpGain = 0;
      let text = "";
      let color = 0xffffff;

      if (i.customId === 'lesser') {
        xpGain = Math.floor(Math.random() * 100) + 80;
        text = "✨ A gentle spirit answers your call.";
        color = 0x2ecc71;
      }

      if (i.customId === 'greater') {
        const roll = Math.random();
        if (roll < 0.7) {
          xpGain = Math.floor(Math.random() * 200) + 150;
          text = "⚡ Power surges through you!";
          color = 0x9b59b6;
        } else {
          xpGain = -50;
          text = "💀 The ritual destabilizes...";
          color = 0xe74c3c;
        }
      }

      if (i.customId === 'forbidden') {
        const roll = Math.random();
        if (roll < 0.5) {
          xpGain = Math.floor(Math.random() * 400) + 300;
          text = "🔥 A forbidden entity grants immense power!";
          color = 0xf1c40f;
        } else {
          xpGain = -150;
          text = "💀 You are consumed by the ritual...";
          color = 0xc0392b;
        }
      }

      let result;

      if (xpGain > 0) {
        result = await xpSystem.addXP(userId, guildId, xpGain);
      } else {
        const user = await xpSystem.getUser(userId, guildId);
        user.xp = Math.max(0, user.xp + xpGain);
        await require("quick.db").QuickDB().set(`xp_${guildId}_${userId}`, user);
        result = user;
      }

      const final = new EmbedBuilder()
        .setColor(color)
        .setTitle("🌌 Ritual Result")
        .setDescription(text)
        .addFields(
          {
            name: "XP Change",
            value: `**${xpGain > 0 ? "+" : ""}${xpGain} XP**`,
            inline: true
          },
          {
            name: "Level",
            value: `${result.level}`,
            inline: true
          }
        )
        .setFooter({ text: "Power always comes at a cost..." });

      await interaction.editReply({
        embeds: [final],
        components: []
      });

      collector.stop();
    });

    // ⌛ timeout
    collector.on('end', async collected => {
      if (collected.size === 0) {
        await interaction.editReply({
          content: "⏳ The ritual fades... you hesitated.",
          embeds: [],
          components: []
        });
      }
    });
  }
};