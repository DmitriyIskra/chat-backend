const usersList = {
    users: [
        {
            id: '1',
            name: 'Admin',
            ws: ''
        }
    ],

    add(user) { 
        this.users.push(user);
    },

    delete(ws) {
        const index = this.users.findIndex(item => item.ws === ws);
        this.users.splice(index, 1);
    },

    findName(name) {
        return this.users
        .some(item => item.name.toLowerCase() === name.toLowerCase());
    },

    findId(ws) {
        const el = this.users.find( item => item.ws === ws);
        return el.id;
    }
}  

module.exports = usersList; 