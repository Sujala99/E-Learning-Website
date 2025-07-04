import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import person1 from "../assets/images/person1.png";
import person2 from "../assets/images/person2.png";

const Home = () => {
  const { user } = useUserContext();
  const [courses, setCourses] = useState([]);
const [topCourses, setTopCourses] = useState([]);
const [instructors, setInstructors] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`http://localhost:4000/studentCourses/get/${user.id}`);
        const data = await res.json();

        if (data.success) {
          const processed = data.data.map(course => {
            const chapters = course.chapters || [];
            const total = chapters.length;
            const done = chapters.filter(ch => ch.completed).length;
            const progress = total > 0 ? Math.round((done / total) * 100) : 0;
            return { ...course, progress };
          });

          setCourses(processed);
        }
      } catch (err) {
        console.error("Error fetching user courses:", err);
      }
    };

    fetchCourses();
  }, [user]);
  

useEffect(() => {
  const fetchHomeData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/home/data");
      const data = await res.json();
      if (data.success) {
        setTopCourses(data.courses);
        setInstructors(data.instructors);
      }
    } catch (err) {
      console.error("Error fetching home data:", err);
    }
  };

  fetchHomeData();
}, []);


  return (
    <div>
      <Navbar />
      <div className="bg-gray-100">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {user?.username && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  Hello {user.username},
                  <span className="block mt-1 text-xl text-indigo-600">
                    Welcome to AcadeMix
                  </span>
                </h2>
              </>
            )}
            <p className="mt-4 text-lg leading-6 text-gray-500">
              Why Swift UI Should Be on the Radar of Every Mobile Developer
            </p>
            <p className="mt-2 text-base leading-6 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-6">
              <Link
                to="/courses"
                className="inline-block bg-blue-600 border border-transparent rounded-md py-3 px-5 text-base font-medium text-white shadow hover:bg-blue-700"
              >
                Start learning now
              </Link>
            </div>
          </div>
        </section>

        {/* Only show this section if user is logged in */}
        {user?.id && courses.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold mb-4">Continue Study</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map(course => (
                <div key={course._id} className="rounded-lg shadow-lg overflow-hidden bg-white">
                  <img
                    src={course.courseImage || "https://source.unsplash.com/random/300x200/?course"}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{course.progress}% completed</p>
                    </div>
                    <Link
                      to={`/course/${course.courseId}`}
                      className="inline-block mt-3 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                    >
                      Continue Course →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

<h2 className="font-extrabold text-gray-900 mb-10">Top Courses</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {topCourses.map((c) => (
  <div key={c._id} className="bg-white rounded-lg shadow-md overflow-hidden">
    <img
      src={c.image || "https://source.unsplash.com/random/300x200/?course"}
      alt="Course"
      className="w-full"
    />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
      <p className="text-gray-700 mb-2"> {c.curriculum?.length || 0} Lessons</p>
      <p className="text-sm text-gray-500">{c.description?.slice(0, 100)}...</p>
      <div className="flex items-center mt-4">
        <img
          src={c.instructorImage || "https://source.unsplash.com/random/50x50/?person"}
          alt="Instructor"
          className="w-10 h-10 rounded-full mr-2"
        />
        <div>
          <p className="text-base font-semibold">{c.instructorName || "Instructor"}</p>
          <button className="text-white bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded-full mt-2">
            ${c.pricing ?? "Free"}
          </button>
        </div>
      </div>
    </div>
  </div>
))}
</div>



    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
  Our Instructors
</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {instructors.map((ins) => (
  <div key={ins._id} className="bg-white rounded-lg shadow-md overflow-hidden">
    <img
      src={ins.image || "https://source.unsplash.com/random/300x200/?person"}
      alt="Instructor"
      className="w-full"
    />
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{ins.username}</h3>
      <p className="text-sm text-gray-500">{ins.bio || "No bio available."}</p>
    </div>
  </div>
))}
</div>



    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            TESTIMONIAL
            <br />
            What They Say?
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <img
                src={person1}
                alt="Person 1"
                className="w-20 h-20 rounded-full mr-4"
              />
              <div className="text-lg font-semibold">Gloria Rose</div>
            </div>
            <p className="text-lg italic">
              "Thank you so much for your help. It's exactly what I've been looking for. You won't regret it. It really saves me time and effort. TOTC is exactly what our business has been lacking."
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-1">
              
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <img
                src={person2}
                alt="Person 2"
                className="w-20 h-20 rounded-full mr-4"
              />
              <div className="text-lg font-semibold">Gloria Rose</div>
            </div>
            <p className="text-lg italic">
              "Thank you so much for your help. It's exactly what I've been looking for. You won't regret it. It really saves me time and effort. TOTC is exactly what our business has been lacking."
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-1">
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>








            
          </section>
        )}

       
      </div>
      <Footer />
    </div>
  );
};

export default Home;
