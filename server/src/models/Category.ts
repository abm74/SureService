import mongoose, { Schema, InferSchemaType } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "Wrench",
    },
    color: {
      type: String,
      default: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
    },
    description: {
      type: String,
      default: "",
    },
    isPopular: {
      type: Boolean,
      default: false,
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

categorySchema.pre("save", function () {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
});

export type Category = InferSchemaType<typeof categorySchema>;

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
