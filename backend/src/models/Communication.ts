import mongoose from 'mongoose';

const CommunicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attachedPdfs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PdfDocument',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Communication = mongoose.model('Communication', CommunicationSchema);

export default Communication;
