import Joi from "joi";

const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
const forWhomOptions = ["self", "other", "hospital"];

export const searchBloodSchema = Joi.object({
  blood_type: Joi.string().valid(...bloodTypes).required(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  radius_km: Joi.number().min(1).max(20).default(5),
  units_needed: Joi.number().min(1).max(20).default(1),
  urgency: Joi.string().valid("standard", "urgent", "critical").default("standard"),
  for_whom: Joi.string()
    .valid(...forWhomOptions)
    .default("self"),
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
});

export const escalateSearchSchema = Joi.object({
  search_id: Joi.string().uuid().required(),
  units_needed: Joi.number().min(1).max(20).default(1),
  urgency: Joi.string().valid("standard", "urgent", "critical").default("urgent"),
  patient_notes: Joi.string().max(500).optional().allow(""),
  idempotency_key: Joi.string().uuid().optional(),
});