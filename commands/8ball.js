const Discord = require("discord.js");

module.exports = {
  name: "8ball",
  category: "Fun",
  description: "Ask a question to 8ball",
  usage: "<question>",
  cooldown: 5,
  execute(bot, message, args) {
    if (!args[0]) return message.channel.send(":x: | You have to ask a question to 8ball!");
    if (args.join(' ').length >= 256 || args.join(' ').length < 1) return message.channel.send(":x: | Question must be in range of 1 to 256 characters!");
    
    const answers = ["As I see it, yes.","Ask again later.","Better not tell you now.","Cannot predict now.","Concentrate and ask again.",
    "Don’t count on it.", "It is certain.","It is decidedly so.","Most likely.","My reply is no.","My sources say no.","Outlook not so good.",
    "Outlook good.","Reply hazy, try again.","Signs point to yes.","Very doubtful.","Without a doubt.","Yes.","Yes – definitely.","You may rely on it."]
    const decision = answers[Math.floor(Math.random() * answers.length)]
    
    let ballEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter("Requested by " + message.author.tag, message.author.avatarURL())
      .setDescription(`${args.slice().join(" ")} \n\n**${decision}**`)
      .setColor("GOLD")

    message.channel.send(ballEmbed);
  }
};