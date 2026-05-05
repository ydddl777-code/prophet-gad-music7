import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { accessToken } = await base44.asServiceRole.connectors.getConnection("supabase");

  // Get projects
  const projectsRes = await fetch("https://api.supabase.com/v1/projects", {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });
  const projects = await projectsRes.json();
  const project = projects[0];
  const projectRef = project?.ref;

  // Get API keys
  const keysRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/api-keys`, {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });
  const keys = await keysRes.json();
  const serviceKey = keys.find(k => k.name === 'service_role')?.api_key;

  // List buckets
  const bucketsRes = await fetch(`https://${projectRef}.supabase.co/storage/v1/bucket`, {
    headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` }
  });
  const buckets = await bucketsRes.json();

  // List files in 'songs' bucket (first 100)
  const songsRes = await fetch(`https://${projectRef}.supabase.co/storage/v1/object/list/songs`, {
    method: "POST",
    headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 20, offset: 0, sortBy: { column: "name", order: "asc" } })
  });
  const songFiles = await songsRes.json();

  // List files in 'song-covers' bucket
  const coversRes = await fetch(`https://${projectRef}.supabase.co/storage/v1/object/list/song-covers`, {
    method: "POST",
    headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 20, offset: 0, sortBy: { column: "name", order: "asc" } })
  });
  const coverFiles = await coversRes.json();

  // List files in 'song-lyrics' bucket
  const lyricsRes = await fetch(`https://${projectRef}.supabase.co/storage/v1/object/list/song-lyrics`, {
    method: "POST",
    headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 20, offset: 0, sortBy: { column: "name", order: "asc" } })
  });
  const lyricsFiles = await lyricsRes.json();

  return Response.json({
    project: { ref: projectRef, name: project?.name },
    buckets: buckets.map(b => ({ id: b.id, name: b.name, public: b.public })),
    songFiles: songFiles?.slice(0, 10),
    coverFiles: coverFiles?.slice(0, 10),
    lyricsFiles: lyricsFiles?.slice(0, 10),
    publicUrlPattern: `https://${projectRef}.supabase.co/storage/v1/object/public/`
  });
});