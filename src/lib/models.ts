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
  { timestamps: true }
);

// --- Conversations ---
export interface IConversation extends Document {
  userId: string; // Foreign key matching User.uid
  type: string;
  context: string;
  lastMessage: string;
}

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    context: { type: String, required: true },
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true } // Creates createdAt and updatedAt
);

// --- Messages ---
export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  sender: "user" | "admin";
  text: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: String, enum: ["user", "admin"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

// --- Applications ---
export interface IApplication extends Document {
  userId: string;
  course: string;
  phone: string;
  zipcode: string;
  name: string;
  email: string;
  status: string;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: { type: String },
    course: { type: String, required: true },
    phone: { type: String },
    zipcode: { type: String },
    name: { type: String },
    email: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
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
  { timestamps: true }
);

// Next.js Hot Reload safety (models are cached between reloads)
export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
export const Application = mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
export const GalleryImage = mongoose.models.GalleryImage || mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);
