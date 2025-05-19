import SMTPTransport from "nodemailer/lib/smtp-transport";
import env from "../enviroment/env";
import { UserInterface } from "../models/user-model";
import nodemailer from "nodemailer";
import createEmailTransporter from "./createEmailTransporter";

type MailOptionsType = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const sendEmail = (
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
  mailOptions: MailOptionsType
) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const sendVerificationEmail = async (
  user: UserInterface,
  emailToken: string
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transporter = createEmailTransporter() as any;

    const emailAddress = env.emailAddress!;
    const url = env.remoteURL + `/verify-email/${emailToken}`;

    const textContent = `Welcome to ContexZero! Please verify your email address by navigating to the following link: ${url}`;
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ContexZero Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #2c3e50;
        }
        .content {
            line-height: 1.6;
        }
        .content p {
            margin: 10px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            margin: 20px 0;
            background-color: #3498db;
            color: #ffffff !important; /* Important to override default link styles */
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to ContexZero!</h1>
        </div>
        <div class="content">
            <p>Hello ${user.email},</p>
            <p>Thank you for registering with ContexZero. Please verify your email address to complete your registration and secure your account.</p>
            <p>Click the button below to verify your email:</p>
            <p style="text-align: center;">
                <a href="${url}" class="button">Verify Email Address</a>
            </p>
            <p>If the button above doesn't work, you can also copy and paste the following link into your browser's address bar:</p>
            <p><a href="${url}">${url}</a></p>
            <p>If you did not create an account with ContexZero, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ContexZero. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

    const mailOptions: MailOptionsType = {
      from: `"ContexZero Support" <${emailAddress}>`,
      to: user.email,
      subject: "ContexZero Email Verification - Action Required",
      text: textContent,
      html: htmlContent,
    };

    await sendEmail(transporter, mailOptions);

    return true;
  } catch (e) {
    console.log("Error sending email verification", e);
    return false;
  }
};

export default sendVerificationEmail;
