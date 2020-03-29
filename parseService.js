const request = require("request");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

var urls = [
    {
        url: "https://gdeposylka.ru/courier/omniva/tracking/RO427576146EE",
        name: "Raspberry"
    },
    {
        url: "https://gdeposylka.ru/courier/omniva/tracking/RO429132763EE",
        name: "SD карта"
    },
    {
        url: "https://gdeposylka.ru/courier/china-ems/tracking/LA099161403CN",
        name: "Блок питания"
    },
    {
        url: "https://gdeposylka.ru/courier/omniva/tracking/SB082733098EE",
        name: "RCA кабель 1,5 м"
    },
    {
        url: "https://gdeposylka.ru/courier/china-ems/tracking/LA096961183CN",
        name: "Корпус"
    }
]

function parseBody(body) {

    var statuses = [];
    var $ = cheerio.load(body, { decodeEntities: false });
    var packageStatusSections = $(".info.status-iconed");

    $(packageStatusSections).each(function (index, value) {
        var statusSection = $(value);

        var statusValue = statusSection.children(".checkpoint-status").first().html();
        var trimmedStatusValue = statusValue.trim();

        var statusDate = statusSection.children(".datetime2").attr('datetime');
        var parsedStatusDate = new Date(Date.parse(statusDate));

        var status = { text: trimmedStatusValue, date: parsedStatusDate };

        statuses.push(status);
    });

    return statuses;
}

async function getPackagesInfo() {
    return new Promise(async (resolve, reject) => {

        var packagesInfo = [];

        for (const element of urls) {

            var body = await fetch(element.url)
                .then(function (response) {
                    return response.text();
                });

            var statuses = parseBody(body);

            packagesInfo.push(
                {
                    url: element.url,
                    name: element.name,
                    statuses: statuses
                }
            );
        }

        if (packagesInfo.length > 0) {
            resolve(packagesInfo);
        }
        else {
            reject();
        }
    });
}

async function getMessage() {
    let message = "";
    let packages = await getPackagesInfo();

    for (let i = 0; i < packages.length; i++) {
        let package = packages[i];

        let packageMessage = `Посылка "${package.name}": \nпоследний трекинг ${package.statuses[0].date
            .toLocaleDateString('ru-RU')}\n${package.statuses[0].text}\n===============================\n`;

        message = message + packageMessage;
    }

    return message;
}

module.exports = {
    getMessage: getMessage
}