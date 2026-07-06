import Joi from "joi";

const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+", "unknown"];

export const registerDonorSchema = Joi.object({
  blood_type: Joi.string().valid(...bloodTypes).required(),
  default_radius_km: Joi.number().min(1).max(20).default(3),
  transport_mode: Joi.string().valid("walking", "bike", "car").default("bike"),
  quiet_hours_start: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .optional()
    .allow(null),
  quiet_hours_end: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .optional()
    .allow(null),
});

export const toggleAvailabilitySchema = Joi.object({
  is_available: Joi.boolean().required(),
});

export const updateDonorSettingsSchema = Joi.object({
  default_radius_km: Joi.number().min(1).max(20).optional(),
  transport_mode: Joi.string().valid("walking", "bike", "car").optional(),
  quiet_hours_start: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .optional()
    .allow(null),
  quiet_hours_end: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .optional()
    .allow(null),
}).min(1);

export const respondToRequestSchema = Joi.object({
  response: Joi.string().valid("accepted", "rejected").required(),
  rejection_reason: Joi.string().max(200).when("response", {
    is: "rejected",
    then: Joi.optional().allow(""),
    otherwise: Joi.forbidden(),
  }),
});

export const updateProfileSchema = Joi.object({
  full_name: Joi.string().max(200).optional(),
  city: Joi.string().max(100).optional(),
  blood_type: Joi.string()
    .valid(...bloodTypes)
    .optional(),
  phone: Joi.string()
    .pattern(/^\+91[6-9]\d{9}$/)
    .optional(),
}).min(1);