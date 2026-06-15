import mongoose, { Schema, InferSchemaType } from "mongoose";

const systemConfigSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global",
    },
    allowedVerificationDocTypes: {
      type: [String],
      default: [
        "Kebele ID",
        "National ID (Fayda)",
        "Ethiopian Trade License",
        "Driver's License",
        "Passport",
        "Professional Certification / Degree",
      ],
    },
    avatarConfig: {
      baseUrl: {
        type: String,
        default: "https://api.dicebear.com/7.x/initials/svg",
      },
      bgColors: {
        type: [String],
        default: ["ffb545", "98fdce", "2563eb"],
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export type SystemConfig = InferSchemaType<typeof systemConfigSchema>;

const SystemConfigModel = mongoose.model("SystemConfig", systemConfigSchema);
export default SystemConfigModel;
