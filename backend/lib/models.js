import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  noteLimit: { type: Number, default: 3 },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  tenantSlug: { type: String, required: true },
}, { timestamps: true });

const NoteSchema = new mongoose.Schema({
  tenantSlug: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
}, { timestamps: true });

export const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
export const User   = mongoose.models.User   || mongoose.model('User', UserSchema);
export const Note   = mongoose.models.Note   || mongoose.model('Note', NoteSchema);
