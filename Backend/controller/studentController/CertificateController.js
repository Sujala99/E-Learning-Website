const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Certificate = require("../../models/CertificateModels");
const Course = require("../../models/coursesModels");

exports.generateCertificate = async (req, res) => {
  const { userId, userName, courseId, courseTitle } = req.body;

  if (!userId || !courseId || !userName || !courseTitle) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const certsDir = path.join(__dirname, "../../certificates");
    if (!fs.existsSync(certsDir)) fs.mkdirSync(certsDir);

    const fileName = `certificate_${userId}_${courseId}_${Date.now()}.pdf`;
    const filePath = path.join(certsDir, fileName);

    const doc = new PDFDocument({ layout: "landscape", size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Design layout
    doc
      .fontSize(36)
      .fillColor("#333")
      .text("🎓 Certificate of Completion", { align: "center" })
      .moveDown(2);

    doc
      .fontSize(24)
      .fillColor("#000")
      .text(`This certifies that`, { align: "center" })
      .moveDown();

    doc
      .fontSize(30)
      .text(userName, { align: "center", underline: true })
      .moveDown();

    doc
      .fontSize(24)
      .text(`has successfully completed the course`, { align: "center" })
      .moveDown();

    doc
      .fontSize(28)
      .text(courseTitle, { align: "center", underline: true })
      .moveDown(2);

    doc
      .fontSize(20)
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

    doc.end();

    stream.on("finish", async () => {
      const certificate = new Certificate({
        userId,
        courseId,
        pdfPath: fileName,
      });
      await certificate.save();

      res.download(filePath, fileName);
    });
  } catch (err) {
    console.error("Certificate gen error:", err);
    res.status(500).json({ success: false, message: "Certificate generation failed" });
  }
};


exports.getUserCertificates = async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

  try {
    const certificates = await Certificate.find({ userId });

    // Fetch course titles for each certificate
    const populatedCertificates = await Promise.all(certificates.map(async (cert) => {
      const course = await Course.findById(cert.courseId);
      return {
        _id: cert._id,
        courseTitle: course?.title || "Unknown Course",
        issuedAt: cert.issuedAt,
        pdfPath: cert.pdfPath,
      };
    }));

    res.json({ success: true, data: populatedCertificates });
  } catch (err) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({ success: false, message: "Failed to fetch certificates" });
  }
};


exports.getCertificateById = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching certificate with ID:", id);

  try {
    const cert = await Certificate.findById(id);
    if (!cert) {
      console.warn("Certificate not found for ID:", id);
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    const course = await Course.findById(cert.courseId);
    res.json({
      success: true,
      data: {
        _id: cert._id,
        userId: cert.userId,
        courseTitle: course?.title || "Unknown Course",
        issuedAt: cert.issuedAt,
        pdfPath: cert.pdfPath,
      },
    });
  } catch (err) {
    console.error("Error fetching certificate:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
