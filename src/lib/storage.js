import fs from 'fs';
import path from 'path';

// Lazy import for S3 client (only when needed)
let S3Client, PutObjectCommand;

const PROVIDER = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

// Local storage root
const localRoot = path.resolve('public', 'uploads');

function ensureLocalRoot() {
  if (!fs.existsSync(localRoot)) fs.mkdirSync(localRoot, { recursive: true });
}

export async function uploadFile({ buffer, filename, mimetype }) {
  if (PROVIDER === 'local') {
    ensureLocalRoot();
    const filePath = path.join(localRoot, filename);
    await fs.promises.writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  }

  // S3-compatible (DigitalOcean Spaces, AWS S3, etc.)
  const endpoint = process.env.SPACES_ENDPOINT; // e.g., https://nyc3.digitaloceanspaces.com
  const region = process.env.SPACES_REGION || 'us-east-1';
  const bucket = process.env.SPACES_BUCKET;
  const accessKeyId = process.env.SPACES_KEY;
  const secretAccessKey = process.env.SPACES_SECRET;
  const publicBase = process.env.PUBLIC_CDN_BASE; // optional CDN domain

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error('S3/Spaces configuration missing: SPACES_ENDPOINT, SPACES_BUCKET, SPACES_KEY, SPACES_SECRET');
    }

  if (!S3Client) {
    const aws = await import('@aws-sdk/client-s3');
    S3Client = aws.S3Client;
    PutObjectCommand = aws.PutObjectCommand;
  }

  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle: false,
    credentials: { accessKeyId, secretAccessKey }
  });

  const Key = filename;
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key,
    Body: buffer,
    ContentType: mimetype,
    ACL: 'public-read'
  }));

  // Build public URL
  if (publicBase) return `${publicBase.replace(/\/$/, '')}/${Key}`;
  // Default Spaces public URL format
  // Example: https://<bucket>.<region>.digitaloceanspaces.com/<key>
  try {
    const url = new URL(endpoint);
    const host = url.host; // e.g., nyc3.digitaloceanspaces.com
    return `https://${bucket}.${host}/${Key}`;
  } catch {
    return `${endpoint.replace(/\/$/, '')}/${bucket}/${Key}`;
  }
}

export function getProvider() {
  return PROVIDER;
}
