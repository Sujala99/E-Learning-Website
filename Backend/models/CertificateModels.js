const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  pdfPath: { type: String, required: true },
});

module.exports = mongoose.model("Certificate", CertificateSchema);
