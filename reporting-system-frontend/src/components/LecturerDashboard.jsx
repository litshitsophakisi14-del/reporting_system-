import { useState, useEffect } from "react";
import "../styles/LectureDashboard.css"; 
import LectureForm from "./LectureForm";
import LectureRatings from "./LectureRatings";
import { lectureService, reportService } from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

function LecturerDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchLecture, setSearchLecture] = useState("");
  const [searchReport, setSearchReport] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const lecturesResponse = await lectureService.getLectures();
      const reportsResponse = await reportService.getReports();
      setLectures(lecturesResponse.data || []);
      setReports(reportsResponse.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      navigate("/");
    } else {
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, [navigate]);

  const closeModal = () => {
    setSelectedLecture(null);
    setSelectedReport(null);
  };

  const handleLectureSubmitSuccess = async () => {
    setShowForm(false);
    await fetchDashboardData();
    alert("Lecture submitted successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const filteredLectures = lectures.filter((l) =>
    l.topic?.toLowerCase().includes(searchLecture.toLowerCase())
  );

  const filteredReports = reports.filter((r) =>
    r.title?.toLowerCase().includes(searchReport.toLowerCase())
  );

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  };

  if (!isLoggedIn) {
    return null; 
  }

  return (
    <div className="dashboard-container">
      {/* 🔹 Top Navbar */}
      <div className="top-navbar">
        <div className="navbar-title">Lecturer Dashboard</div>
        <div className="navbar-actions">
          {/* Buttons moved here */}
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide Form" : "Add New Lecture"}
          </button>
          <button 
            className="btn btn-info" 
            onClick={() => alert("Showing My Lectures Section")}
          >
            My Lectures
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => alert("Showing Recent Reports Section")}
          >
            Recent Reports
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 Dashboard Body */}
      <div className="dashboard-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {showForm && <LectureForm onSuccess={handleLectureSubmitSuccess} />}

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            {/* Lectures Section */}
            <div id="lectures-section" className="dashboard-section">
              <h2>My Lectures</h2>
              <div className="mb-2 d-flex gap-2">
                <input
                  type="text"
                  placeholder="Search Lectures..."
                  value={searchLecture}
                  onChange={(e) => setSearchLecture(e.target.value)}
                  className="form-control"
                />
                <button
                  className="btn btn-success"
                  onClick={() => exportToExcel(filteredLectures, "Lectures.xlsx")}
                >
                  Download Excel
                </button>
              </div>

              <div className="dashboard-grid">
                {filteredLectures.map((lecture) => (
                  <div key={lecture.id} className="dashboard-card">
                    <h3>{lecture.topic || "Untitled Lecture"}</h3>
                    <LectureRatings lectureId={lecture.id} showForm={false} />
                    <div className="card-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedLecture(lecture)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports Section */}
            <div id="reports-section" className="dashboard-section">
              <h2>Recent Reports</h2>
              <div className="mb-2 d-flex gap-2">
                <input
                  type="text"
                  placeholder="Search Reports..."
                  value={searchReport}
                  onChange={(e) => setSearchReport(e.target.value)}
                  className="form-control"
                />
                <button
                  className="btn btn-success"
                  onClick={() => exportToExcel(filteredReports, "Reports.xlsx")}
                >
                  Download Excel
                </button>
              </div>
              <div className="dashboard-grid">
                {filteredReports.map((report) => (
                  <div key={report.id} className="dashboard-card">
                    <h3>{report.title || `Report #${report.id}`}</h3>
                    <div className="card-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedReport(report)}
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modals */}
            {selectedLecture && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>{selectedLecture.topic}</h2>
                  <p><strong>Faculty:</strong> {selectedLecture.faculty || 'N/A'}</p>
                  <p><strong>Course:</strong> {selectedLecture.course_name || 'N/A'}</p>
                  <button className="btn btn-secondary mt-3" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            )}

            {selectedReport && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>{selectedReport.title || `Report #${selectedReport.id}`}</h2>
                  <p><strong>Status:</strong> {selectedReport.status || 'Pending'}</p>
                  <p><strong>PRL Feedback:</strong> {selectedReport.prl_feedback || 'N/A'}</p>
                  <button className="btn btn-secondary mt-3" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LecturerDashboard;
