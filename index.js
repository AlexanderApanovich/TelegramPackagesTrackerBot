var TelegramBot = require('node-telegram-bot-api');
var usersService = require('./usersService')
var token = '1123925771:AAEaRMmo9WWg7FOlz1w5Wgz7YDFXQFil8d8';
var bot = new TelegramBot(token, { polling: true });

bot.onText(/start/, function (msg) {
    let user = msg.from.id;
    usersService.addUser(user);
})

bot.onText(/quit/, function (msg) {
    let user = msg.from.id;
    usersService.removeUser(user);
})

setInterval(function () {
    let users = usersService.getUsers();
    console.log(users)
    for (let i = 0; i < users.length; i++) {
        bot.sendMessage(users[i], 'хай');
    }
}, 1000);