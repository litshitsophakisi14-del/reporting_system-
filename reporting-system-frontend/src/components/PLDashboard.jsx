import { useState, useEffect } from "react";
import { courseService, lectureService, reportService } from "../services/api";
import "../styles/PLDashboard.css";
import LectureRatings from "./LectureRatings"; 

function PLDashboard({ onLogout }) {
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("totalCourses"); 
  const [ratingsVisible, setRatingsVisible] = useState({});
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    faculty: "",
    lecturer_id: ""
  });
  const [editCourseId, setEditCourseId] = useState(null); 
  const [feedbackInputs, setFeedbackInputs] = useState({}); // track PRL feedback inputs

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesResponse, reportsResponse, lecturesResponse] = await Promise.all([
        courseService.getCourses(),
        reportService.getReports(),
        lectureService.getLectures()
      ]);

      setCourses(coursesResponse.data);
      setReports(reportsResponse.data);

      const allLectures = lecturesResponse.data.map(lec => ({
        id: lec.id,
        topic: lec.topic || lec.name || "No topic",
        course_id: lec.course_id,
        lecturer_id: lec.lecturer_id,
        date: lec.date || lec.date_time || "No date"
      }));
      setLectures(allLectures);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRatings = (lectureId) => {
    setRatingsVisible(prev => ({ ...prev, [lectureId]: !prev[lectureId] }));
  };

  // ✅ Submit PRL Feedback (fixed)
  const handleFeedbackSubmit = async (lectureId) => {
    try {
      const feedback = feedbackInputs[lectureId] || "";
      if (!feedback.trim()) {
        alert("Please enter feedback before submitting.");
        return;
      }

      // Call the correct API with prl_feedback field
      await reportService.addPRLFeedback(lectureId, { prl_feedback: feedback });

      // Reset input
      setFeedbackInputs(prev => ({ ...prev, [lectureId]: "" }));

      // Refresh reports list
      fetchData();

      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Try again.");
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editCourseId) {
        await courseService.updateCourse(editCourseId, newCourse);
      } else {
        await courseService.createCourse(newCourse);
      }
      setNewCourse({ name: "", code: "", faculty: "", lecturer_id: "" });
      setEditCourseId(null);
      fetchData();
      setView("totalCourses");
    } catch (err) {
      console.error("Error saving course:", err);
      setError("Failed to save course. Try again.");
    }
  };

  const handleEditCourse = (course) => {
    setNewCourse({
      name: course.name,
      code: course.code,
      faculty: course.faculty,
      lecturer_id: course.lecturer_id
    });
    setEditCourseId(course.id);
    setView("addCourse");
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await courseService.deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
      if (editCourseId === courseId) {
        setEditCourseId(null);
        setNewCourse({ name: "", code: "", faculty: "", lecturer_id: "" });
        setView("totalCourses");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course. Ensure no lectures are linked.");
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;

    try {
      await lectureService.deleteLecture(lectureId);
      setLectures(prev => prev.filter(l => l.id !== lectureId));
    } catch (err) {
      console.error("Error deleting lecture:", err);
      setError("Failed to delete lecture. Try again.");
    }
  };

  const pendingReports = reports.filter(r => r.status === "pending");
  const completedReports = reports.filter(r => r.status === "completed");

  return (
    <>
      <div className="pl-navbar">
        <h1 className="pl-title">Program Leader Dashboard</h1>
        <div className="pl-buttons">
          <button onClick={() => setView("totalCourses")}>Total Courses</button>
          <button onClick={() => setView("totalLectures")}>Total Lectures</button>
          <button onClick={() => setView("pendingReports")}>Pending Reports</button>
          <button onClick={() => setView("completedReports")}>Completed Reports</button>
          <button onClick={() => setView("addCourse")}>Add Course</button>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div className="loading-spinner">Loading...</div> : (
        <div className="dashboard-content">

          {/* Pending Reports */}
          {view === "pendingReports" && (
            <div>
              <h2>Pending Reports</h2>
              {pendingReports.length > 0 ? (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Lecture ID</th>
                      <th>PRL Feedback</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReports.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.lecture_id}</td>
                        <td>
                          <input
                            type="text"
                            placeholder="Enter feedback"
                            value={feedbackInputs[r.lecture_id] || ""}
                            onChange={(e) =>
                              setFeedbackInputs(prev => ({
                                ...prev,
                                [r.lecture_id]: e.target.value
                              }))
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => handleFeedbackSubmit(r.lecture_id)}
                          >
                            Submit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No pending reports.</p>}
            </div>
          )}

          {/* Completed Reports */}
          {view === "completedReports" && (
            <div>
              <h2>Completed Reports</h2>
              {completedReports.length > 0 ? (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Lecture ID</th>
                      <th>PRL Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedReports.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.lecture_id}</td>
                        <td>{r.prl_feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No completed reports.</p>}
            </div>
          )}

          {/* Total Courses */}
          {view === "totalCourses" && (
            <div>
              <h2>All Courses</h2>
              <div className="dashboard-grid">
                {courses.length > 0 ? courses.map(course => (
                  <div key={course.id} className="dashboard-card">
                    <h3>{course.name}</h3>
                    <p><strong>Code:</strong> {course.code}</p>
                    <p><strong>Faculty:</strong> {course.faculty}</p>
                    <p><strong>Lecturer ID:</strong> {course.lecturer_id}</p>
                    <div className="course-actions">
                      <button onClick={() => handleEditCourse(course)} className="btn btn-warning">Edit</button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                )) : <p>No courses found.</p>}
              </div>
            </div>
          )}

          {/* Total Lectures */}
          {view === "totalLectures" && (
            <div>
              <h2>All Lectures</h2>
              <div className="dashboard-grid">
                {lectures.length > 0 ? lectures.map(lecture => (
                  <div key={lecture.id} className="dashboard-card">
                    <h3>{lecture.topic}</h3>
                    <p><strong>Course ID:</strong> {lecture.course_id}</p>
                    <p><strong>Lecturer ID:</strong> {lecture.lecturer_id}</p>
                    <p><strong>Date:</strong> {lecture.date}</p>
                    <div className="lecture-actions">
                      <button onClick={() => toggleRatings(lecture.id)} className="btn btn-secondary">
                        {ratingsVisible[lecture.id] ? "Hide Ratings" : "Show Ratings"}
                      </button>
                      <button onClick={() => handleDeleteLecture(lecture.id)} className="btn btn-danger">Delete Lecture</button>
                    </div>
                    {ratingsVisible[lecture.id] && <LectureRatings lectureId={lecture.id} showForm={false} />}
                  </div>
                )) : <p>No lectures found.</p>}
              </div>
            </div>
          )}

          {/* Add/Edit Course */}
          {view === "addCourse" && (
            <div>
              <h2>{editCourseId ? "Edit Course" : "Add Course"}</h2>
              <form className="add-course-form" onSubmit={handleSaveCourse}>
                <input
                  type="text"
                  placeholder="Course Name"
                  value={newCourse.name}
                  onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Course Code"
                  value={newCourse.code}
                  onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Faculty"
                  value={newCourse.faculty}
                  onChange={e => setNewCourse({ ...newCourse, faculty: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Lecturer ID"
                  value={newCourse.lecturer_id}
                  onChange={e => setNewCourse({ ...newCourse, lecturer_id: e.target.value })}
                  required
                />
                <button type="submit" className="btn btn-primary">{editCourseId ? "Update" : "Add"} Course</button>
              </form>
            </div>
          )}

        </div>
      )}
    </>
  );
}

export default PLDashboard;
