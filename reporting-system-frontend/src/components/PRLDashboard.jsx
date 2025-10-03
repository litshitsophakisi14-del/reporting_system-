import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { lectureService, reportService } from "../services/api";
import "../styles/PRLDashboard.css";
import LectureRatings from "./LectureRatings";

function PRLDashboard() {
  const [lectures, setLectures] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [stats, setStats] = useState({ completedLectures: 0, pendingLectures: 0, totalReports: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingsVisible, setRatingsVisible] = useState({});

  // 🔹 Track which section is active
  const [activeSection, setActiveSection] = useState("completedLectures");

  const navigate = useNavigate();

  // Update statistics
  const updateStats = (lecturesList, reportsList) => {
    const completedLectures = lecturesList.filter(l => l.status === "completed").length;
    const pendingLectures = lecturesList.filter(l => l.status === "pending").length;
    setStats({ completedLectures, pendingLectures, totalReports: reportsList.length });
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [lecturesResponse, reportsResponse] = await Promise.all([
          lectureService.getLectures(),
          reportService.getReports()
        ]);

        const lecturesData = lecturesResponse.data || [];
        const reportsData = reportsResponse.data || [];

        setLectures(lecturesData);
        setReports(reportsData);
        updateStats(lecturesData, reportsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Toggle lecture ratings
  const toggleRatings = lectureId => {
    setRatingsVisible(prev => ({ ...prev, [lectureId]: !prev[lectureId] }));
  };

  // Add PRL feedback
  const handleAddFeedback = async () => {
    if (!selectedLecture || !feedback.trim()) return;

    try {
      setLoading(true);
      await reportService.addPRLFeedback(selectedLecture.id, {
        prl_feedback: feedback,
        status: "completed"
      });

      setLectures(prev =>
        prev.map(l => (l.id === selectedLecture.id ? { ...l, status: "completed" } : l))
      );

      setReports(prev =>
        prev.map(r =>
          r.lecture_id === selectedLecture.id
            ? { ...r, prl_feedback: feedback, status: "completed" }
            : r
        )
      );

      updateStats(
        lectures.map(l =>
          l.id === selectedLecture.id ? { ...l, status: "completed" } : l
        ),
        reports
      );

      setSelectedLecture(null);
      setFeedback("");
      alert("Feedback added successfully!");
    } catch (err) {
      console.error("Error adding feedback:", err);
      setError("Failed to add feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* 🔹 Top Navbar */}
      <div className="top-navbar">
        <div className="navbar-title">PRL Dashboard</div>
        <div className="navbar-actions">
          <button className="btn btn-primary" onClick={() => setActiveSection("completedLectures")}>
            Completed Lectures
          </button>
          <button className="btn btn-info" onClick={() => setActiveSection("pendingLectures")}>
            Pending Lectures
          </button>
          <button className="btn btn-success" onClick={() => setActiveSection("totalReports")}>
            Total Reports
          </button>
          <button className="btn btn-warning" onClick={() => setActiveSection("lectureStatus")}>
            Lecture Status
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveSection("recentReports")}>
            Recent Reports
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-body">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="dashboard-content">

            {/* Completed Lectures */}
            {activeSection === "completedLectures" && (
              <div className="dashboard-section">
                <h2>Completed Lectures</h2>
                <div className="dashboard-grid">
                  {lectures.filter(l => l.status === "completed").map(l => (
                    <div key={l.id} className="dashboard-card">
                      <h3>{l.topic}</h3>
                      <p><strong>Course:</strong> {l.course_name || "N/A"}</p>
                      <p><strong>Status:</strong> {l.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Lectures */}
            {activeSection === "pendingLectures" && (
              <div className="dashboard-section">
                <h2>Pending Lectures</h2>
                <div className="dashboard-grid">
                  {lectures.filter(l => l.status === "pending").map(l => (
                    <div key={l.id} className="dashboard-card">
                      <h3>{l.topic}</h3>
                      <p><strong>Course:</strong> {l.course_name || "N/A"}</p>
                      <p><strong>Status:</strong> {l.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Reports */}
            {activeSection === "totalReports" && (
              <div className="dashboard-section">
                <h2>Total Reports</h2>
                <div className="dashboard-stats">
                  <div className="stat-card">
                    <p>Completed Lectures</p>
                    <h3>{stats.completedLectures}</h3>
                  </div>
                  <div className="stat-card">
                    <p>Pending Lectures</p>
                    <h3>{stats.pendingLectures}</h3>
                  </div>
                  <div className="stat-card">
                    <p>Total Reports</p>
                    <h3>{stats.totalReports}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Lecture Status */}
            {activeSection === "lectureStatus" && (
              <div className="dashboard-section">
                <h2>Lecture Status</h2>
                <div className="dashboard-grid">
                  {lectures.map(lecture => (
                    <div key={lecture.id} className="dashboard-card">
                      <h3>{lecture.topic}</h3>
                      <p><strong>Faculty:</strong> {lecture.faculty || 'N/A'}</p>
                      <p><strong>Course:</strong> {lecture.course_name || 'N/A'}</p>
                      <p><strong>Status:</strong> {lecture.status || 'Pending'}</p>
                      <p><strong>Attendance:</strong> {lecture.attendance ?? 'N/A'}</p>

                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => toggleRatings(lecture.id)}
                      >
                        {ratingsVisible[lecture.id] ? "Hide Ratings" : "Show Ratings"}
                      </button>
                      {ratingsVisible[lecture.id] && (
                        <LectureRatings lectureId={lecture.id} showForm={false} />
                      )}

                      <div className="card-actions">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedLecture(lecture)}
                        >
                          Add Feedback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Reports */}
            {activeSection === "recentReports" && (
              <div className="dashboard-section">
                <h2>Recent Reports</h2>
                <div className="dashboard-grid">
                  {reports.length > 0 ? (
                    reports.map(r => (
                      <div key={r.id} className="dashboard-card">
                        <h3>{r.title || `Report #${r.id}`}</h3>
                        <p><strong>Date:</strong> {r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Status:</strong> {r.status || 'Pending'}</p>
                        <p><strong>PRL Feedback:</strong> {r.prl_feedback || 'N/A'}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reports available.</p>
                  )}
                </div>
              </div>
            )}

            {/* Feedback Form */}
            {selectedLecture && (
              <div className="dashboard-section">
                <h2>Add Feedback</h2>
                <div className="form-container">
                  <h3>Feedback for: {selectedLecture.topic}</h3>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Enter your feedback here..."
                  />
                  <div className="form-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSelectedLecture(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddFeedback}
                      disabled={!feedback.trim()}
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default PRLDashboard;
