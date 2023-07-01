const chat = {
    messages: [
        {
            id: '1',
            date: '',
            name: 'Admin',
            message: 'Welcome to our paty',
        },
    ],

    add(data) {
        const { id, name, date, message } = data;

        const item = { id, name, date, message };

        this.messages.push(item);
    }
} 

module.exports = chat