import * as crypto from 'crypto';

export function encrypt(text: string): string {
  const ENC_SECRET = Buffer.from(process.env.ENC_SECRET!, 'hex'); // 32-byte key
  if (ENC_SECRET.length !== 32) {
    throw new Error('ENC_SECRET must be a 32-byte hex string');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_SECRET, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}
