require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course.model');
const Lesson = require('../models/Lesson.model');
const User = require('../models/User.model');
const Enrollment = require('../models/Enrollment.model');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedCoursesAndLessons = async () => {
    try {
        await connectDB();

        // Find or create teacher
        let teacher = await User.findOne({ role: 'teacher' });
        if (!teacher) {
            teacher = await User.create({
                fullName: 'Giáo viên Tiếng Trung',
                email: 'teacher@hsk.com',
                password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456', // hashed password
                role: 'teacher',
                status: 'active'
            });
            console.log('✅ Teacher created');
        }

        // Find or create student for enrollment
        let student = await User.findOne({ role: 'student' });
        if (!student) {
            student = await User.create({
                fullName: 'Học viên Test',
                email: 'student@hsk.com',
                password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
                role: 'student',
                status: 'active'
            });
            console.log('✅ Student created');
        }

        // Clear existing data
        await Course.deleteMany({});
        await Lesson.deleteMany({});
        await Enrollment.deleteMany({});
        console.log('🗑️  Cleared existing courses, lessons, and enrollments');

        // Create HSK 1 Course
        const hsk1Course = await Course.create({
            title: 'HSK 1 - Cơ bản',
            description: 'Khóa học HSK cấp độ 1 dành cho người mới bắt đầu. Học 150 từ vựng cơ bản và ngữ pháp căn bản.',
            targetLevel: 'HSK1',
            thumbnail: 'https://example.com/hsk1.jpg',
            price: 500000,
            assignedTeacher: teacher._id,
            status: 'active',
            stats: { lessonCount: 0, enrollmentCount: 0 }
        });

        // Create HSK 2 Course
        const hsk2Course = await Course.create({
            title: 'HSK 2 - Sơ cấp',
            description: 'Khóa học HSK cấp độ 2. Học 300 từ vựng và ngữ pháp sơ cấp.',
            targetLevel: 'HSK2',
            thumbnail: 'https://example.com/hsk2.jpg',
            price: 800000,
            assignedTeacher: teacher._id,
            status: 'active',
            stats: { lessonCount: 0, enrollmentCount: 0 }
        });

        // Create HSK 3 Course
        const hsk3Course = await Course.create({
            title: 'HSK 3 - Trung cấp',
            description: 'Khóa học HSK cấp độ 3. Học 600 từ vựng và ngữ pháp trung cấp.',
            targetLevel: 'HSK3',
            thumbnail: 'https://example.com/hsk3.jpg',
            price: 1200000,
            assignedTeacher: teacher._id,
            status: 'active',
            stats: { lessonCount: 0, enrollmentCount: 0 }
        });

        console.log('✅ Created 3 courses: HSK1, HSK2, HSK3');

        // Enroll student in HSK1 and HSK2
        await Enrollment.create([
            { user: student._id, course: hsk1Course._id },
            { user: student._id, course: hsk2Course._id }
        ]);
        console.log('✅ Enrolled student in HSK1 and HSK2 courses');

        // Create lessons for HSK 1 Course
        const hsk1Lessons = [
            {
                course: hsk1Course._id,
                teacher: teacher._id,
                title: 'Bài 1: Chào hỏi',
                description: 'Học cách chào hỏi trong tiếng Trung',
                content: '<h2>Chào hỏi cơ bản</h2><p>Trong bài học này chúng ta sẽ học các cụm từ chào hỏi cơ bản như 你好 (Nǐ hǎo), 再见 (Zàijiàn)...</p>',
                order: 1,
                video_url: 'https://youtube.com/watch?v=example1',
                status: 'active',
                contents: {
                    vocabulary: [
                        {
                            chinese: '你好',
                            pinyin: 'nǐ hǎo',
                            vietnamese: 'Xin chào',
                            level: 'HSK1',
                            wordType: 'other',
                            example: {
                                chinese: '你好！很高兴见到你。',
                                pinyin: 'Nǐ hǎo! Hěn gāoxìng jiàn dào nǐ.',
                                vietnamese: 'Xin chào! Rất vui được gặp bạn.'
                            }
                        },
                        {
                            chinese: '再见',
                            pinyin: 'zàijiàn',
                            vietnamese: 'Tạm biệt',
                            level: 'HSK1',
                            wordType: 'other',
                            example: {
                                chinese: '再见！明天见。',
                                pinyin: 'Zàijiàn! Míngtiān jiàn.',
                                vietnamese: 'Tạm biệt! Ngày mai gặp lại.'
                            }
                        }
                    ],
                    grammar: [
                        {
                            title: 'Câu chào hỏi cơ bản',
                            structure: '你好 + ！',
                            explanation: 'Cách chào hỏi đơn giản nhất trong tiếng Trung',
                            level: 'HSK1',
                            examples: [
                                {
                                    chinese: '你好！',
                                    pinyin: 'Nǐ hǎo!',
                                    vietnamese: 'Xin chào!'
                                },
                                {
                                    chinese: '你好吗？',
                                    pinyin: 'Nǐ hǎo ma?',
                                    vietnamese: 'Bạn có khỏe không?'
                                }
                            ]
                        }
                    ]
                }
            },
            {
                course: hsk1Course._id,
                teacher: teacher._id,
                title: 'Bài 2: Giới thiệu bản thân',
                description: 'Học cách giới thiệu tên và quốc tịch',
                content: '<h2>Giới thiệu bản thân</h2><p>Trong bài này ta học cách nói tên, quốc tịch và nghề nghiệp.</p>',
                order: 2,
                video_url: 'https://youtube.com/watch?v=example2',
                status: 'active',
                contents: {
                    vocabulary: [
                        {
                            chinese: '我',
                            pinyin: 'wǒ',
                            vietnamese: 'Tôi',
                            level: 'HSK1',
                            wordType: 'pronoun',
                            example: {
                                chinese: '我是学生。',
                                pinyin: 'Wǒ shì xuésheng.',
                                vietnamese: 'Tôi là học sinh.'
                            }
                        },
                        {
                            chinese: '叫',
                            pinyin: 'jiào',
                            vietnamese: 'Tên là, gọi là',
                            level: 'HSK1',
                            wordType: 'verb',
                            example: {
                                chinese: '我叫小明。',
                                pinyin: 'Wǒ jiào Xiǎo Míng.',
                                vietnamese: 'Tôi tên là Tiểu Minh.'
                            }
                        },
                        {
                            chinese: '学生',
                            pinyin: 'xuésheng',
                            vietnamese: 'Học sinh',
                            level: 'HSK1',
                            wordType: 'noun'
                        }
                    ],
                    grammar: [
                        {
                            title: 'Câu "是" (shì) - động từ "là"',
                            structure: '主语 + 是 + 名词',
                            explanation: 'Dùng để giới thiệu danh tính, nghề nghiệp',
                            level: 'HSK1',
                            examples: [
                                {
                                    chinese: '我是老师。',
                                    pinyin: 'Wǒ shì lǎoshī.',
                                    vietnamese: 'Tôi là giáo viên.'
                                },
                                {
                                    chinese: '他是中国人。',
                                    pinyin: 'Tā shì Zhōngguó rén.',
                                    vietnamese: 'Anh ấy là người Trung Quốc.'
                                }
                            ]
                        }
                    ]
                }
            },
            {
                course: hsk1Course._id,
                teacher: teacher._id,
                title: 'Bài 3: Số đếm',
                description: 'Học đếm số từ 1 đến 10',
                content: '<h2>Số đếm</h2><p>Học cách đếm số trong tiếng Trung từ 1 đến 10.</p>',
                order: 3,
                video_url: '',
                status: 'active',
                contents: {
                    vocabulary: [
                        { chinese: '一', pinyin: 'yī', vietnamese: 'Một', level: 'HSK1', wordType: 'number' },
                        { chinese: '二', pinyin: 'èr', vietnamese: 'Hai', level: 'HSK1', wordType: 'number' },
                        { chinese: '三', pinyin: 'sān', vietnamese: 'Ba', level: 'HSK1', wordType: 'number' },
                        { chinese: '四', pinyin: 'sì', vietnamese: 'Bốn', level: 'HSK1', wordType: 'number' },
                        { chinese: '五', pinyin: 'wǔ', vietnamese: 'Năm', level: 'HSK1', wordType: 'number' }
                    ],
                    grammar: []
                }
            }
        ];

        await Lesson.insertMany(hsk1Lessons);
        await Course.findByIdAndUpdate(hsk1Course._id, { 'stats.lessonCount': hsk1Lessons.length });
        console.log(`✅ Created ${hsk1Lessons.length} lessons for HSK1 course`);

        // Create lessons for HSK 2 Course
        const hsk2Lessons = [
            {
                course: hsk2Course._id,
                teacher: teacher._id,
                title: 'Bài 1: Gia đình',
                description: 'Học từ vựng về các thành viên trong gia đình',
                content: '<h2>Gia đình</h2><p>Học cách gọi các thành viên trong gia đình bằng tiếng Trung.</p>',
                order: 1,
                video_url: 'https://youtube.com/watch?v=hsk2-1',
                status: 'active',
                contents: {
                    vocabulary: [
                        {
                            chinese: '爸爸',
                            pinyin: 'bàba',
                            vietnamese: 'Bố',
                            level: 'HSK2',
                            wordType: 'noun',
                            example: {
                                chinese: '我爸爸是医生。',
                                pinyin: 'Wǒ bàba shì yīshēng.',
                                vietnamese: 'Bố tôi là bác sĩ.'
                            }
                        },
                        {
                            chinese: '妈妈',
                            pinyin: 'māma',
                            vietnamese: 'Mẹ',
                            level: 'HSK2',
                            wordType: 'noun',
                            example: {
                                chinese: '妈妈在家。',
                                pinyin: 'Māma zài jiā.',
                                vietnamese: 'Mẹ ở nhà.'
                            }
                        }
                    ],
                    grammar: [
                        {
                            title: 'Câu "有" (yǒu) - có',
                            structure: '主语 + 有 + 宾语',
                            explanation: 'Dùng để nói về sở hữu hoặc tồn tại',
                            level: 'HSK2',
                            examples: [
                                {
                                    chinese: '我有一个弟弟。',
                                    pinyin: 'Wǒ yǒu yī gè dìdi.',
                                    vietnamese: 'Tôi có một em trai.'
                                }
                            ]
                        }
                    ]
                }
            },
            {
                course: hsk2Course._id,
                teacher: teacher._id,
                title: 'Bài 2: Thời gian',
                description: 'Học cách nói giờ và ngày tháng',
                content: '<h2>Thời gian</h2><p>Học cách hỏi và trả lời về thời gian trong tiếng Trung.</p>',
                order: 2,
                status: 'active',
                contents: {
                    vocabulary: [
                        { chinese: '今天', pinyin: 'jīntiān', vietnamese: 'Hôm nay', level: 'HSK2', wordType: 'noun' },
                        { chinese: '明天', pinyin: 'míngtiān', vietnamese: 'Ngày mai', level: 'HSK2', wordType: 'noun' },
                        { chinese: '昨天', pinyin: 'zuótiān', vietnamese: 'Hôm qua', level: 'HSK2', wordType: 'noun' }
                    ],
                    grammar: []
                }
            }
        ];

        await Lesson.insertMany(hsk2Lessons);
        await Course.findByIdAndUpdate(hsk2Course._id, { 'stats.lessonCount': hsk2Lessons.length });
        console.log(`✅ Created ${hsk2Lessons.length} lessons for HSK2 course`);

        // Create lessons for HSK 3 Course
        const hsk3Lessons = [
            {
                course: hsk3Course._id,
                teacher: teacher._id,
                title: 'Bài 1: Sở thích',
                description: 'Học cách nói về sở thích và hoạt động yêu thích',
                content: '<h2>Sở thích</h2><p>Học cách diễn đạt sở thích cá nhân.</p>',
                order: 1,
                video_url: 'https://youtube.com/watch?v=hsk3-1',
                status: 'active',
                contents: {
                    vocabulary: [
                        {
                            chinese: '喜欢',
                            pinyin: 'xǐhuan',
                            vietnamese: 'Thích',
                            level: 'HSK3',
                            wordType: 'verb',
                            example: {
                                chinese: '我喜欢看书。',
                                pinyin: 'Wǒ xǐhuan kàn shū.',
                                vietnamese: 'Tôi thích đọc sách.'
                            }
                        },
                        {
                            chinese: '爱好',
                            pinyin: 'àihào',
                            vietnamese: 'Sở thích',
                            level: 'HSK3',
                            wordType: 'noun'
                        }
                    ],
                    grammar: [
                        {
                            title: 'Câu "比" (bǐ) - so sánh',
                            structure: 'A + 比 + B + 形容词',
                            explanation: 'Dùng để so sánh hai đối tượng',
                            level: 'HSK3',
                            examples: [
                                {
                                    chinese: '北京比上海冷。',
                                    pinyin: 'Běijīng bǐ Shànghǎi lěng.',
                                    vietnamese: 'Bắc Kinh lạnh hơn Thượng Hải.'
                                }
                            ]
                        }
                    ]
                }
            }
        ];

        await Lesson.insertMany(hsk3Lessons);
        await Course.findByIdAndUpdate(hsk3Course._id, { 'stats.lessonCount': hsk3Lessons.length });
        console.log(`✅ Created ${hsk3Lessons.length} lessons for HSK3 course`);

        // Update enrollment counts
        await Course.findByIdAndUpdate(hsk1Course._id, { 'stats.enrollmentCount': 1 });
        await Course.findByIdAndUpdate(hsk2Course._id, { 'stats.enrollmentCount': 1 });

        console.log('\n📊 Summary:');
        console.log(`   - Courses: 3 (HSK1, HSK2, HSK3)`);
        console.log(`   - Lessons: ${hsk1Lessons.length + hsk2Lessons.length + hsk3Lessons.length} total`);
        console.log(`   - Teacher: ${teacher.email}`);
        console.log(`   - Student: ${student.email} (enrolled in HSK1, HSK2)`);
        console.log('\n✅ Seed completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedCoursesAndLessons();
