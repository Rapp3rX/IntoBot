const Vibrant = require('node-vibrant');

class Quote {
  constructor(opts) {
    this.id = opts.id;
    this.reply = opts.reply;
    this.message = opts.message;
  }

  error(text) {
    return this.message.channel.send(`:exclamation_sign: ${text}`);
  }

  generateEmbed(data) {
    return {
      author: {
        name: data.author.username,
        icon_url: data.author.avatarURL
      },
      color: data.color,
      description: data.quote,
      timestamp: data.time
    };
  }

  async getAccentColor(src) {
    const colors = await Vibrant.from(src).getPalette();
    return parseInt(colors.LightVibrant.getHex().slice(1), 16).toString(10);
  }

  makeReply() {
    return `**${this.message.author} válasza:**\n${this.reply}`;
  }

  async init() {
    if (!this.id) {
      return this.error('Az idézni kívánt üzenet ID-ja nincs megadva.');
    }

    const target = await this.message.channel.fetchMessage(this.id);

    if (!target) {
      return this.error('Nincs ilyen üzenet a csatornában.');
    }

    const color = await this.getAccentColor(target.author.avatarURL);

    this.message.channel.send({
      embed: this.generateEmbed({
        author: target.author,
        quote: target.content,
        time: target.createdTimestamp,
        color
      })
    });

    if (this.reply) {
      this.message.channel.send(this.makeReply());
    }

    this.message.delete();
  }
}

module.exports = Quote;
