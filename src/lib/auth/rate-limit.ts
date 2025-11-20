type Bucket = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, Bucket>();

export const assertWithinRateLimit = (
  key: string,
  maxAttempts: number,
  windowMs: number
) => {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.expiresAt <= now) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return;
  }

  if (bucket.count >= maxAttempts) {
    throw new Error("Too many attempts. Please try again later.");
  }

  bucket.count += 1;
};
