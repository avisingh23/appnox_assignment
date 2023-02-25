module.exports = {
    async up(db) {
        await db.collection('permission').insertOne({
            name: 'Todo Management',
            code: 'todoManagement',
            description: 'User with this permission can manage todo created by any user',
        });
    },

    async down(db) {
        await db.collection('permission').deleteOne({
            code: 'todoManagement',
        });
    },
};
