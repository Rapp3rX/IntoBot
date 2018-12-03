# IntoBot

Casual bot for the into.hu Discord server.

## Prerequisites

 - Node.js (8.6 or higher is recommended) and npm
 - A Discord bot token
 - A Giphy API key

## Development

Clone the repository:

```sh
git clone git@github.com:Rapp3rX/IntoBot
cd IntoBot
```

Install the dependencies:

```sh
npm i -g yarn
yarn
```

Edit the necessary files in your favorite code editor.

For everyday development, usage of tools like `nodemon` is recommended.

```sh
npm i -g nodemon
nodemon
```

## Deployment

The production deployment is done via Heroku. A procfile is included in the repository, so each merged commit will automatically be deployed to the production build.

To build locally you will need to set two environment variables: `BOT_TOKEN` and `GIPHY_KEY`. You can start your app like this:

```sh
BOT_TOKEN=your_token GIPHY_KEY=your_giphy_key node .
```

If you want to deploy the bot to your own server and you have already set your environment variables, you can use tools like `pm2` to run the bot continuously.

```sh
npm i -g pm2
pm2 start /path/to/your/pm2/config
```
