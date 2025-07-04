const express = require("express");
const router = express.Router();
const certificate  = require("../../controller/studentController/CertificateController");

router.post("/generate", certificate.generateCertificate);
router.get("/user/:userId", certificate.getUserCertificates);
router.get('/certificate/:id', certificate.getCertificateById);

module.exports = router;
