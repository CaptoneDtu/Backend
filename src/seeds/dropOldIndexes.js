require('dotenv').config();
const mongoose = require('mongoose');

async function dropOldIndexes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('flashcards');
        
        const indexes = await collection.indexes();
        console.log('Các indexes hiện có:', indexes.map(idx => idx.name));

        try {
            await collection.dropIndex('deck_1_chinese_1');
            console.log('Đã xóa index: deck_1_chinese_1');
        } catch (error) {
            console.log('Index deck_1_chinese_1 không tồn tại hoặc đã bị xóa');
        }

        console.log('Hoàn tất!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
}

dropOldIndexes();
