import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

const AllCertificate = () => {
  const { user } = useUserContext();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`http://localhost:4000/certificate/user/${user.id}`);
      const data = await res.json();

      if (data.success) {
        setCertificates(data.data);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  return (
    <div>
        <Navbar/>
          <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎓 My Certificates</h1>

      {loading ? (
        <p>Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <p>No certificates found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="border rounded-lg p-4 shadow-md bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-blue-600">{cert.courseTitle}</h2>
                <p className="text-sm text-gray-500">
                  Issued on: {new Date(cert.issuedAt).toLocaleDateString()}
                </p>
              </div>
              <Link
  to={`/all-certificate/view/${cert._id}`}
  className="mt-4 inline-block text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded text-sm text-center"
>
  View Certificate
</Link>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  
  );
};

export default AllCertificate;
