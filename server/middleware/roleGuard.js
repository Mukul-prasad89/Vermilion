import { ForbiddenError } from "../utils/errors.js";

export function requireDonor(req, _res, next) {
  if (!req.user.isDonor) return next(new ForbiddenError("Donor registration required"));
  next();
}

export function requireHospital(req, _res, next) {
  if (req.user.role !== "hospital") return next(new ForbiddenError("Hospital account required"));
  next();
}

export function requireAnyRole(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) return next(new ForbiddenError("Insufficient role"));
    next();
  };
}