fs = require('fs')

function getUsers() {
    let users = fs.readFileSync('users.txt').toString().split("\n");
    let filteredUsers = users.filter(u => u != "");
    return filteredUsers;
}

function addUser(user) {
    let users = getUsers();
    let presents = false;

    for (let i = 0; i < users.length; i++) {
        if (users[i] == user) {
            presents = true;
        }
    }

    if (!presents) {
        fs.appendFile('users.txt', `\n${user}`, function () { });
    }
}

function removeUser(user) {
    let users = getUsers();
    let presents = false;

    for (let i = 0; i < users.length; i++) {
        if (users[i] == user) {
            presents = true;
        }
    }

    if (presents) {
        let usersWithoutRemoved = users.filter(u => u != user);
        fs.writeFile('users.txt',
            usersWithoutRemoved.map(function (v) { return v.join(', ') }).join('\n'),
            function () { });
    }
}

module.exports = {
    getUsers: getUsers,
    add: addUser,
    removeUser: removeUser
}