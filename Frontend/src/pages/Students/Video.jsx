import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import Navbar from '../../components/Navbar';

// Define the data for the chapters
const chapters = [
  { id: 1, title: 'Lesson 1: Introduction', completed: true },
  { id: 2, title: 'Lesson 2: AWS 101', completed: true },
  { id: 3, title: 'Lesson 3: Introduction about 101', completed: true },
  { id: 4, title: 'Lesson 4: Introduction about 102', completed: true },
  { id: 5, title: 'Lesson 5: Introduction about 103', completed: true },
  { id: 6, title: 'Lesson 6: Introduction about 104', completed: true },
  { id: 7, title: 'Lesson 7: Introduction about 105', completed: true },
  { id: 8, title: 'Lesson 8: Introduction about 106', completed: true },
  { id: 9, title: 'Lesson 9: Introduction about 107', completed: true },
];

const Video = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div>
      <Navbar/>
      <div className="p-4">
      <div className="relative">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          width="100%"
          height="100%"
          controls
          className="rounded-lg"
        />
      </div>
      <div className="flex justify-center mt-4">
        <button
          className={`px-4 py-2 mx-2 font-semibold rounded-lg ${activeTab === 'courses' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </button>
        <button
          className={`px-4 py-2 mx-2 font-semibold rounded-lg ${activeTab === 'notes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
        <button
          className={`px-4 py-2 mx-2 font-semibold rounded-lg ${activeTab === 'questions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('questions')}
        >
          Questions
        </button>
        <button
          className={`px-4 py-2 mx-2 font-semibold rounded-lg ${activeTab === 'review' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('review')}
        >
          Review
        </button>
      </div>
      <div className="mt-4">
        {activeTab === 'courses' && (
          <ul>
            {chapters.map(chapter => (
              <li key={chapter.id} className="flex items-center justify-between p-2 border-b border-gray-200">
                <span className={`text-lg ${chapter.completed ? 'text-green-500' : 'text-gray-500'}`}>
                  {chapter.title}
                </span>
                <span className="text-sm">
                  {chapter.completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'notes' && <p>Notes content goes here.</p>}
        {activeTab === 'questions' && <p>Questions content goes here.</p>}
        {activeTab === 'review' && <p>Review content goes here.</p>}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Video;