fs = require('fs')
const userFile = "users.txt";

function getUsersInfo() {
    let fileData = fs.readFileSync(userFile, 'utf8');
    try {
        let users = JSON.parse(fileData);
        return users;
    } catch (e) {
        return;
    }
}

function addUser(user) {
    let users = getUsersInfo();

    if (users == undefined) {
        users = [];
    }

    if (!users.includes(user)) {
        users.push(user);
        let json = JSON.stringify(users);
        fs.writeFile(userFile, json, function () { console.log("added user " + user) });
        return true;
    }

    return false;
}

function removeUser(user) {
    let users = getUsersInfo();

    if (users == undefined || !users.includes(user)) {
        return false;
    }

    let index = users.indexOf(user);
    if (index > -1) {
        users.splice(index, 1);
    }

    let json = JSON.stringify(users);
    fs.writeFile(userFile, json, function () { console.log("remove user " + user) });

    return true;
}

module.exports = {
    addUser: addUser,
    removeUser: removeUser
}