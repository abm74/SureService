import mongoose, { Schema, InferSchemaType } from "mongoose";

export type BookingStatus = "pending" | "accepted" | "declined" | "cancelled" | "completed";
export type CancelledBy = "customer" | "provider" | null;

const bookingSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Provider is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    serviceDate: {
      type: String,
      required: [true, "Service date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
    },
    address: {
      type: String,
      required: [true, "Service address is required"],
      trim: true,
    },
    city: {
      type: String,
      default: "Addis Ababa",
    },
    subCity: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "cancelled", "completed"],
      default: "pending",
    },
    cancelledBy: {
      type: String,
      enum: ["customer", "provider", null],
      default: null,
    },
    wasAccepted: {
      type: Boolean,
      default: false,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: "",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export type Booking = InferSchemaType<typeof bookingSchema>;

const BookingModel = mongoose.model("Booking", bookingSchema);
export default BookingModel;
