import nodemailer from "nodemailer";

// Create a transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const getMailMessage = (username, password, receiverEmail) => {
  return {
    from: process.env.EMAIL_USERNAME,
    to: receiverEmail,
    subject: "הסיסמה לשחקן שלך",
    text: `היי, ${username} הסיסמה לשחקן שלך היא: ${password}`,
    html: `<b>היי, ${username} הסיסמה לשחקן שלך היא: ${password}</b>`,
  };
};
