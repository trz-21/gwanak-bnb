import mongoose from 'mongoose'

const accommodationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['room', 'entire_home'], default: 'entire_home' },
    bedrooms: { type: Number, default: 1 },
    beds: { type: Number, default: 1 },
    pricePerNight: { type: Number, required: true },
    rating: { type: Number, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    maxGuests: { type: Number, required: true },
    tag: { type: String, default: null },
    description: { type: String },
    images: [{ type: String }],
    availableFrom: { type: Date, default: () => new Date('2026-01-01') },
    availableTo: { type: Date, default: () => new Date('2027-12-31') },
  },
  { timestamps: true }
)

export default mongoose.model('Accommodation', accommodationSchema)
