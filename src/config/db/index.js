const mongoose = require('mongoose')
const MONGO_URI =
  'mongodb+srv://nguyenntoandtu:Toancute1%40@cluster0.pcvkvn8.mongodb.net/chinese_learning'

//??  xai` mongo compass chứ.
if (!mongoose.connection.readyState) {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log(`✅ MongoDB connected! ${MONGO_URI}`))
    .catch((err) => console.error('❌ MongoDB connection error:', err))
}

// const createCollections = async () => {
//   try {
//     const collections = [
//       'Users',
//       'Courses',
//       'Lessons',
//       'Hinas',
//       'Vocabularys',
//       'Grammars',
//       'Kanjis',
//       'Decks',
//       'Flashcards',
//       'Exams',
//       'Progressions',
//       'Notifications',
//       'Renshuus'
//     ]

//     for (const collection of collections) {
//       await mongoose.connection.db.createCollection(collection)
//       console.log(`✅ Created collection: ${collection}`);
//     }
//   } catch (err) {
//     console.error('❌ Error creating collections:', err)
//   }
// }

// mongoose.connection.once('open', () => {
//   createCollections()
// })
module.exports = mongoose
