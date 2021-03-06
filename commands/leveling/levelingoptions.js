const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

module.exports = {
  name: "levelingoptions",
  category: "Leveling",
  description: "Edit or view the leveling options",
  aliases: ["lvloptions","lvlop"],
  usage: "<max - min - maxlength - minlength - delay> <amount>",
  cooldown: 5,
  reqPermissions: ['MANAGE_GUILD'],
  execute(bot, message, args) {
    Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.error(`An error occured: ${err}`);
      if (!guild) return message.error("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        if (!args[0]) {
          let optionsEmbed = new Discord.MessageEmbed()
          .setTitle(`${message.guild.name}'s Leveling Options`)
          .setDescription("You can edit any setting with the phrase next to it in parentheses. Example: `g!levelingoptions max 200`")
          .setColor("PURPLE")
          .setTimestamp()
          .addField("Xp Gaining Options", `Max Xp Per Message(max) -> \`${guild.settings.leveling.options.xp.max} xp\`
Min Xp Per Message(min) -> \`${guild.settings.leveling.options.xp.min} xp\`
Max Length of Message Required(maxlength) -> \`${guild.settings.leveling.options.filter.maxLength}\`
Min Length of Message Required(minlength) -> \`${guild.settings.leveling.options.filter.minLength}\`
Giving Xp Delay By Seconds(delay) -> \`${guild.settings.leveling.options.delay} seconds\``)
          .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
          message.channel.send(optionsEmbed)
        } else if (args[0].toLowerCase() == "max") {
          if (!args[1]) return message.error("You didn't provide a max amount for gaining xp.", true, "max <amount>")
          if (args[1] < 100 || args[1] > 9999) return message.error("Max xp must be in range of 10,000 and 100")
          if (args[1] < guild.settings.leveling.options.xp.min) return message.error("Max cannot be smaller than min xp.")
          guild.settings.leveling.options.xp.max = Number(args[1]);
          message.guild.settings.leveling.options.xp.max = Number(args[1]);
          guild.save().then(() => message.success(`Max xp can be given has been set to \`${guild.settings.leveling.options.xp.max} xp\``)).catch(err => message.error("An error occured: " + err))
        } else if (args[0].toLowerCase() == "min") {
          if (!args[1]) return message.error("You didn't provide a min amount for gaining xp.", true, "min <amount>")
          if (args[1] < 10 || args[1] > 9999) return message.error("Min xp must be in range of 10 and 10,000")
          if (args[1] > guild.settings.leveling.options.xp.max) return message.error("Min cannot be bigger than max xp.")
          guild.settings.leveling.options.xp.min = Number(args[1]);
          message.guild.settings.leveling.options.xp.min = Number(args[1]);
          guild.save().then(() => message.success(`Min xp can be given has been set to \`${guild.settings.leveling.options.xp.min} xp\``)).catch(err => message.error("An error occured: " + err))
        } else if (args[0].toLowerCase() == "maxlength") {
          if (!args[1]) return message.error("You didn't provide a max length amount for gaining xp.", true, "maxlength <amount>")
          if (args[1] < guild.settings.leveling.options.xp.maxLength) return message.error("Max length cannot be smaller than min length.")
          if (args[1] < 0 || args[1] > 4000) return message.error("Max length must be in range of 0 to 4000")
          guild.settings.leveling.options.filter.maxLength = Number(args[1]);
          message.guild.settings.leveling.options.filter.maxLength = Number(args[1]);
          guild.save().then(() => message.success(`Max length of a message that can get xp has been set to \`${guild.settings.leveling.options.filter.maxLength}\``)).catch(err => message.channel.send("An error occured: " + err))

        } else if (args[0].toLowerCase() == "minlength") {
          if (!args[1]) return message.error("You didn't provide a min length amount for gaining xp.", true, "minlength <amount>")
          if (args[1] < guild.settings.leveling.options.xp.minLength) return message.error("Min length cannot be bigger than max length.")
          if (args[1] < 0 || args[1] > 120) return message.error("Min length must be in range of 0 to 120")
          guild.settings.leveling.options.filter.minLength = Number(args[1]);
          message.guild.settings.leveling.options.filter.minLength = Number(args[1]);
          guild.save().then(() => message.success(`Min length of a message that can get xp has been set to \`${guild.settings.leveling.options.filter.minLength}\``)).catch(err => message.channel.send("An error occured: " + err))

        } else if (args[0].toLowerCase() == "delay") {
          if (!args[1]) return message.error("You didn't provide a delay for gaining xp.", true, "delay <amount>")
          if (args[1] < 10 || args[1] > 300) return message.error("Delay must be in range of 3 to 300 seconds.")
          guild.settings.leveling.options.delay = Number(args[1]);
          message.guild.settings.leveling.options.delay = Number(args[1]);
          guild.save().then(() => message.error(`Xp giving delay has been set to \`${guild.settings.leveling.options.delay}\` seconds.`)).catch(err => message.channel.send("An error occured: " + err))

        } else {
          return message.error("You didn't provide a true option", true, this.usage)
        }
      }
    })
  }
};
