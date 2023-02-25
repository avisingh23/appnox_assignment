module.exports = {
    async up(db) {
        await db.collection('role').insertOne({
            name: 'Admin',
            isAdmin: true,
            isSystemGenerated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await db.collection('role').insertOne({
            name: 'User',
            isAdmin: false,
            isSystemGenerated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    },

    async down(db) {
        await db.collection('role').deleteOne({
            name: 'User',
        });
        await db.collection('role').deleteOne({
            name: 'Admin',
        });
    },
};
