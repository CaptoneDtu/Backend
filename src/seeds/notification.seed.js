/**
 * Seed file để tạo dữ liệu thông báo mẫu
 * Chạy: node src/seeds/notification.seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('../models/Notification.model');
const User = require('../models/User.model');
const Course = require('../models/Course.model');

const seedNotifications = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📌 Connected to MongoDB');

    // Tìm admin user (hoặc tạo mới nếu cần)
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('⚠️  No admin found. Please create an admin user first.');
      process.exit(1);
    }

    // Lấy một course mẫu (nếu có)
    const sampleCourse = await Course.findOne();
    
    // Lấy một student mẫu (nếu có)
    const sampleStudent = await User.findOne({ role: 'student' });

    // Xóa thông báo cũ (optional - comment dòng này nếu không muốn xóa)
    await Notification.deleteMany({});
    console.log('🗑️  Cleared old notifications');

    // Tạo thông báo mẫu
    const notifications = [
      {
        title: 'Thông báo bảo trì hệ thống',
        message: 'Hệ thống sẽ được bảo trì từ 22h-24h ngày 20/12/2025. Trong thời gian này, các bạn sẽ không thể truy cập hệ thống. Xin lỗi vì sự bất tiện này!',
        type: 'system',
        createdBy: admin._id,
        scope: 'all',
        priority: 'urgent',
        status: 'published',
        stats: {
          totalRecipients: await User.countDocuments({ status: 'active' }),
          readCount: 0,
        },
      },
      {
        title: 'Họp giáo viên định kỳ',
        message: 'Cuộc họp giáo viên tháng 12 sẽ diễn ra vào 9h sáng thứ 2 tuần sau tại phòng họp A. Đề nghị tất cả giáo viên có mặt đúng giờ.',
        type: 'announcement',
        createdBy: admin._id,
        scope: 'teachers',
        priority: 'high',
        status: 'published',
        stats: {
          totalRecipients: await User.countDocuments({ role: 'teacher', status: 'active' }),
          readCount: 0,
        },
      },
      {
        title: 'Lịch nghỉ Tết Nguyên Đán 2026',
        message: 'Trường nghỉ Tết từ ngày 25/1 đến 3/2/2026. Lớp học sẽ tiếp tục vào ngày 4/2. Chúc các em năm mới vui vẻ, học tập tốt!',
        type: 'announcement',
        createdBy: admin._id,
        scope: 'students',
        priority: 'normal',
        status: 'published',
        stats: {
          totalRecipients: await User.countDocuments({ role: 'student', status: 'active' }),
          readCount: 0,
        },
      },
      {
        title: 'Mở đăng ký lớp HSK mới',
        message: 'Chúng tôi vừa mở đăng ký các lớp HSK mới cho học kỳ mùa xuân 2026. Các em hãy nhanh tay đăng ký để được ưu tiên chọn lịch học nhé!',
        type: 'announcement',
        createdBy: admin._id,
        scope: 'students',
        priority: 'normal',
        status: 'published',
        stats: {
          totalRecipients: await User.countDocuments({ role: 'student', status: 'active' }),
          readCount: 0,
        },
      },
    ];

    // Nếu có course mẫu, thêm thông báo cho course
    if (sampleCourse) {
      notifications.push({
        title: `Thông báo lịch thi - ${sampleCourse.title}`,
        message: `Lịch thi giữa kỳ môn ${sampleCourse.title} đã được cập nhật. Thời gian thi: 9h sáng thứ 7 ngày 15/12. Địa điểm: Phòng thi A2. Vui lòng đến đúng giờ!`,
        type: 'exam',
        createdBy: admin._id,
        scope: 'course',
        targetCourse: sampleCourse._id,
        priority: 'high',
        status: 'published',
        stats: {
          totalRecipients: 25, // Giả sử có 25 học viên
          readCount: 0,
        },
      });
    }

    // Nếu có student mẫu, thêm thông báo cá nhân
    if (sampleStudent) {
      notifications.push({
        title: 'Chúc mừng bạn đạt điểm cao!',
        message: `Chúc mừng bạn ${sampleStudent.name || 'bạn'} đã đạt điểm cao nhất trong kỳ thi vừa rồi với 95/100 điểm. Tiếp tục phát huy và học tập tốt nhé!`,
        type: 'personal',
        createdBy: admin._id,
        scope: 'individual',
        targetUser: sampleStudent._id,
        priority: 'normal',
        status: 'published',
        stats: {
          totalRecipients: 1,
          readCount: 0,
        },
      });
    }

    // Thêm một thông báo draft
    notifications.push({
      title: 'Nháp - Thông báo sắp tới',
      message: 'Đây là một thông báo nháp, chưa được publish',
      type: 'announcement',
      createdBy: admin._id,
      scope: 'all',
      priority: 'low',
      status: 'draft',
      stats: {
        totalRecipients: 0,
        readCount: 0,
      },
    });

    // Insert notifications
    const createdNotifications = await Notification.insertMany(notifications);
    
    console.log(`✅ Created ${createdNotifications.length} sample notifications:`);
    createdNotifications.forEach((notif) => {
      console.log(`   - ${notif.title} (${notif.scope}, ${notif.priority})`);
    });

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📝 Test the APIs with:');
    console.log('   - Admin token to create notifications');
    console.log('   - User token to view notifications');
    console.log('\n👉 See TEST_NOTIFICATION_API.md for API examples');

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📌 Disconnected from MongoDB');
  }
};

// Run seed
seedNotifications();
