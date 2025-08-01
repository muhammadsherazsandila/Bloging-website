import { transporter } from "../config/mailConfig.js";

export const sendEmail = async (email, url) => {
  const mailOptions = {
    from: '"Blogora" <noreplyBlogora@gmail.com>',
    to: email,
    subject: "Your Reset Password Link",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color:black; color : white;">
    <h2>Reset Your Password</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password for your <strong>Blogora</strong> account.</p>
    <p>Click the button below to reset your password:</p>
    <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #1c398e; color: #fff; text-decoration: none; border-radius: 4px;">Reset Password</a>
    <p style="margin-top: 20px;">If you didn’t request a password reset, you can safely ignore this email.</p>
    <p>Thanks,<br>The Blogora Team</p>
    <a href="https://blogorablogs.vercel.app/" style="color: #1c398e; text-decoration: none;">Please visit our website</a>
  </div>
`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info);
  } catch (error) {
    console.log(error);
  }
};
