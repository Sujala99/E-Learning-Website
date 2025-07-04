// EditCourse.jsx
import React, { useEffect, useState } from 'react';

const EditCourse = ({ courseId, onClose }) => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    pricing: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:4000/instructor/course/get/details/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch course data');
        const data = await res.json();
        const c = data.data;
        setCourse({
          title: c.title,
          description: c.description,
          pricing: c.pricing,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/instructor/course/update/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(course),
      });
      if (!res.ok) throw new Error('Failed to update course');
      alert('Course updated successfully!');
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading course data...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title:</label>
          <input
            name="title"
            value={course.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description:</label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Pricing:</label>
          <input
            type="number"
            name="pricing"
            value={course.pricing}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
