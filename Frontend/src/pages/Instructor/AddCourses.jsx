import axios from 'axios';
import { useUserContext } from '../../context/UserContext';
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import NavbarAdmin from '../../components/NavbarAdmin';
import Navbar from '../../components/Navbar';

const AddCourse = () => {
  const { user } = useUserContext();

  const [course, setCourse] = useState({
    title: '',
    description: '',
    fees: '',
    image: '',
    importantThings: '',
    notes: '',
    courseContent: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setImageFile(files[0]);
    } else {
      setCourse((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLectureChange = (index, e) => {
    const { name, value, files } = e.target;
    const newCourseContent = [...course.courseContent];
    if (name === 'video') {
      newCourseContent[index].video = files[0];
      newCourseContent[index].videoUrl = '';
      newCourseContent[index].public_id = '';
    } else {
      newCourseContent[index][name] = value;
    }
    setCourse((prev) => ({ ...prev, courseContent: newCourseContent }));
  };

  const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append("videos", file);
    const res = await axios.post("http://localhost:4000/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  };

  const uploadAllLectures = async () => {
    const updatedLectures = [...course.courseContent];
    for (let i = 0; i < updatedLectures.length; i++) {
      const lecture = updatedLectures[i];
      if (lecture.video && !lecture.videoUrl) {
        const uploaded = await uploadMedia(lecture.video);
        updatedLectures[i] = {
          ...lecture,
          videoUrl: uploaded.secure_url,
          public_id: uploaded.public_id,
        };
      }
    }
    return updatedLectures;
  };

  const addLecture = () => {
    setCourse((prev) => ({
      ...prev,
      courseContent: [...prev.courseContent, { title: '', video: null, videoUrl: '', public_id: '' }],
    }));
  };

  const deleteLecture = (index) => {
    const updatedLectures = [...course.courseContent];
    updatedLectures.splice(index, 1);
    setCourse((prev) => ({ ...prev, courseContent: updatedLectures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedImage = null;
      if (imageFile) {
        uploadedImage = await uploadMedia(imageFile);
      }
      const uploadedLectures = await uploadAllLectures();

      const coursePayload = {
        title: course.title,
        description: course.description,
        pricing: parseFloat(course.fees),
        image: uploadedImage?.secure_url || '',
        objectives: course.importantThings,
        welcomeMessage: course.notes,
        curriculum: uploadedLectures.map((lec) => ({
          title: lec.title,
          videoUrl: lec.videoUrl || '',
          public_id: lec.public_id || '',
        })),
        date: new Date(),
        isPublished: false,
        category: 'Design',
        level: 'Beginner',
        primaryLanguage: 'English',
        subtitle: 'Course Subtitle',
      };

      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:4000/instructor/course/add', coursePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Course created successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Error creating course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64 bg-white shadow-md">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Title of the Course</h2>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />

            <h3 className="font-bold mb-2">Description of Course</h3>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              rows="4"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-bold mb-2">Fees</h3>
                <input
                  type="number"
                  name="fees"
                  value={course.fees}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <h3 className="font-bold mb-2">Image</h3>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <h3 className="font-bold mb-2">Important Things You Will Learn</h3>
            <textarea
              name="importantThings"
              value={course.importantThings}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              rows="4"
            />

            <h3 className="font-bold mb-2">Course Content</h3>
            <button
              type="button"
              onClick={addLecture}
              className="bg-[#0074B7] text-white px-4 py-2 rounded mb-4"
            >
              Add Lecture
            </button>

            {course.courseContent.map((lec, index) => (
              <div key={index} className="bg-blue-100 p-4 rounded mb-4">
                <h4 className="font-bold">Lecture {index + 1}</h4>
                <input
                  type="text"
                  name="title"
                  placeholder="Lecture title"
                  value={lec.title}
                  onChange={(e) => handleLectureChange(index, e)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="file"
                  accept="video/*"
                  name="video"
                  onChange={(e) => handleLectureChange(index, e)}
                  className="w-full p-2 mb-2 border rounded"
                />

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      const updatedLectures = [...course.courseContent];
                      updatedLectures[index].video = null;
                      updatedLectures[index].videoUrl = '';
                      updatedLectures[index].public_id = '';
                      setCourse((prev) => ({ ...prev, courseContent: updatedLectures }));
                    }}
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteLecture(index)}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>

                {lec.videoUrl && (
                  <p className="text-sm text-green-700 mt-2">Video uploaded ✅</p>
                )}
              </div>
            ))}

            <h3 className="font-bold mb-2">Notes</h3>
            <textarea
              name="notes"
              value={course.notes}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              rows="4"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0074B7] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? 'Saving...' : 'Save Course'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;
