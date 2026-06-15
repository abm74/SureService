import mongoose, { InferSchemaType, Schema } from "mongoose";

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: [true, "Token is required"],
  },
  userId: {
    type: String,
    required: [true, "UserId is required"],
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RefreshToken = InferSchemaType<typeof refreshTokenSchema>;

export const RefreshTokenModel = mongoose.model(
  "refreshtoken",
  refreshTokenSchema,
);
