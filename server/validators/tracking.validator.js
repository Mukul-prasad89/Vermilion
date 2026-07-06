import Joi from "joi";

export const locationUpdateSchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  accuracy: Joi.number().min(0).max(500).optional(),
  speed: Joi.number().min(0).optional().allow(null),
  heading: Joi.number().min(0).max(360).optional().allow(null),
  tracking_mode: Joi.string().valid("normal", "high_frequency").default("normal"),
});

export const nearbyDonorsSchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  radius_km: Joi.number().min(1).max(20).default(5),
  blood_type: Joi.string()
    .valid("O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+")
    .optional()
    .allow(null),
});