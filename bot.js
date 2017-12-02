const Discord = require("discord.js");

const TOKEN = "MzM5ODYwNzY0MTMzMTYzMDIy.DQQldw.X66UD00L_STRMs3SwZRoFhTjf3o";
const PREFIX = "!";
const BOTNAME = "IntoBot";

var client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame("into.hu");
  client.user.setUsername("IntoBot");
});

client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`${member} csatlakozott a szerverhez!`);
  });

  client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`${member} elhagyta a szervert!`);
  });

client.on("message", function(message) {
    if (message.author.equals(client.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()){
        case "ping":
            message.channel.send("Pong!");
            break;
        case "help":
            message.channel.send("Szia! Elérhető parancsok:\n- !help\n- !ping");
            break;
        default:
            message.channel.send("Ez a parancs nem létezik! !help");
                        
    }
});

client.login(process.env.BOT_TOKEN);     
