import { Resend } from 'resend';

// Provide a dummy fallback key so the build doesn't crash if the env var is missing
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_to_pass_build');

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
