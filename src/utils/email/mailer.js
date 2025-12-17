const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASS,
  },
});

const baseEmailWrapper = (title, bodyHtml) => {
  const appName = process.env.APP_NAME || "Panda Edu";
  const year = new Date().getFullYear();

  return `
  <div style="background:#ecfdf5;padding:28px 14px;font-family:Inter,Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;">

      <!-- top chip -->
      <div style="text-align:center;margin-bottom:12px;">
        <span style="
          display:inline-block;
          padding:8px 12px;
          border-radius:999px;
          background:rgba(255,255,255,.75);
          border:1px solid #a7f3d0;
          color:#065f46;
          font-size:11px;
          font-weight:900;
          letter-spacing:.18em;
          text-transform:uppercase;
          box-shadow:0 8px 22px rgba(15,23,42,.06);
        ">
          ${appName} <span style="opacity:.55;">•</span> HSK
        </span>
      </div>

      <div style="
        background:#ffffff;
        border-radius:22px;
        overflow:hidden;
        border:1px solid #d1fae5;
        box-shadow:0 18px 55px rgba(15,23,42,.10);
        position:relative;
      ">
        <!-- subtle bamboo stripes -->
        <div style="
          position:absolute;inset:0;
          opacity:.10;
          background-image:linear-gradient(90deg, rgba(16,185,129,0.28) 0, rgba(16,185,129,0.28) 2px, transparent 2px, transparent 56px);
          background-size:56px 56px;
          pointer-events:none;
        "></div>

        <!-- panda corner blob -->
        <div style="
          position:absolute;right:-46px;top:-46px;
          width:170px;height:170px;border-radius:999px;
          background:rgba(167,243,208,.65);
          pointer-events:none;
        "></div>

        <!-- panda emoji -->
        <div style="position:absolute;right:16px;top:10px;font-size:46px;opacity:.92;pointer-events:none;">🐼</div>

        <!-- bamboo emoji -->
        <div style="position:absolute;left:14px;bottom:6px;font-size:52px;opacity:.88;pointer-events:none;">🎋</div>

        <!-- header -->
        <div style="
          padding:22px 24px;
          background:linear-gradient(135deg,#059669 0%, #10b981 42%, #34d399 100%);
          color:#fff;
          position:relative;
        ">
          <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;opacity:.95;font-weight:900;">
            Thiết lập tài khoản
          </div>
          <div style="font-size:22px;font-weight:900;margin-top:6px;line-height:1.2;">
            ${title}
          </div>
          <div style="margin-top:10px;font-size:12px;opacity:.95;line-height:1.6;">
            Nhẹ nhàng thôi, xong là vào học HSK liền 🌿
          </div>
        </div>

        <!-- body -->
        <div style="padding:22px 24px;color:#0f172a;position:relative;">
          ${bodyHtml}

          <div style="margin-top:18px;padding-top:14px;border-top:1px solid #d1fae5;color:#64748b;font-size:12px;line-height:1.7;">
            Trân trọng,<br/>
            Đội ngũ <b style="color:#065f46;">${appName}</b>
          </div>
        </div>
      </div>

      <div style="text-align:center;color:#94a3b8;font-size:12px;margin-top:14px;line-height:1.6;">
        © ${year} ${appName}. Nếu bạn không yêu cầu email này, có thể bỏ qua.
      </div>
    </div>
  </div>`;
};

const button = (href, label) => `
  <div style="text-align:center;margin:18px 0 10px;">
    <a href="${href}" style="
      display:inline-block;
      background:#059669;
      color:#fff;
      text-decoration:none;
      padding:12px 18px;
      border-radius:14px;
      font-weight:900;
      font-size:14px;
      box-shadow:0 12px 26px rgba(16,185,129,.22);
    ">
      ${label}
    </a>
  </div>
`;

const infoCard = (label, value) => `
  <div style="
    margin-top:12px;
    border:1px solid #e2e8f0;
    background:#ffffff;
    border-radius:16px;
    padding:12px 14px;
    box-shadow:0 8px 18px rgba(15,23,42,.04);
  ">
    <div style="font-size:12px;color:#64748b;">${label}</div>
    <div style="font-size:14px;font-weight:900;color:#0f172a;word-break:break-word;">${value}</div>
  </div>
`;

const noteBox = (html) => `
  <div style="
    margin-top:14px;
    padding:12px 14px;
    background:#ecfdf5;
    border:1px solid #a7f3d0;
    border-radius:16px;
    color:#065f46;
    font-size:13px;
    line-height:1.65;
  ">
    ${html}
  </div>
`;

/**
 * Admin tạo tài khoản -> gửi link set mật khẩu lần đầu
 * ✅ Không có role + password
 */
exports.sendAccountCreatedEmail = async ({ to, name, link }) => {
  const appName = process.env.APP_NAME || "Panda Bamboo";

  const body = `
    <p style="margin:0 0 10px;font-size:15px;line-height:1.85;color:#0f172a;">
      Chào <b>${name || "bạn"}</b>,<br/>
      Tài khoản của bạn đã được tạo. Để bắt đầu, vui lòng <b>thiết lập mật khẩu</b> bằng nút bên dưới.
    </p>

    ${infoCard("Email", to)}

    ${noteBox(
      `🔒 Link này chỉ dùng <b>1 lần</b> và sẽ hết hạn sau <b>60 phút</b>.`
    )}

    ${button(link, "Thiết lập mật khẩu lần đầu")}

    <p style="margin:12px 0 0;font-size:12px;color:#64748b;line-height:1.7;">
      Nếu nút không bấm được, bạn có thể copy và mở link này:
    </p>

    ${infoCard("Link thiết lập mật khẩu", link)}

    <div style="margin-top:14px;text-align:center;font-size:11px;color:#94a3b8;">
      <span style="font-weight:900;color:#059669;">加油</span> • Học đều mỗi ngày, HSK lên nhanh
    </div>
  `;

  return transporter.sendMail({
    from: `"${appName}" <${process.env.MAIL_USER}>`,
    to,
    subject: `[${appName}] Thiết lập mật khẩu để kích hoạt tài khoản`,
    html: baseEmailWrapper("Thiết lập mật khẩu", body),
  });
};

/**
 * Verify đăng ký (nếu bạn còn dùng)
 */
exports.sendVerifyEmail = async ({ to, name, link }) => {
  const appName = process.env.APP_NAME || "Panda Bamboo";

  const body = `
    <p style="margin:0 0 10px;font-size:15px;line-height:1.85;color:#0f172a;">
      Chào <b>${name || "bạn"}</b>,<br/>
      Vui lòng xác nhận email để hoàn tất đăng ký tài khoản.
    </p>

    ${noteBox(`Nếu bạn không thực hiện đăng ký, bạn có thể bỏ qua email này.`)}

    ${button(link, "Xác nhận email")}

    <p style="margin:12px 0 0;font-size:12px;color:#64748b;line-height:1.7;">
      Nếu nút không bấm được, bạn có thể copy và mở link này:
    </p>

    ${infoCard("Link xác nhận email", link)}

    <div style="margin-top:14px;text-align:center;font-size:11px;color:#94a3b8;">
      <span style="font-weight:900;color:#059669;">加油</span> • Học đều mỗi ngày, HSK lên nhanh
    </div>
  `;

  return transporter.sendMail({
    from: `"${appName}" <${process.env.MAIL_USER}>`,
    to,
    subject: `[${appName}] Xác nhận email`,
    html: baseEmailWrapper("Xác nhận email", body),
  });
};
