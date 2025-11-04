require('dotenv').config();
const mongoose = require('mongoose');
const Deck = require('../models/Deck.model');
const FlashCard = require('../models/FlashCard.model');

const TEACHER_ID = '68e5ffe2706f4f49cff7e250';

const flashcardsData = {
    'FlashCard Bình Thường - Câu Hỏi Cơ Bản': [
        { 
            type: 'normal',
            frontText: 'Tiếng Trung của "Xin chào" là gì?',
            backText: '你好 (nǐ hǎo)'
        },
        { 
            type: 'normal',
            frontText: 'Nói "Cảm ơn" bằng tiếng Trung như thế nào?',
            backText: '谢谢 (xiè xie)'
        },
        { 
            type: 'normal',
            frontText: '"再见" nghĩa là gì?',
            backText: 'Tạm biệt / Goodbye'
        },
        { 
            type: 'normal',
            frontText: 'Đếm từ 1 đến 5 bằng tiếng Trung',
            backText: '一 (yī), 二 (èr), 三 (sān), 四 (sì), 五 (wǔ)'
        },
        { 
            type: 'normal',
            frontText: 'Câu "我是学生" nghĩa là gì?',
            backText: 'Tôi là học sinh'
        }
    ],
    'Từ Vựng HSK 1 - Lời Chào': [
        { 
            type: 'vocabulary',
            vocabularyData: {
                chinese: '你好', 
                pinyin: 'nǐ hǎo', 
                vietnamese: 'Xin chào',
                level: 'HSK1',
                wordType: 'other',
                example: {
                    chinese: '你好！我叫小明。',
                    pinyin: 'Nǐ hǎo! Wǒ jiào Xiǎo Míng.',
                    vietnamese: 'Xin chào! Tôi tên là Tiểu Minh.'
                }
            }
        },
        { 
            type: 'vocabulary',
            vocabularyData: {
                chinese: '谢谢', 
                pinyin: 'xiè xie', 
                vietnamese: 'Cảm ơn',
                level: 'HSK1',
                wordType: 'verb',
                example: {
                    chinese: '谢谢你的帮助。',
                    pinyin: 'Xiè xie nǐ de bāng zhù.',
                    vietnamese: 'Cảm ơn sự giúp đỡ của bạn.'
                }
            }
        },
        { 
            type: 'vocabulary',
            vocabularyData: {
                chinese: '再见', 
                pinyin: 'zài jiàn', 
                vietnamese: 'Tạm biệt',
                level: 'HSK1',
                wordType: 'verb',
                example: {
                    chinese: '再见！明天见。',
                    pinyin: 'Zài jiàn! Míng tiān jiàn.',
                    vietnamese: 'Tạm biệt! Ngày mai gặp lại.'
                }
            }
        },
        { 
            type: 'vocabulary',
            vocabularyData: {
                chinese: '对不起', 
                pinyin: 'duì bu qǐ', 
                vietnamese: 'Xin lỗi',
                level: 'HSK1',
                wordType: 'verb',
                example: {
                    chinese: '对不起，我迟到了。',
                    pinyin: 'Duì bu qǐ, wǒ chí dào le.',
                    vietnamese: 'Xin lỗi, tôi đến muộn rồi.'
                }
            }
        },
        { 
            type: 'vocabulary',
            vocabularyData: {
                chinese: '没关系', 
                pinyin: 'méi guān xi', 
                vietnamese: 'Không sao',
                level: 'HSK1',
                wordType: 'other',
                example: {
                    chinese: '对不起。没关系。',
                    pinyin: 'Duì bu qǐ. Méi guān xi.',
                    vietnamese: 'Xin lỗi. Không sao.'
                }
            }
        }
    ],
    'Từ Vựng HSK 1 - Số Đếm': [
        { type: 'vocabulary', vocabularyData: { chinese: '一', pinyin: 'yī', vietnamese: 'Một', level: 'HSK1', wordType: 'number' }},
        { type: 'vocabulary', vocabularyData: { chinese: '二', pinyin: 'èr', vietnamese: 'Hai', level: 'HSK1', wordType: 'number' }},
        { type: 'vocabulary', vocabularyData: { chinese: '三', pinyin: 'sān', vietnamese: 'Ba', level: 'HSK1', wordType: 'number' }},
        { type: 'vocabulary', vocabularyData: { chinese: '四', pinyin: 'sì', vietnamese: 'Bốn', level: 'HSK1', wordType: 'number' }},
        { type: 'vocabulary', vocabularyData: { chinese: '五', pinyin: 'wǔ', vietnamese: 'Năm', level: 'HSK1', wordType: 'number' }},
        { type: 'vocabulary', vocabularyData: { chinese: '六', pinyin: 'liù', vietnamese: 'Sáu', level: 'HSK1', wordType: 'number' }},
        { type: 'vocabulary', vocabularyData: { chinese: '七', pinyin: 'qī', vietnamese: 'Bảy', level: 'HSK1', wordType: 'number' }},
        { type: 'vocabulary', vocabularyData: { chinese: '八', pinyin: 'bā', vietnamese: 'Tám', level: 'HSK1', wordType: 'number' }},
        { type: 'vocabulary', vocabularyData: { chinese: '九', pinyin: 'jiǔ', vietnamese: 'Chín', level: 'HSK1', wordType: 'number' }},
        { type: 'vocabulary', vocabularyData: { chinese: '十', pinyin: 'shí', vietnamese: 'Mười', level: 'HSK1', wordType: 'number' }}
    ],
    'Ngữ Pháp HSK 1 - Cấu Trúc Cơ Bản': [
        { 
            type: 'grammar',
            grammarData: {
                structure: '主语 + 动词 + 宾语',
                explanation: 'Cấu trúc câu cơ bản nhất trong tiếng Trung: Chủ ngữ + Động từ + Tân ngữ',
                level: 'HSK1',
                examples: [
                    {
                        chinese: '我吃饭',
                        pinyin: 'Wǒ chī fàn',
                        vietnamese: 'Tôi ăn cơm'
                    },
                    {
                        chinese: '他喝水',
                        pinyin: 'Tā hē shuǐ',
                        vietnamese: 'Anh ấy uống nước'
                    }
                ],
                note: 'Trật tự từ trong tiếng Trung giống tiếng Việt: chủ ngữ đứng đầu'
            }
        },
        { 
            type: 'grammar',
            grammarData: {
                structure: '主语 + 是 + 名词',
                explanation: 'Dùng 是 (shì) để nối chủ ngữ với danh từ, tương đương "là" trong tiếng Việt',
                level: 'HSK1',
                examples: [
                    {
                        chinese: '我是学生',
                        pinyin: 'Wǒ shì xué sheng',
                        vietnamese: 'Tôi là học sinh'
                    },
                    {
                        chinese: '他是老师',
                        pinyin: 'Tā shì lǎo shī',
                        vietnamese: 'Anh ấy là giáo viên'
                    }
                ],
                note: '是 không được bỏ qua trong câu'
            }
        },
        { 
            type: 'grammar',
            grammarData: {
                structure: '主语 + 很 + 形容词',
                explanation: 'Dùng 很 (hěn) trước tính từ để bổ nghĩa. 很 thường mất nghĩa "rất" trong câu trần thuật đơn giản',
                level: 'HSK1',
                examples: [
                    {
                        chinese: '他很高',
                        pinyin: 'Tā hěn gāo',
                        vietnamese: 'Anh ấy cao'
                    },
                    {
                        chinese: '我很好',
                        pinyin: 'Wǒ hěn hǎo',
                        vietnamese: 'Tôi khỏe'
                    }
                ],
                note: 'Không có 很 câu sẽ có nghĩa so sánh'
            }
        },
        { 
            type: 'grammar',
            grammarData: {
                structure: '主语 + 在 + 地点',
                explanation: '在 (zài) chỉ vị trí hoặc địa điểm, tương đương "ở" trong tiếng Việt',
                level: 'HSK1',
                examples: [
                    {
                        chinese: '我在家',
                        pinyin: 'Wǒ zài jiā',
                        vietnamese: 'Tôi ở nhà'
                    },
                    {
                        chinese: '他在学校',
                        pinyin: 'Tā zài xué xiào',
                        vietnamese: 'Anh ấy ở trường'
                    }
                ]
            }
        },
        { 
            type: 'grammar',
            grammarData: {
                structure: '动词 + 吗？',
                explanation: 'Thêm 吗 (ma) vào cuối câu để tạo câu hỏi có/không',
                level: 'HSK1',
                examples: [
                    {
                        chinese: '你吃饭吗？',
                        pinyin: 'Nǐ chī fàn ma?',
                        vietnamese: 'Bạn ăn cơm không?'
                    },
                    {
                        chinese: '你是学生吗？',
                        pinyin: 'Nǐ shì xué sheng ma?',
                        vietnamese: 'Bạn là học sinh không?'
                    }
                ],
                note: 'Cách đặt câu hỏi đơn giản nhất'
            }
        },
        { 
            type: 'grammar',
            grammarData: {
                structure: '不 + 动词',
                explanation: 'Dùng 不 (bù) trước động từ để phủ định, tương đương "không" trong tiếng Việt',
                level: 'HSK1',
                examples: [
                    {
                        chinese: '我不吃',
                        pinyin: 'Wǒ bù chī',
                        vietnamese: 'Tôi không ăn'
                    },
                    {
                        chinese: '他不是老师',
                        pinyin: 'Tā bú shì lǎo shī',
                        vietnamese: 'Anh ấy không là giáo viên'
                    }
                ],
                note: '不 đọc là bú khi đứng trước thanh 4'
            }
        }
    ]
};

