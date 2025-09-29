import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    }

    async sendEmail(recipient: string, code: string): Promise<boolean> {
        const msg = {
            to: recipient,
            from: process.env.SENDGRID_SENDER!,
            subject: 'YOUR OTP CODE',
            text: `Your OTP Code is: ${code}`,
            html: `<h2>Your OTP Code<h2/><strong>${code}</strong>`,
        };

        try{
            const [response] = await sgMail.send(msg);
            console.log('Email sent status:', response.statusCode);
            return true;
        } catch (error) {
            console.log('SendGrid Error:', error)
            return false;
        }
    }
}