import Joi from "joi";

const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+", "unknown"];
const urgencies = ["standard", "urgent", "critical"];
const forWhomOptions = ["self", "other", "hospital"];

export const raiseRequestSchema = Joi.object({
  blood_type: Joi.string().valid(...bloodTypes).required().messages({
    "any.only": "Invalid blood type",
    "any.required": "Blood type is required",
  }),
  units_needed: Joi.number().integer().min(1).max(20).required(),
  urgency: Joi.string().valid(...urgencies).required(),
  for_whom: Joi.string().valid(...forWhomOptions).required(),
  patient_name: Joi.string().max(200).when("for_whom", {
    is: "other",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  hospital_id: Joi.string().uuid().when("for_whom", {
    is: "hospital",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  patient_notes: Joi.string().max(500).optional().allow(""),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  search_radius_km: Joi.number().min(1).max(20).default(5),
  idempotency_key: Joi.string().uuid().optional(),
});