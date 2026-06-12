import mongoose, { Schema, InferSchemaType } from "mongoose";

const locationSchema = new Schema(
  {
    city: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subCities: {
      type: [String],
      default: [],
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

export type LocationDoc = InferSchemaType<typeof locationSchema>;

const LocationModel = mongoose.model("Location", locationSchema);
export default LocationModel;
