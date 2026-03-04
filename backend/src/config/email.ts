import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Use Ethereal for development if no SMTP is provided
// or use environment variables if available
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER || "test@example.com",
        pass: process.env.SMTP_PASS || "password",
    },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        if (!process.env.SMTP_HOST) {
            console.log("------------------------------------------");
            console.log("📧 MOCK EMAIL SENDING (No SMTP Configured)");
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${text}`);
            console.log("------------------------------------------");
            return { success: true, mock: true };
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Renture Admin" <admin@renture.com>',
            to,
            subject,
            text,
            html: html || text,
        });

        console.log("✅ Email sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};
