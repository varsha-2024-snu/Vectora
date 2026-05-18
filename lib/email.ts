import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailNotification(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your-resend-api-key') {
    console.log('[Email Simulation] To:', to, 'Subject:', subject);
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Vectora Notifications <notifications@vectora.demo>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}
