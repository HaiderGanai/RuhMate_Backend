import * as crypto from "crypto";

export function decrypt(text: string): string {
  const ENC_SECRET = Buffer.from(process.env.ENC_SECRET!, "hex");

  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", ENC_SECRET, iv);
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
