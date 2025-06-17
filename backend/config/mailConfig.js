import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

// Looking to send emails in production? Check out our Email API/SMTP product!
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});
