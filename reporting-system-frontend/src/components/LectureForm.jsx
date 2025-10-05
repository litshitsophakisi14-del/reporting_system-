import { useState, useEffect } from "react";
import { lectureService, authService, courseService } from "../services/api";

function LectureForm({ onSuccess }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_id: "",
    course_name: "",
    course_code: "",
    faculty_name: "",
    class_name: "",
    lecturer_id: "",
    lecturer_name: "",
    date: "",
    week: 0,
    topic: "",
    outcomes: "",
    students_registered: 0,
    students_present: 0,
    venue: "",
    scheduled_time: "",
    recommendations: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = authService.getCurrentUser();
        if (user && user.id) {
          setFormData(prev => ({
            ...prev,
            lecturer_id: user.id,
            lecturer_name: user.username
          }));
        }

        const coursesResponse = await courseService.getCourses();
        setCourses(coursesResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load form data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "week" || name === "students_registered" || name === "students_present"
        ? Number(value) || 0
        : value
    }));
  };

  const handleCourseChange = e => {
    const selectedCourse = courses.find(c => c.id === Number(e.target.value));
    setFormData(prev => ({
      ...prev,
      course_id: e.target.value,
      course_name: selectedCourse?.name || "",
      course_code: selectedCourse?.code || "",
      faculty_name: selectedCourse?.faculty_name || ""
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    const user = authService.getCurrentUser();
    if (!user) return setError("User not authenticated.");

    if (!formData.topic || !formData.date || !formData.course_id || !formData.venue) {
      return setError("Please fill in all required fields.");
    }

    const lectureData = {
      ...formData,
      lecturer_id: Number(user.id),
      course_id: Number(formData.course_id),
      week: Number(formData.week) || 0,
      students_registered: Number(formData.students_registered) || 0,
      students_present: Number(formData.students_present) || 0,
      attendance:
        Number(formData.students_registered) > 0
          ? (Number(formData.students_present) / Number(formData.students_registered)) * 100
          : 0
    };

    try {
      setLoading(true);
      await lectureService.createLecture(lectureData);
      onSuccess?.();
      alert("Lecture submitted successfully!");

      setFormData({
        course_id: "",
        course_name: "",
        course_code: "",
        faculty_name: "",
        class_name: "",
        lecturer_id: user.id,
        lecturer_name: user.username,
        date: "",
        week: 0,
        topic: "",
        outcomes: "",
        students_registered: 0,
        students_present: 0,
        venue: "",
        scheduled_time: "",
        recommendations: ""
      });
    } catch (err) {
      console.error("Error creating lecture:", err);
      setError(err.response?.data?.message || "Failed to create lecture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .lecture-form {
          max-width: 800px;
          margin: 40px auto;
          padding: 30px 40px;
          background-color: #111;
          color: #f2f2f2;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
          font-family: 'Poppins', sans-serif;
        }

        .lecture-form h3 {
          text-align: center;
          margin-bottom: 25px;
          font-size: 2rem;
          color: #4ca1af;
          background: linear-gradient(90deg, #4ca1af, #c4e0e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .lecture-form .alert {
          background-color: #e74c3c;
          color: #fff;
          padding: 10px 15px;
          margin-bottom: 20px;
          border-radius: 8px;
          font-weight: 500;
          text-align: center;
        }

        .lecture-form .loading {
          text-align: center;
          color: #4ca1af;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .lecture-form .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
        }

        .lecture-form label {
          margin-bottom: 6px;
          font-weight: 500;
          color: #ccc;
        }

        .lecture-form input,
        .lecture-form select,
        .lecture-form textarea {
          padding: 12px 15px;
          border-radius: 10px;
          border: none;
          background-color: #222;
          color: #f2f2f2;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
        }

        .lecture-form input:focus,
        .lecture-form select:focus,
        .lecture-form textarea:focus {
          background-color: #333;
          box-shadow: 0 0 0 3px rgba(76,161,175,0.5);
        }

        .lecture-form textarea {
          min-height: 100px;
          resize: vertical;
        }

        .lecture-form button.btn-primary {
          width: 100%;
          padding: 14px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          background: linear-gradient(90deg, #4ca1af, #c4e0e5);
          color: #000;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .lecture-form button.btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76,161,175,0.7);
        }

        @media screen and (max-width: 768px) {
          .lecture-form {
            padding: 25px 20px;
          }

          .lecture-form h3 {
            font-size: 1.7rem;
          }
        }
      `}</style>

      <form className="lecture-form" onSubmit={handleSubmit}>
        <h3>Add New Lecture</h3>
        {error && <div className="alert">{error}</div>}
        {loading && <div className="loading">Loading...</div>}

        <div className="form-group">
          <label>Course</label>
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleCourseChange}
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Faculty Name</label>
          <input type="text" name="faculty_name" value={formData.faculty_name || ""} readOnly />
        </div>

        <div className="form-group">
          <label>Course Code</label>
          <input type="text" name="course_code" value={formData.course_code || ""} readOnly />
        </div>

        <div className="form-group">
          <label>Class Name</label>
          <input type="text" name="class_name" value={formData.class_name || ""} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date of Lecture</label>
          <input type="date" name="date" value={formData.date || ""} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Week of Reporting</label>
          <input type="number" name="week" value={formData.week ?? 0} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Scheduled Lecture Time</label>
          <input type="time" name="scheduled_time" value={formData.scheduled_time || ""} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Topic Taught</label>
          <input type="text" name="topic" value={formData.topic || ""} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Learning Outcomes of the Topic</label>
          <textarea name="outcomes" value={formData.outcomes || ""} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Total Registered Students</label>
          <input type="number" name="students_registered" value={formData.students_registered ?? 0} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Number of Students Present</label>
          <input type="number" name="students_present" value={formData.students_present ?? 0} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Venue</label>
          <input type="text" name="venue" value={formData.venue || ""} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Lecturer's Recommendations</label>
          <textarea name="recommendations" value={formData.recommendations || ""} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Submit Lecture</button>
      </form>
    </>
  );
}

export default LectureForm;
