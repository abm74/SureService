import mongoose, { Schema, InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "customer" | "provider" | "admin";
export type VerificationStatus = "unverified" | "pending" | "approved" | "rejected";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer",
    },
    avatar: {
      type: String,
      default: "https://i.pravatar.cc/100",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      city: { type: String, default: "Addis Ababa" },
      subCity: { type: String, default: "Bole" },
      address: { type: String, default: "" },
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "approved", "rejected"],
      default: "unverified",
    },
    verificationDocUrl: {
      type: String,
      default: "",
    },
    verificationDocType: {
      type: String,
      default: "National ID",
    },
    verificationSubmittedAt: {
      type: Date,
      default: null,
    },
    verificationReviewedAt: {
      type: Date,
      default: null,
    },
    verificationRejectionReason: {
      type: String,
      default: "",
    },
    trustScore: {
      type: Number,
      default: 15,
      min: 0,
      max: 100,
    },
    trustBreakdown: {
      profileScore: { type: Number, default: 15 },
      verificationScore: { type: Number, default: 0 },
      completedJobsScore: { type: Number, default: 0 },
      repeatBonusScore: { type: Number, default: 0 },
      cancellationPenalty: { type: Number, default: 0 },
    },
    completedJobsCount: {
      type: Number,
      default: 0,
    },
    repeatCustomerCount: {
      type: Number,
      default: 0,
    },
    providerCancelledCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    methods: {
      async verifyPassword(password: string) {
        try {
          if (!this.password) return false;
          return await bcrypt.compare(password, this.password);
        } catch {
          return false;
        }
      },
    },
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (!this.avatar || this.avatar === "https://i.pravatar.cc/100") {
    const seed = encodeURIComponent(this.name || this.username);
    this.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=ffb545,98fdce,2563eb`;
  }

  if (!this.isModified("password")) return;

  const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

export type User = InferSchemaType<typeof userSchema>;

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
