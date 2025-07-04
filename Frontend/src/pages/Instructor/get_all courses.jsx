import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import NavbarAdmin from '../../components/NavbarAdmin';
import EditCourse from './EditCourse'; // adjust this import path as needed
import CourseRatingDisplay from '../../components/CourseRatingDisplay';

const GetMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCourseId, setEditCourseId] = useState(null);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/instructor/course/mycourse', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const confirmed = window.confirm('Are you sure you want to delete this course?');
      if (!confirmed) return;

      await axios.delete(`http://localhost:4000/instructor/course/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Delete failed');
    }
  };

  const handleEdit = (id) => {
    setEditCourseId(id);
  };

  const handleCloseEdit = () => {
    setEditCourseId(null);
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <div className="p-6">Loading courses...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* <div className="w-64 bg-white shadow-lg">
        <Sidebar />
      </div> */}

      <div className="flex-1 flex flex-col">
        {/* <NavbarAdmin /> */}
        <main className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">My Courses</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <p className="text-gray-600">No courses found.</p>
            ) : (
              courses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-md p-4">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <p className="text-gray-600 text-sm">
                    {course.students?.length || 0} Students 
                     <CourseRatingDisplay courseId={course._id} />

                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(course._id)}
                      className="bg-[#0074B7] hover:bg-[#005f99] text-white font-semibold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Edit Modal */}
        {editCourseId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={handleCloseEdit}
              >
                ✖
              </button>
              <EditCourse courseId={editCourseId} onClose={handleCloseEdit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetMyCourses;
