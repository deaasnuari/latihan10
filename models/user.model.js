const db = require('./db');

//model User(berisi nquery dasar)
const User = {
    getAll: callback => {
        db.query('SELECT * FROM users', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    },

   create: (data, callback) => {
    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [data.name, data.email, data.password],
        callback
    );
},


    update: (id, data, callback) => {
    db.query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [data.name, data.email, data.password, id],
        callback
    );
},


    delete: (id, callback) => {
        db.query('DELETE FROM users WHERE id = ?', [id], callback);
    },

    //get user by Email (untuk  login)
    findByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },
};

module.exports = User;
