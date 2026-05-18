export async function sendTeamsNotification(title: string, message: string, urlText: string, urlLink: string) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  
  if (!webhookUrl || webhookUrl === 'your-teams-webhook-url') {
    console.log('\n[Teams Notification Simulated]');
    console.log(`Title: ${title}`);
    console.log(`Message: ${message}`);
    console.log(`Link: [${urlText}](${urlLink})\n`);
    return { success: true, simulated: true };
  }

  const payload = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "themeColor": "0076D7",
    "summary": title,
    "sections": [{
      "activityTitle": title,
      "activitySubtitle": "Vectora Goal Intelligence",
      "text": message,
      "markdown": true
    }],
    "potentialAction": [{
      "@type": "OpenUri",
      "name": urlText,
      "targets": [{ "os": "default", "uri": urlLink }]
    }]
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Teams API error: ${res.statusText}`);
    return { success: true };
  } catch (err) {
    console.error('Teams sending failed:', err);
    return { success: false, error: err };
  }
}
