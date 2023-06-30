const usersList = {
    users: [
        {
            id: '1',
            name: 'Dmitriy'
        }
    ],

    add(user) {
        this.user.push(user);
    },

    delete(id) {
        const index = this.users.findIndex(item => item.id === id);
        this.users.splice(index, 1);
    },

    findName(name) {
        return this.users
        .some(item => item.name.toLowerCase() === name.toLowerCase());
    }
}

module.exports = usersList;