const decksData = [
    {
        title: 'FlashCard Bình Thường - Câu Hỏi Cơ Bản',
        description: 'Các câu hỏi trắc nghiệm cơ bản về tiếng Trung',
        createdBy: TEACHER_ID,
        tags: ['basic', 'quiz']
    },
    {
        title: 'Từ Vựng HSK 1 - Lời Chào',
        description: 'Các từ vựng chào hỏi cơ bản trong HSK 1',
        createdBy: TEACHER_ID,
        tags: ['HSK1', 'greetings']
    },
    {
        title: 'Từ Vựng HSK 1 - Số Đếm',
        description: 'Số đếm từ 1 đến 10 trong tiếng Trung',
        createdBy: TEACHER_ID,
        tags: ['HSK1', 'numbers']
    },
    {
        title: 'Ngữ Pháp HSK 1 - Cấu Trúc Cơ Bản',
        description: 'Các cấu trúc ngữ pháp cơ bản trong HSK 1',
        createdBy: TEACHER_ID,
        tags: ['HSK1', 'grammar']
    }
];

async function seedFlashcards() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Deck.deleteMany({ createdBy: TEACHER_ID });
        await FlashCard.deleteMany({});
        console.log('Đã xóa dữ liệu flashcard cũ của giáo viên này');

        let totalCards = 0;

        for (const deckData of decksData) {
            const deck = await Deck.create(deckData);
            console.log(`Đã tạo bộ thẻ: ${deck.title}`);

            const flashcards = flashcardsData[deck.title];
            if (flashcards && flashcards.length > 0) {
                const cardsToInsert = flashcards.map(card => ({
                    ...card,
                    deck: deck._id
                }));

                await FlashCard.insertMany(cardsToInsert);
                
                deck.stat.flashCardCount = flashcards.length;
                await deck.save();
                
                totalCards += flashcards.length;
                console.log(`  Đã thêm ${flashcards.length} thẻ học (${flashcards[0].type}) vào "${deck.title}"`);
            }
        }

        console.log('\n✅ Tạo dữ liệu flashcard thành công!');
        console.log(`ID Giáo viên: ${TEACHER_ID}`);
        console.log(`Tổng số Bộ thẻ: ${decksData.length}`);
        console.log(`Tổng số Thẻ học: ${totalCards}`);
        console.log('\nPhân loại:');
        console.log(`  - Normal: 5 cards`);
        console.log(`  - Vocabulary: 15 cards`);
        console.log(`  - Grammar: 6 cards`);

        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu flashcard:', error);
        process.exit(1);
    }
}

seedFlashcards();
