import { transporter } from "../config/mailConfig.js";

export const sendEmail = async (email, token) => {
  const mailOptions = {
    from: '"Blogora" <noreplyBlogora@gmail.com>',
    to: email,
    subject: "Your Verification Token",
    text: `Here is your token: ${token}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email send failed:", error);
  }
};
