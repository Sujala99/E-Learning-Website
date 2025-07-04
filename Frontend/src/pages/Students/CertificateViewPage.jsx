import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CertificateViewPage = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(`http://localhost:4000/certificate/certificate/${certificateId}`);
        const data = await res.json();
        console.log("Fetched certificate:", data);

        if (data.success) {
          setCertificate(data.data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch certificate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!certificate) return <p className="p-4 text-red-500">Certificate not found or failed to load.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎓 {certificate.courseTitle}</h1>
      <p className="text-gray-500 mb-4">Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}</p>

      <iframe
        src={`http://localhost:4000/certificates/${certificate.pdfPath}`}
        title="Certificate PDF"
        width="100%"
        height="600px"
        className="border rounded"
      ></iframe>

      <a
        href={`http://localhost:4000/certificates/${certificate.pdfPath}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download PDF
      </a>
    </div>
  );
};

export default CertificateViewPage;
