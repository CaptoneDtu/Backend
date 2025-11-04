require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('../models/Vocabulary.model');

const TEACHER_ID = '68e5ffe2706f4f49cff7e250';

const vocabularyData = [
    {
        chinese: '你好',
        pinyin: 'nǐ hǎ',
        vietnamese: 'Xin chào',
        audioUrl: null,
        example: {
            chinese: '你好！很高兴见到你。',
            pinyin: 'Nǐ hǎo! Hěn gāo xìng jiàn dào nǐ.',
            vietnamese: 'Xin chào! Rất vui được gặp bạn.'
        },
        note: 'Cách chào phổ biến nhất trong tiếng Trung',
        level: 'HSK1',
        wordType: 'other',
        createdBy: TEACHER_ID
    },
    {
        chinese: '谢谢',
        pinyin: 'xiè xie',
        vietnamese: 'Cảm ơn',
        audioUrl: null,
        example: {
            chinese: '谢谢你的帮助！',
            pinyin: 'Xiè xie nǐ de bāng zhù!',
            vietnamese: 'Cảm ơn sự giúp đỡ của bạn!'
        },
        note: 'Nói hai lần "xiè" để tỏ lòng biết ơn',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '对不起',
        pinyin: 'duì bu qǐ',
        vietnamese: 'Xin lỗi',
        audioUrl: null,
        example: {
            chinese: '对不起，我迟到了。',
            pinyin: 'Duì bu qǐ, wǒ chí dào le.',
            vietnamese: 'Xin lỗi, tôi đến muộn rồi.'
        },
        note: 'Dùng khi xin lỗi hoặc cảm thấy có lỗi',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '再见',
        pinyin: 'zài jiàn',
        vietnamese: 'Tạm biệt',
        audioUrl: null,
        example: {
            chinese: '再见！明天见！',
            pinyin: 'Zài jiàn! Míng tiān jiàn!',
            vietnamese: 'Tạm biệt! Ngày mai gặp lại!'
        },
        note: 'Nghĩa đen là "gặp lại"',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '请',
        pinyin: 'qǐng',
        vietnamese: 'Mời, xin',
        audioUrl: null,
        example: {
            chinese: '请坐。',
            pinyin: 'Qǐng zuò.',
            vietnamese: 'Mời ngồi.'
        },
        note: 'Dùng để tỏ sự lịch sự khi đề nghị hoặc yêu cầu',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '老师',
        pinyin: 'lǎo shī',
        vietnamese: 'Giáo viên',
        audioUrl: null,
        example: {
            chinese: '我的老师很好。',
            pinyin: 'Wǒ de lǎo shī hěn hǎo.',
            vietnamese: 'Giáo viên của tôi rất tốt.'
        },
        note: 'Nghĩa đen: "người già" + "thầy"',
        level: 'HSK1',
        wordType: 'noun',
        createdBy: TEACHER_ID
    },
    {
        chinese: '学生',
        pinyin: 'xué sheng',
        vietnamese: 'Học sinh',
        audioUrl: null,
        example: {
            chinese: '他是学生。',
            pinyin: 'Tā shì xué sheng.',
            vietnamese: 'Anh ấy là học sinh.'
        },
        note: 'Nghĩa đen: "học" + "sinh"',
        level: 'HSK1',
        wordType: 'noun',
        createdBy: TEACHER_ID
    },
    {
        chinese: '朋友',
        pinyin: 'péng you',
        vietnamese: 'Bạn bè',
        audioUrl: null,
        example: {
            chinese: '他是我的好朋友。',
            pinyin: 'Tā shì wǒ de hǎo péng you.',
            vietnamese: 'Anh ấy là bạn tốt của tôi.'
        },
        note: 'Chỉ quan hệ bạn bè thân thiết',
        level: 'HSK1',
        wordType: 'noun',
        createdBy: TEACHER_ID
    },
    {
        chinese: '爱',
        pinyin: 'ài',
        vietnamese: 'Yêu',
        audioUrl: null,
        example: {
            chinese: '我爱你。',
            pinyin: 'Wǒ ài nǐ.',
            vietnamese: 'Tôi yêu bạn.'
        },
        note: 'Có thể chỉ tình yêu hoặc sự yêu thích',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '喜欢',
        pinyin: 'xǐ huan',
        vietnamese: 'Thích',
        audioUrl: null,
        example: {
            chinese: '我喜欢学习中文。',
            pinyin: 'Wǒ xǐ huan xué xí zhōng wén.',
            vietnamese: 'Tôi thích học tiếng Trung.'
        },
        note: 'Mức độ ưa thích nhẹ hơn 爱',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '吃',
        pinyin: 'chī',
        vietnamese: 'Ăn',
        audioUrl: null,
        example: {
            chinese: '你吃饭了吗？',
            pinyin: 'Nǐ chī fàn le ma?',
            vietnamese: 'Bạn ăn cơm chưa?'
        },
        note: 'Câu hỏi phổ biến khi gặp gỡ',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '喝',
        pinyin: 'hē',
        vietnamese: 'Uống',
        audioUrl: null,
        example: {
            chinese: '我想喝水。',
            pinyin: 'Wǒ xiǎng hē shuǐ.',
            vietnamese: 'Tôi muốn uống nước.'
        },
        note: 'Động từ chỉ hành động uống',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '看',
        pinyin: 'kàn',
        vietnamese: 'Nhìn, xem',
        audioUrl: null,
        example: {
            chinese: '我在看书。',
            pinyin: 'Wǒ zài kàn shū.',
            vietnamese: 'Tôi đang đọc sách.'
        },
        note: 'Có nhiều nghĩa: nhìn, xem, đọc',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '听',
        pinyin: 'tīng',
        vietnamese: 'Nghe',
        audioUrl: null,
        example: {
            chinese: '我在听音乐。',
            pinyin: 'Wǒ zài tīng yīn yuè.',
            vietnamese: 'Tôi đang nghe nhạc.'
        },
        note: 'Động từ chỉ hành động nghe',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '说',
        pinyin: 'shuō',
        vietnamese: 'Nói',
        audioUrl: null,
        example: {
            chinese: '你说什么？',
            pinyin: 'Nǐ shuō shén me?',
            vietnamese: 'Bạn nói gì?'
        },
        note: 'Động từ chỉ hành động nói',
        level: 'HSK1',
        wordType: 'verb',
        createdBy: TEACHER_ID
    },
    {
        chinese: '大',
        pinyin: 'dà',
        vietnamese: 'To, lớn',
        audioUrl: null,
        example: {
            chinese: '这个苹果很大。',
            pinyin: 'Zhè ge píng guǒ hěn dà.',
            vietnamese: 'Quả táo này rất to.'
        },
        note: 'Chỉ kích thước lớn',
        level: 'HSK1',
        wordType: 'adjective',
        createdBy: TEACHER_ID
    },
    {
        chinese: '小',
        pinyin: 'xiǎo',
        vietnamese: 'Nhỏ, bé',
        audioUrl: null,
        example: {
            chinese: '我有一个小弟弟。',
            pinyin: 'Wǒ yǒu yí ge xiǎo dì di.',
            vietnamese: 'Tôi có một em trai nhỏ.'
        },
        note: 'Chỉ kích thước nhỏ hoặc tuổi trẻ',
        level: 'HSK1',
        wordType: 'adjective',
        createdBy: TEACHER_ID
    },
    {
        chinese: '多',
        pinyin: 'duō',
        vietnamese: 'Nhiều',
        audioUrl: null,
        example: {
            chinese: '他有很多书。',
            pinyin: 'Tā yǒu hěn duō shū.',
            vietnamese: 'Anh ấy có rất nhiều sách.'
        },
        note: 'Chỉ số lượng nhiều',
        level: 'HSK1',
        wordType: 'adjective',
        createdBy: TEACHER_ID
    },
    {
        chinese: '少',
        pinyin: 'shǎo',
        vietnamese: 'Ít',
        audioUrl: null,
        example: {
            chinese: '我的钱很少。',
            pinyin: 'Wǒ de qián hěn shǎo.',
            vietnamese: 'Tiền của tôi rất ít.'
        },
        note: 'Chỉ số lượng ít',
        level: 'HSK1',
        wordType: 'adjective',
        createdBy: TEACHER_ID
    },
    {
        chinese: '好',
        pinyin: 'hǎo',
        vietnamese: 'Tốt, hay',
        audioUrl: null,
        example: {
            chinese: '今天天气很好。',
            pinyin: 'Jīn tiān tiān qì hěn hǎo.',
            vietnamese: 'Hôm nay thời tiết rất tốt.'
        },
        note: 'Tính từ rất đa dụng trong tiếng Trung',
        level: 'HSK1',
        wordType: 'adjective',
        createdBy: TEACHER_ID
    }
];

async function seedVocabulary() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        await Vocabulary.deleteMany({ createdBy: TEACHER_ID });
        console.log('Đã xóa dữ liệu vocabulary cũ của giáo viên này');
        
        const vocabularies = await Vocabulary.insertMany(vocabularyData);
        console.log(`✅ Đã tạo ${vocabularies.length} từ vựng thành công!`);
        
        console.log('\nPhân loại theo wordType:');
        const byType = vocabularies.reduce((acc, v) => {
            acc[v.wordType] = (acc[v.wordType] || 0) + 1;
            return acc;
        }, {});
        Object.entries(byType).forEach(([type, count]) => {
            console.log(`  - ${type}: ${count} từ`);
        });
        
        console.log(`\nID Giáo viên: ${TEACHER_ID}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi seed vocabulary:', error);
        process.exit(1);
    }
}

seedVocabulary();
