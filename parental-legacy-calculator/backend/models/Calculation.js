import mongoose from 'mongoose';

const calculationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    results: {
      factors: [
        {
          name: String,
          mother: Number,
          father: Number,
          total: Number,
        },
      ],
      motherTotal: Number,
      fatherTotal: Number,
      grandTotal: Number,
      dominantParent: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Calculation', calculationSchema);
