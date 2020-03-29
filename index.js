(async () => {

    var usersService = require('./usersService')
    var parseService = require('./parseService')

    var express = require('express');
    var app = express();

    var TelegramBot = require('node-telegram-bot-api');
    var token = '1123925771:AAEaRMmo9WWg7FOlz1w5Wgz7YDFXQFil8d8';
    var bot = new TelegramBot(token, { polling: true });

    var adminUser = 725757794;

    app.listen(process.env.PORT, function () {

        bot.onText(/start/, function (msg) {
            let user = msg.from.id;
            if (usersService.addUser(user)) {
                bot.sendMessage(user, "Вы были успешно подписаны на рассылку");
            }
        })

        bot.onText(/quit/, function (msg) {
            let user = msg.from.id;
            if (usersService.removeUser(user)) {
                bot.sendMessage(user, "Рассылка отключена");
            }
        })

        bot.onText(/info/, async function (msg) {
            let user = msg.from.id;
            let message = await parseService.getMessage();

            bot.sendMessage(user, message);
        })

        process.on('uncaughtException', function (err) {
            bot.sendMessage(adminUser, err.message);
        })

        setInterval(() => {
            console.log("ok");
        }, 300000); // 5 minutes
    });
})();