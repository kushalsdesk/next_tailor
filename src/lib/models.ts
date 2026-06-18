import mongoose, { Schema, Document } from "mongoose";

// --- Users ---
export interface IUser extends Document {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
  lastSeen: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    displayName: { type: String },
    photoURL: { type: String },
    role: { type: String, default: "user" },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// --- Conversations ---
export interface IConversation extends Document {
  userId: string; // Foreign key matching User.uid
  type: string;
  context: string;
  lastMessage: string;
  from: "user" | "admin";
}

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    context: { type: String, required: true },
    lastMessage: { type: String, default: "" },
    from: { type: String, enum: ["user", "admin"], required: true },
  },
  { timestamps: true }, // Creates createdAt and updatedAt
);

// --- Messages ---
export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  sender: "user" | "admin";
  text: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: { type: String, enum: ["user", "admin"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

// --- Admissions ---
export interface IAdmission extends Document {
  userId?: string;
  name: string;
  course: string;
  phone: string;
  email: string;
  zipcode?: string;
  status: "submitted" | "reviewed" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema: Schema = new Schema(
  {
    userId: { type: String, required: false },
    name: { type: String, required: true },
    course: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    zipcode: { type: String, required: false },
    status: {
      type: String,
      required: true,
      enum: ["submitted", "reviewed", "accepted", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true },
);

// --- Inquiries (Career) ---
export interface IInquiry extends Document {
  userId?: string;
  name: string;
  path: string; // The selected career path
  phone: string;
  email: string;
  status: "submitted" | "reviewed" | "accepted" | "rejected";
  subscribe: boolean;
  getTips: boolean;
  sellCreation: boolean;
  loanFacility: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    userId: { type: String, required: false },
    name: { type: String, required: true },
    path: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["submitted", "reviewed", "accepted", "rejected"],
      default: "submitted",
    },
    subscribe: { type: Boolean, default: false },
    getTips: { type: Boolean, default: false },
    sellCreation: { type: Boolean, default: false },
    loanFacility: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// --- Gallery Images (Base64 approach) ---
export interface IGalleryImage extends Document {
  base64Data: string; // The huge base64 string
  filename: string;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    base64Data: { type: String, required: true },
    filename: { type: String, required: true },
  },
  { timestamps: true },
);

// Next.js Hot Reload safety (models are cached between reloads)
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
export const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
export const Admission =
  mongoose.models.Admission ||
  mongoose.model<IAdmission>("Admission", AdmissionSchema);
export const Inquiry =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
export const GalleryImage =
  mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);
