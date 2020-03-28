(async () => {

    var TelegramBot = require('node-telegram-bot-api');
    var usersService = require('./usersService')
    var parseService = require('./parseService')
    var token = '1123925771:AAEaRMmo9WWg7FOlz1w5Wgz7YDFXQFil8d8';
    var bot = new TelegramBot(token, { polling: true });
    var me = 725757794;

    bot.onText(/start/, function (msg) {
        let user = msg.from.id;
        usersService.addUser(user);
    })

    bot.onText(/quit/, function (msg) {
        let user = msg.from.id;
        usersService.removeUser(user);
    })

    bot.onText(/info/, function (msg) {
        let user = msg.from.id;
        sendInfo(user);
    })

    process.on('uncaughtException', function (err) {
        bot.sendMessage(me, err.message);
    })

    setInterval(() => {
        let users = usersService.getUsers();
    }, 5000);

    function sendInfo(user) {
        parseService.parse().then(function (value) {

            // users.forEach(user => {
            let message = getMessage(value);

            bot.sendMessage(user, message);
        })
        // }, function (reason) { });
    }






    function getMessage(packages) {
        let message = "";

        for (let i = 0; i < packages.length; i++) {
            let package = packages[i];

            let packageMessage = `Посылка "${package.name}": \nпоследний трекинг ${package.statuses[0].date
                .toLocaleDateString('ru-RU')}\n${package.statuses[0].text}\n===============================\n`;

            message = message + packageMessage;
        }

        return message;
    }    
})();