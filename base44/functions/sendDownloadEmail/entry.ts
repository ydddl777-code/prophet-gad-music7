import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, track_id, track_title, track_artist, file_url } = await req.json();

    if (!email || !file_url) {
      return Response.json({ error: 'Missing email or file_url' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: `Your download: "${track_title}" — Prophet Gad Music`,
      body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #D4AF37; font-size: 24px; margin: 0;">Prophet Gad Music</h1>
    <p style="color: #888; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin: 6px 0 0;">Threadbare Music · Remnant Seed LLC</p>
  </div>

  <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
    <p style="color: #aaa; font-size: 14px; margin: 0 0 8px;">Your purchase:</p>
    <h2 style="color: #fff; font-size: 20px; margin: 0 0 4px;">${track_title}</h2>
    <p style="color: #D4AF37; font-size: 14px; margin: 0;">${track_artist || 'Prophet Gad'}</p>
  </div>

  <div style="text-align: center; margin-bottom: 24px;">
    <a href="${file_url}" 
       style="display: inline-block; background: linear-gradient(to right, #D4AF37, #b22222); color: #fff; font-weight: bold; font-size: 16px; padding: 14px 32px; border-radius: 50px; text-decoration: none;">
      ⬇ Download Your Track
    </a>
  </div>

  <p style="color: #555; font-size: 12px; text-align: center;">
    If the button doesn't work, copy this link:<br/>
    <span style="color: #888; word-break: break-all;">${file_url}</span>
  </p>

  <p style="color: #333; font-size: 11px; text-align: center; margin-top: 30px; border-top: 1px solid #1a1a1a; padding-top: 16px;">
    Thank you for supporting the ministry. Shalom.
  </p>
</div>
      `.trim()
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});