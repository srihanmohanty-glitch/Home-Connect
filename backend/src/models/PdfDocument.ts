import mongoose from 'mongoose';

const PdfDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const PdfDocument = mongoose.model('PdfDocument', PdfDocumentSchema);

export default PdfDocument;
