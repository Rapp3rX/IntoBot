const Discord = require('discord.js');
const YTDL = require('ytdl-core');
const Giphy = require('./lib/giphy');
const Icndb = require('./lib/icndb');
const PREFIX = '.';

let client = new Discord.Client();
let servers = {};

const play = (connection, message) => {
    let server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], { filter: 'audioonly' }));
    server.queue.shift();
    server.dispatcher.on('end', () => {
        if (server.queue[0]) {
            play(connection, message);
        } else {
            connection.disconnect();
        }
    });
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame('on into.hu');
  client.user.setUsername('IntoBot');
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find('name', 'bot-log');
    if (!channel) return;
    channel.send(`${member} csatlakozott hozzánk! Üdvözlünk! :)`);
});

client.on('message', message => {
    let msg = message.content.toLowerCase();
    let sender = message.author;
    let cont = message.content.slice(PREFIX.length).split(' ');
    let args = cont.slice(1);
    let args1 = message.content.substring(PREFIX.length).split(' ');

    if (message.author.equals(client.user)) {
        return;
    }
    
    if (msg.startsWith(PREFIX + 'purge')) { 
        async function purge() {
            message.delete(); 
            
            if (!message.member.roles.find('name', 'DiscordAdmin')) {
                return message.channel.send(`${sender}, ehhez \DiscordAdmin\ role kell!`);
            }

            if (isNaN(args[0])) {
                return message.channel.send(`${sender}, kérlek adj meg értéket!. \nHasználat: ` + PREFIX + `purge <érték>`);                
            }

            const fetched = await message.channel.fetchMessages({ limit: args[0] }); 
            sender.send(fetched.size + ' üzenetet találtam, már is törlöm...');

            message.channel
                .bulkDelete(fetched)
                .catch(error => message.channel.send(`Hiba: ${error}`));

        }

        purge(); 
    }

    if (msg.startsWith(PREFIX + 'play')) {
        if (!message.member.roles.find('name', 'DiscordAdmin')) {
            return message.channel.send(`${sender}, ehhez \DiscordAdmin\ role kell!`);
        }

        if (!args1[0]) {
            return message.channel.send(`${sender}, kérlek adj meg egy linket!`);
        }

        if (!message.member.voiceChannel) {
            message.channel.send('Nem egy szobában vagy!');
        }
        if (!servers[message.guild.id]) {
            servers[message.guild.id] = { queue: [] };
        }

        let server = servers[message.guild.id];
        
        server.queue.push(args1[1]);

        if (!message.guild.voiceConnection) {
            message.member.voiceChannel
                .join()
                .then(connection => play(connection, message));
        }
    }

    if (msg.startsWith(PREFIX + 'skip')){
        var server = servers[message.guild.id];
        if (server.dispatcher) {
            server.dispatcher.end();
        }
    }

    if (msg.startsWith(PREFIX + 'stop')){
        var server = servers[message.guild.id]; 

        if (message.guild.voiceConnection) {
            for (let i = server.queue.length - 1; i >= 0; i--) {
                server.queue.splice(i, 1);
            }

            console.log(`[${ new Date().toLocaleString() }] Stopped the queue.`);
            message.guild.voiceConnection.disconnect();
            message.channel.send('Sikeresen leállítottad a zenét!');
        }
    }

    if (msg.startsWith(PREFIX + 'készítőd')){
        message.channel.send('Engem galosik készített!');
    }

    if (msg.startsWith(PREFIX + 'parancsok')){
        message.channel.send(`Üdvözöllek!\nPrefix: ${ PREFIX }\nElérhető parancsok tőlem:\n- készítőd(Ki készített)\n- parancsok(Parancs lista)\n - gif\n- joke`);
    }

    if (msg.startsWith(PREFIX + 'zhjegy')) {
        const a = Math.floor(Math.random() * 5) + 1;
        const suffix = a === 3 ? 'ra' : 're';
        message.channel.send(`Biztos vagyok benne ${ sender }, hogy a ZH-dat meg fogod tudni írni ${ a }-${ suffix }!`);
    }
    
    if (msg.startsWith(PREFIX + 'gif')){
        Giphy(args[0], process.env.GIPHY_KEY)
            .then(res => message.channel.send(res))
            .catch(err => {
                console.log(err.response.data);
                if (err.response && err.response.data.message === 'API rate limit exceeded') {
                    return message.channel.send('Túl sok GIF-et kértek tőlem... :frowning: ');
                }
                return message.channel.send('Egy váratlan hiba történt...');
            });
    }
    
    if (msg.startsWith(PREFIX + 'joke')){
        Icndb(sender)
            .then(res => message.channel.send(res))
            .catch(err => {
                console.log(err.response.data);
                return message.channel.send('Egy váratlan hiba történt...');
            });
    }

    if (msg.startsWith(PREFIX + 'gayrate')) {
        const random2 = Math.floor(Math.random() * 11);
        const a = (random2==1) ? 40 : 11;
        a = (random2==2) ? 2 : a;
        const random = Math.floor(Math.random() * a);
        if (args[0]) {
            return message.channel.send(`${ args[0] } gayrate-je **${ random }/10**.`);
        }
        return message.channel.send(`A gayrate-ed ${ random }/10.`);
    }
    
     if (msg.startsWith(PREFIX + 'google')) {
         message.delete();
         var allstring = encodeURIComponent(msg.replace(PREFIX + 'g',''));
         return message.channel.send(`https://hu.lmgtfy.com/?q=${ allstring }`);
    }
    
    if (msg.startsWith('xd')) {
        const gifs = [
            'https://media1.tenor.com/images/dc74818034bdeb1cb1c8c136fb675ecf/tenor.gif?itemid=4519855',
            'https://media.tenor.com/images/3372a43626ac121c4a7f9b7306e95e75/tenor.gif',
            'https://media.tenor.com/images/79afccd586f910ac9af99f14f009eb4e/tenor.gif'
        ];

        const a = Math.floor(Math.random() * gifs.length);

        message.channel.send(gifs[a]);
    }

    const badWords = [ 'anyád', 'geci', 'kurva', 'fasz', 'köcsög', '4ny4d', 'homo', 'cigány' ];

    if (badWords.some(h => msg.indexOf(h) >= 0)) {
        message.delete();
        message.channel.send(`Töröltem ${ sender } üzenetét! Indok: Káromkodás`);
    }
    
    const badWords2 = [ 'buzi', 'fuck', 'bazd', 'bassza', 'baszott'];
    
    if (badWords2.some(h => msg.indexOf(h) >= 0)) {
       message.delete();
        var emessage = msg.replace('fuck','hug');
        emessage = emessage.replace('bazd','öleld');
        emessage = emessage.replace('bassza','ölelje');
        emessage = emessage.replace('buzi','homoszexuális');
        emessage = emessage.replace('baszott','ölelt');
        message.channel.send(`${ sender } ezt szeretné mondani: ${ emessage }`);
    }
    
    
    const helloWords = [ 'lelép', 'good night',' jó8', 'jóccakát'];

    if (helloWords.some(h => msg.indexOf(h) >= 0)) {
        message.channel.send(`Szép estét neked is ${ sender }!`);
    }

    if (message.isMentioned(client.user)) {
         var texts = [
            'Igen, én vagyok! Esetleg szeretnél tőlem valamit '+sender+'? Mert akkor: .parancsok',
            'Szép napunk van, nem igaz '+sender+'?',
            'Hívtál '+sender+'? Mit szeretnél?'
        ];
        
        const a = Math.floor(Math.random() * texts.length);
        
        message.channel.send(texts[a]);
    }
});

client.login(process.env.BOT_TOKEN);     
