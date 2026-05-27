import { hmacSha256, numericCodeFromHex } from "./crypto";

export function getCaptchaBucket(intervalSeconds: number, date = new Date()) {
  return Math.floor(date.getTime() / 1000 / intervalSeconds);
}

export function generateCaptchaCode(options: {
  blogId: string;
  secret: string;
  intervalSeconds: number;
  length?: number;
  bucket?: number;
}) {
  const length = options.length ?? 6;
  const bucket = options.bucket ?? getCaptchaBucket(options.intervalSeconds);
  const digest = hmacSha256(options.secret, `${options.blogId}:${bucket}`);
  return numericCodeFromHex(digest, length);
}

export function verifyCaptchaCode(options: {
  blogId: string;
  secret: string;
  intervalSeconds: number;
  code: string;
}) {
  const normalized = options.code.trim();
  const bucket = getCaptchaBucket(options.intervalSeconds);
  return [bucket, bucket - 1].some(
    (candidate) =>
      generateCaptchaCode({
        blogId: options.blogId,
        secret: options.secret,
        intervalSeconds: options.intervalSeconds,
        bucket: candidate,
      }) === normalized,
  );
}

export function getCaptchaRefreshInSeconds(intervalSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  return intervalSeconds - (now % intervalSeconds);
}
