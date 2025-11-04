require('dotenv').config();
const mongoose = require('mongoose');
const Grammar = require('../models/Grammar.model');

const TEACHER_ID = '68e5ffe2706f4f49cff7e250';

const grammarData = [
    {
        title: 'Cấu trúc câu cơ bản SVO',
        structure: '主语 + 动词 + 宾语',
        explanation: 'Cấu trúc câu cơ bản nhất trong tiếng Trung theo trật tự Chủ ngữ (S) + Động từ (V) + Tân ngữ (O). Trật tự này giống với tiếng Việt và tiếng Anh.',
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
            },
            {
                chinese: '我们学习中文',
                pinyin: 'Wǒ men xué xí zhōng wén',
                vietnamese: 'Chúng tôi học tiếng Trung'
            }
        ],
        note: 'Đây là nền tảng quan trọng nhất. Hầu hết câu tiếng Trung đều theo cấu trúc này.',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Động từ 是 nối chủ ngữ và danh từ',
        structure: '主语 + 是 + 名词',
        explanation: 'Động từ 是 (shì) có nghĩa là "là" và được dùng để nối chủ ngữ với danh từ hoặc cụm danh từ. Nó không thể bỏ qua.',
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
            },
            {
                chinese: '这是我的书',
                pinyin: 'Zhè shì wǒ de shū',
                vietnamese: 'Đây là sách của tôi'
            }
        ],
        note: 'Lưu ý: 是 không được dùng trước tính từ đơn thuần.',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Trạng từ 很 với tính từ',
        structure: '主语 + 很 + 形容词',
        explanation: 'Trong câu trần thuật đơn giản, thường dùng 很 (hěn) trước tính từ. Trong ngữ cảnh này, 很 không có nghĩa "rất" mà chỉ là từ đệm để câu tự nhiên hơn.',
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
            },
            {
                chinese: '天气很热',
                pinyin: 'Tiān qì hěn rè',
                vietnamese: 'Thời tiết nóng'
            }
        ],
        note: 'Nếu bỏ 很 (ví dụ: 他高), câu sẽ mang ý nghĩa so sánh: "Anh ấy cao (hơn)".',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Giới từ 在 chỉ vị trí',
        structure: '主语 + 在 + 地点',
        explanation: 'Giới từ 在 (zài) dùng để chỉ vị trí hoặc địa điểm nơi ai đó/cái gì đó đang ở, tương đương với "ở" trong tiếng Việt.',
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
            },
            {
                chinese: '书在桌子上',
                pinyin: 'Shū zài zhuō zi shàng',
                vietnamese: 'Sách ở trên bàn'
            }
        ],
        note: '在 cũng có thể là động từ "ở" hoặc trạng từ "đang".',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Câu hỏi với 吗',
        structure: '陈述句 + 吗？',
        explanation: 'Thêm 吗 (ma) vào cuối câu trần thuật để tạo thành câu hỏi Yes/No (có/không). Đây là cách đặt câu hỏi đơn giản nhất.',
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
            },
            {
                chinese: '他在家吗？',
                pinyin: 'Tā zài jiā ma?',
                vietnamese: 'Anh ấy ở nhà không?'
            }
        ],
        note: 'Câu hỏi 吗 có thể trả lời bằng 是 (có), 对 (đúng), hoặc 不 + động từ (không).',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Phủ định với 不',
        structure: '主语 + 不 + 动词/形容词',
        explanation: 'Dùng 不 (bù) trước động từ hoặc tính từ để phủ định, tương đương với "không" trong tiếng Việt.',
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
            },
            {
                chinese: '我不高',
                pinyin: 'Wǒ bù gāo',
                vietnamese: 'Tôi không cao'
            }
        ],
        note: '不 đọc là "bú" khi đứng trước thanh điệu thứ 4. Lưu ý: phủ định của 有 (yǒu) là 没有 (méi yǒu), không phải 不有.',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Câu hỏi phủ định-khẳng định',
        structure: '主语 + 动词 + 不 + 动词？',
        explanation: 'Lặp lại động từ với dạng phủ định để tạo câu hỏi Yes/No. Đây là cách hỏi phổ biến hơn so với dùng 吗.',
        examples: [
            {
                chinese: '你去不去？',
                pinyin: 'Nǐ qù bu qù?',
                vietnamese: 'Bạn có đi không?'
            },
            {
                chinese: '你是不是学生？',
                pinyin: 'Nǐ shì bu shì xué sheng?',
                vietnamese: 'Bạn có là học sinh không?'
            },
            {
                chinese: '他喜欢不喜欢？',
                pinyin: 'Tā xǐ huan bu xǐ huan?',
                vietnamese: 'Anh ấy có thích không?'
            }
        ],
        note: 'Cách hỏi này thường ngắn gọn hơn và tự nhiên hơn câu hỏi 吗 trong giao tiếp.',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Từ để hỏi 什么',
        structure: '主语 + 动词 + 什么？',
        explanation: '什么 (shén me) có nghĩa là "gì/cái gì" và được đặt ở vị trí tương ứng với phần cần hỏi trong câu.',
        examples: [
            {
                chinese: '你吃什么？',
                pinyin: 'Nǐ chī shén me?',
                vietnamese: 'Bạn ăn gì?'
            },
            {
                chinese: '这是什么？',
                pinyin: 'Zhè shì shén me?',
                vietnamese: 'Đây là cái gì?'
            },
            {
                chinese: '你叫什么名字？',
                pinyin: 'Nǐ jiào shén me míng zi?',
                vietnamese: 'Bạn tên là gì?'
            }
        ],
        note: 'Khác với tiếng Việt, từ để hỏi trong tiếng Trung đứng ở vị trí của câu trả lời, không đảo vị trí.',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Sở hữu cách với 的',
        structure: '名词/代词 + 的 + 名词',
        explanation: 'Trợ từ 的 (de) dùng để chỉ sở hữu hoặc quan hệ thuộc về, tương đương "của" trong tiếng Việt.',
        examples: [
            {
                chinese: '我的书',
                pinyin: 'Wǒ de shū',
                vietnamese: 'Sách của tôi'
            },
            {
                chinese: '老师的书',
                pinyin: 'Lǎo shī de shū',
                vietnamese: 'Sách của giáo viên'
            },
            {
                chinese: '中国的文化',
                pinyin: 'Zhōng guó de wén huà',
                vietnamese: 'Văn hóa của Trung Quốc'
            }
        ],
        note: 'Với quan hệ thân thiết (我妈妈, 你家), 的 thường được lược bỏ.',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Trạng từ 也 (cũng)',
        structure: '主语 + 也 + 动词/形容词',
        explanation: '也 (yě) có nghĩa là "cũng" và luôn đứng trước động từ hoặc tính từ, không đứng cuối câu như tiếng Việt.',
        examples: [
            {
                chinese: '我也是学生',
                pinyin: 'Wǒ yě shì xué sheng',
                vietnamese: 'Tôi cũng là học sinh'
            },
            {
                chinese: '他也去',
                pinyin: 'Tā yě qù',
                vietnamese: 'Anh ấy cũng đi'
            },
            {
                chinese: '我也喜欢',
                pinyin: 'Wǒ yě xǐ huan',
                vietnamese: 'Tôi cũng thích'
            }
        ],
        note: '也 luôn đứng trước động từ, sau chủ ngữ. Không được đặt cuối câu.',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Động từ 有 chỉ sở hữu',
        structure: '主语 + 有 + 宾语',
        explanation: '有 (yǒu) là động từ chỉ sở hữu, có nghĩa "có". Phủ định của 有 là 没有 (méi yǒu), không phải 不有.',
        examples: [
            {
                chinese: '我有书',
                pinyin: 'Wǒ yǒu shū',
                vietnamese: 'Tôi có sách'
            },
            {
                chinese: '他没有钱',
                pinyin: 'Tā méi yǒu qián',
                vietnamese: 'Anh ấy không có tiền'
            },
            {
                chinese: '你有朋友吗？',
                pinyin: 'Nǐ yǒu péng you ma?',
                vietnamese: 'Bạn có bạn bè không?'
            }
        ],
        note: '有 cũng có thể biểu thị sự tồn tại (có/có mặt) trong một số ngữ cảnh.',
        level: 'HSK1',
        createdBy: TEACHER_ID
    },
    {
        title: 'Từ chỉ định 这 và 那',
        structure: '这/那 + (量词) + 名词',
        explanation: '这 (zhè) có nghĩa "này" chỉ vật gần, 那 (nà) có nghĩa "kia" chỉ vật xa. Thường đi kèm với lượng từ trước danh từ.',
        examples: [
            {
                chinese: '这是书',
                pinyin: 'Zhè shì shū',
                vietnamese: 'Đây là sách'
            },
            {
                chinese: '那个人很高',
                pinyin: 'Nà ge rén hěn gāo',
                vietnamese: 'Người kia rất cao'
            },
            {
                chinese: '这本书很好',
                pinyin: 'Zhè běn shū hěn hǎo',
                vietnamese: 'Quyển sách này rất hay'
            }
        ],
        note: 'Khi đứng một mình, 这/那 có thể nghĩa là "đây/đó". Khi đi với danh từ thường cần lượng từ ở giữa.',
        level: 'HSK1',
        createdBy: TEACHER_ID
    }
];

async function seedGrammar() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        await Grammar.deleteMany({ createdBy: TEACHER_ID });
        console.log('Đã xóa dữ liệu grammar cũ của giáo viên này');
        
        const grammars = await Grammar.insertMany(grammarData);
        console.log(`✅ Đã tạo ${grammars.length} ngữ pháp thành công!`);
        
        console.log('\nDanh sách ngữ pháp:');
        grammars.forEach((g, index) => {
            console.log(`  ${index + 1}. ${g.title} (${g.structure})`);
        });
        
        console.log(`\nID Giáo viên: ${TEACHER_ID}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi seed grammar:', error);
        process.exit(1);
    }
}

seedGrammar();
