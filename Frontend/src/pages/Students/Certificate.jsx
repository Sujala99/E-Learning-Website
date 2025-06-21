import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

function CertificatePage() {
const { courseId } = useParams();
const location = useLocation();
const { userId, username, courseName } = location.state || {};
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/certificate/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName: username,
          courseId,
          courseTitle: courseName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }

      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `certificate-${username}-${courseName}.pdf`;
      link.click();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mx-auto max-w-xl mt-10 border border-gray-300">
      <div className="text-center">
        <img
          src="/logo.png"
          alt="Certificate Logo"
          className="h-16 mx-auto mb-4"
        />
        <h1 className="text-xl font-semibold mb-2">🎓 This certificate is awarded to</h1>
        <h2 className="text-3xl font-bold text-blue-700 mb-2">{username}</h2>
        <p className="text-lg mb-2">for successfully completing</p>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{courseName}</h3>
        <p className="text-sm text-gray-500 mb-6">offered by AdaceMix</p>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>
          <strong>Lynn Bloomer</strong><br />
          Director<br />
          AdaceMix
        </div>
        <div>Completion Date: {new Date().toLocaleDateString()}</div>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="flex justify-end mt-6">
        <button
          className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => alert('Sharing functionality coming soon!')}
        >
          Share
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  );
}

export default CertificatePage;
