import { transporter } from "../config/mailConfig.js";

export const sendEmail = async (email, url) => {
  const mailOptions = {
    from: '"Blogora" <noreplyBlogora@gmail.com>',
    to: email,
    subject: "Your Verification Token",
    text: `Here is your reset password link : ${url}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    console.log(error);
  }
};
