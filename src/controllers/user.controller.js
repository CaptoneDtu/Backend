const User = require("../models/User.model");
const ApiRes = require("../res/apiRes");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, ConflictError } = require("../res/AppError");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { console } = require("inspector");



function generateSecurePassword(length = 12) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    const bytes = crypto.randomBytes(length);
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset[bytes[i] % charset.length];
    }
    return password;
}

exports.createUser = asyncHandler(async (req, res) => {
    const { name, email, role, date_of_birth, sex, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ConflictError("Email already in use");
    }

    const password = generateSecurePassword();
    const hashedPassword = await await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, role, password: hashedPassword, date_of_birth, sex, phone });
    await newUser.save();

    const userResponse = newUser.toObject();
    userResponse.password = password;
    return ApiRes.created(res, "User created successfully", userResponse);
});

exports.getUsers = asyncHandler(async (req, res) => {
    const { role, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password");

    const totalUsers = await User.countDocuments(filter);

    return ApiRes.success(res, "Users retrieved successfully", {
        users,
        page,
        limit,
        total: totalUsers
    });
});

exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        throw new NotFoundError("User not found");
    }

    return ApiRes.success(res, "User retrieved successfully", user);
});


exports.changePassword = asyncHandler(async (req, res) => {
    const userId  = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ConflictError("Current password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return ApiRes.success(res, "Password changed successfully");
});














exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    return ApiRes.success(res, "Users retrieved successfully", {
        users,
        total: users.length
    });
});





exports.updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    delete updates.password;

    const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    }).select("-password");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return ApiRes.updated(res, "User updated successfully", user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).select("-password");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return ApiRes.deleted(res, "User deleted successfully", {
        deletedUserId: id
    });
});

exports.filterUsers = asyncHandler(async (req, res) => {
    const { role, status } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter).select("-password");

    return ApiRes.success(res, "Users filtered successfully", {
        users,
        total: users.length,
        filters: { role, status }
    });
});
