import rateLimit from "express-rate-limit";

export const standardLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", code: "RATE_LIMITED", message: "Too many requests" },
});

export function createLimiter(windowMinutes, maxRequests) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.profileId || req.ip,
    message: { status: "error", code: "RATE_LIMITED", message: "Too many requests" },
  });
}

export const requestLimiter = createLimiter(60, 5);
export const locationLimiter = createLimiter(1, 120);
export const nearbyLimiter = createLimiter(1, 30);
export const responseLimiter = createLimiter(1, 10);