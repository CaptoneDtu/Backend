require('dotenv').config();
const mongoose = require('mongoose');
const Exam = require('../models/Exam.model');
const User = require('../models/User.model');
const Course = require('../models/Course.model');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedHSKExams = async () => {
    try {
        await connectDB();

        // Find a teacher
        const teacher = await User.findOne({ role: 'teacher' });
        if (!teacher) {
            console.log('❌ No teacher found. Please create a teacher first.');
            process.exit(1);
        }

        // Find or create a course
        let course = await Course.findOne({ assignedTeacher: teacher._id });
        if (!course) {
            course = await Course.create({
                title: 'HSK Preparation Course',
                description: 'Complete HSK exam preparation from level 1 to 6',
                targetLevel: 'HSK3',
                assignedTeacher: teacher._id,
                status: 'active'
            });
            console.log('✅ Course created');
        }

        // Clear existing exams
        await Exam.deleteMany({});
        console.log('🗑️  Cleared existing exams');

        // Create HSK 1 Exam
        const hsk1 = await Exam.create({
            title: 'HSK 1 - Mock Test 1',
            description: 'HSK 1 practice test with listening and reading sections',
            level: 'HSK1',
            skills: ['listening', 'reading'],
            timeLimitMinutes: 35,
            passingScore: 60,
            course: course._id,
            createdBy: teacher._id,
            status: 'published',
            sections: [
                {
                    skill: 'listening',
                    title: '第一部分 - Part 1',
                    instructions: '听对话，选择正确答案 (Listen to the dialogues and choose the correct answers)',
                    audioUrl: '/uploads/audio/hsk1-listening-part1.mp3',
                    questions: [
                        {
                            content: '问：他在哪儿？',
                            options: ['A. 在家', 'B. 在学校', 'C. 在公司', 'D. 在医院'],
                            correctAnswer: 'B',
                            audioUrl: '/uploads/audio/hsk1-q1.mp3',
                            points: 1
                        },
                        {
                            content: '问：她叫什么名字？',
                            options: ['A. 李明', 'B. 王芳', 'C. 张丽', 'D. 刘强'],
                            correctAnswer: 'C',
                            audioUrl: '/uploads/audio/hsk1-q2.mp3',
                            points: 1
                        },
                        {
                            content: '问：今天星期几？',
                            options: ['A. 星期一', 'B. 星期二', 'C. 星期三', 'D. 星期四'],
                            correctAnswer: 'A',
                            audioUrl: '/uploads/audio/hsk1-q3.mp3',
                            points: 1
                        },
                        {
                            content: '问：他想吃什么？',
                            options: ['A. 米饭', 'B. 面条', 'C. 饺子', 'D. 包子'],
                            correctAnswer: 'C',
                            audioUrl: '/uploads/audio/hsk1-q4.mp3',
                            points: 1
                        },
                        {
                            content: '问：他们去哪儿？',
                            options: ['A. 商店', 'B. 饭店', 'C. 医院', 'D. 学校'],
                            correctAnswer: 'B',
                            audioUrl: '/uploads/audio/hsk1-q5.mp3',
                            points: 1
                        }
                    ]
                },
                {
                    skill: 'reading',
                    title: '第二部分 - Part 2',
                    instructions: '看图片，选择正确的句子 (Look at pictures and choose correct sentences)',
                    questions: [
                        {
                            content: '看图选择：这是___。',
                            options: ['A. 苹果', 'B. 香蕉', 'C. 橙子', 'D. 梨'],
                            correctAnswer: 'A',
                            imageUrl: '/uploads/images/apple.jpg',
                            points: 1
                        },
                        {
                            content: '看图选择：她在___。',
                            options: ['A. 看书', 'B. 写字', 'C. 吃饭', 'D. 喝水'],
                            correctAnswer: 'A',
                            imageUrl: '/uploads/images/reading.jpg',
                            points: 1
                        },
                        {
                            content: '看图选择：这是___点。',
                            options: ['A. 三', 'B. 六', 'C. 九', 'D. 十二'],
                            correctAnswer: 'B',
                            imageUrl: '/uploads/images/clock-6.jpg',
                            points: 1
                        },
                        {
                            content: '我叫李明，今年20岁。我是学生，在北京大学学习汉语。\n问：李明在哪儿学习？',
                            options: ['A. 上海', 'B. 广州', 'C. 北京', 'D. 深圳'],
                            correctAnswer: 'C',
                            points: 1
                        },
                        {
                            content: '今天是星期一，天气很好。我和朋友去公园。\n问：今天天气怎么样？',
                            options: ['A. 很好', 'B. 很冷', 'C. 下雨', 'D. 下雪'],
                            correctAnswer: 'A',
                            points: 1
                        }
                    ]
                }
            ]
        });

        // Create HSK 3 Exam (with Writing)
        const hsk3 = await Exam.create({
            title: 'HSK 3 - Mock Test 1',
            description: 'HSK 3 complete test with listening, reading, and writing sections',
            level: 'HSK3',
            skills: ['listening', 'reading', 'writing'],
            timeLimitMinutes: 90,
            passingScore: 60,
            course: course._id,
            createdBy: teacher._id,
            status: 'published',
            sections: [
                {
                    skill: 'listening',
                    title: '第一部分 - Listening Part 1',
                    instructions: '听对话，根据对话选出正确答案',
                    audioUrl: '/uploads/audio/hsk3-listening.mp3',
                    questions: [
                        {
                            content: '问：男的为什么不高兴？',
                            options: [
                                'A. 考试没考好',
                                'B. 生病了',
                                'C. 朋友不理他',
                                'D. 工作太忙'
                            ],
                            correctAnswer: 'A',
                            audioUrl: '/uploads/audio/hsk3-l-q1.mp3',
                            points: 2
                        },
                        {
                            content: '问：女的想去哪儿？',
                            options: [
                                'A. 图书馆',
                                'B. 超市',
                                'C. 电影院',
                                'D. 咖啡店'
                            ],
                            correctAnswer: 'C',
                            audioUrl: '/uploads/audio/hsk3-l-q2.mp3',
                            points: 2
                        },
                        {
                            content: '问：他们打算什么时候出发？',
                            options: [
                                'A. 今天下午',
                                'B. 明天早上',
                                'C. 明天下午',
                                'D. 后天'
                            ],
                            correctAnswer: 'B',
                            audioUrl: '/uploads/audio/hsk3-l-q3.mp3',
                            points: 2
                        }
                    ]
                },
                {
                    skill: 'reading',
                    title: '第二部分 - Reading Part 1',
                    instructions: '阅读下面的文章，然后回答问题',
                    questions: [
                        {
                            content: '我叫王明，是一名大学生。我喜欢运动，每天早上都去跑步。我还喜欢看书，特别是历史方面的书。周末的时候，我常常和朋友一起去爬山。\n问：王明喜欢什么样的书？',
                            options: [
                                'A. 小说',
                                'B. 历史书',
                                'C. 科学书',
                                'D. 漫画书'
                            ],
                            correctAnswer: 'B',
                            points: 2
                        },
                        {
                            content: '昨天是我的生日，朋友们给我准备了一个惊喜派对。他们在我家等着我，当我打开门的时候，大家一起唱生日歌。我真的很感动，有这样的朋友我很幸福。\n问：朋友们在哪儿等他？',
                            options: [
                                'A. 在餐厅',
                                'B. 在学校',
                                'C. 在他家',
                                'D. 在公园'
                            ],
                            correctAnswer: 'C',
                            points: 2
                        },
                        {
                            content: '中国的春节是一年中最重要的节日。春节的时候，人们会回家和家人团聚，吃饺子，放烟花。孩子们最高兴，因为可以收到红包。\n问：春节的时候孩子们为什么高兴？',
                            options: [
                                'A. 不用上学',
                                'B. 可以收到红包',
                                'C. 可以吃很多东西',
                                'D. 可以看烟花'
                            ],
                            correctAnswer: 'B',
                            points: 2
                        }
                    ]
                },
                {
                    skill: 'writing',
                    title: '第三部分 - Writing',
                    instructions: '根据提供的词语写句子 (Write sentences using the given words)',
                    questions: [
                        {
                            content: '用下面的词语写一个句子：因为...所以...',
                            options: [],
                            correctAnswer: '', // Writing questions don't have fixed answers
                            points: 3
                        },
                        {
                            content: '用下面的词语写一个句子：虽然...但是...',
                            options: [],
                            correctAnswer: '',
                            points: 3
                        },
                        {
                            content: '看图写一段话（至少50字）：描述图中的场景',
                            options: [],
                            correctAnswer: '',
                            imageUrl: '/uploads/images/hsk3-writing.jpg',
                            points: 5
                        }
                    ]
                }
            ]
        });

        // Create HSK 5 Exam
        const hsk5 = await Exam.create({
            title: 'HSK 5 - Mock Test 1',
            description: 'HSK 5 advanced test',
            level: 'HSK5',
            skills: ['listening', 'reading', 'writing'],
            timeLimitMinutes: 125,
            passingScore: 60,
            course: course._id,
            createdBy: teacher._id,
            status: 'published',
            sections: [
                {
                    skill: 'listening',
                    title: '第一部分',
                    instructions: '听短文，然后回答问题',
                    audioUrl: '/uploads/audio/hsk5-listening.mp3',
                    questions: [
                        {
                            content: '问：说话人对这件事情的态度是什么？',
                            options: [
                                'A. 支持',
                                'B. 反对',
                                'C. 中立',
                                'D. 不确定'
                            ],
                            correctAnswer: 'A',
                            audioUrl: '/uploads/audio/hsk5-l-q1.mp3',
                            points: 3
                        },
                        {
                            content: '问：根据这段话，可以知道什么？',
                            options: [
                                'A. 经济发展很快',
                                'B. 环境污染严重',
                                'C. 教育质量提高',
                                'D. 科技进步明显'
                            ],
                            correctAnswer: 'D',
                            audioUrl: '/uploads/audio/hsk5-l-q2.mp3',
                            points: 3
                        }
                    ]
                },
                {
                    skill: 'reading',
                    title: '第二部分',
                    instructions: '阅读文章，回答问题',
                    questions: [
                        {
                            content: '随着互联网技术的发展，人们的生活方式发生了巨大的变化。网上购物、在线教育、远程办公等新的生活方式越来越普及。但是，这也带来了一些问题，比如个人隐私保护、网络安全等。\n问：这段话主要讲了什么？',
                            options: [
                                'A. 互联网技术的发展',
                                'B. 网上购物的优点',
                                'C. 互联网对生活的影响',
                                'D. 网络安全问题'
                            ],
                            correctAnswer: 'C',
                            points: 3
                        }
                    ]
                },
                {
                    skill: 'writing',
                    title: '第三部分',
                    instructions: '缩写文章',
                    questions: [
                        {
                            content: '阅读下面的文章，然后用80-100字缩写主要内容',
                            options: [],
                            correctAnswer: '',
                            points: 10
                        }
                    ]
                }
            ]
        });

        console.log('✅ HSK 1 Exam created:', hsk1.title);
        console.log('✅ HSK 3 Exam created:', hsk3.title);
        console.log('✅ HSK 5 Exam created:', hsk5.title);
        console.log('\n📊 Summary:');
        console.log(`- HSK 1: ${hsk1.sections.length} sections, ${hsk1.totalPoints} points`);
        console.log(`- HSK 3: ${hsk3.sections.length} sections, ${hsk3.totalPoints} points`);
        console.log(`- HSK 5: ${hsk5.sections.length} sections, ${hsk5.totalPoints} points`);
        console.log('\n✅ Seed completed successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedHSKExams();
