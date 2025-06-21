const express = require("express");
const router = express.Router();
const certificate  = require("../../controller/studentController/CertificateController");

router.post("/generate", certificate.generateCertificate);

module.exports = router;
