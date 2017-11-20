const crypto = require('crypto');

module.exports = {
    create: function (login, password) {
        let salt = crypto.randomBytes(32).toString('hex');
        let hashed_password = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
        return {login, password: hashed_password, salt};
    },
    hash(password, salt) {
        return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    }
};