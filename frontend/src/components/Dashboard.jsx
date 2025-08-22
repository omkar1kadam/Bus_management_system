import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showBusDetails, setShowBusDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null); // ✅ Store full user details
  const [loading, setLoading] = useState(true); // ✅ Loading state

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove token
    window.location.href = "/"; // ✅ Redirect to login page
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/student/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("User Details:", data);
        setUser(data); // ✅ Store user details in state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };

    if (token) {
      fetchUserDetails();
    } else {
      console.log("No token found");
      setLoading(false);
      navigate("/"); // ✅ Redirect to login if no token
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src="/images/logo.png" alt="Logo" />
          <h2>EduPlus</h2>
        </div>
        <ul className="sidebar-menu">
          <li className="active">🏠 Dashboard</li>
          <li onClick={() => setShowBusDetails(true)}>🚌 Bus Details</li>
          <li onClick={() => navigate("/live-bus-tracking")}>
            📍 Live Tracking
          </li>
          <li onClick={() => navigate("/fee-management")}>💳 Fee Management</li>
          <li onClick={() => setShowNotifications(true)}>🔔 Notifications</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          {loading ? (
            <h1>Loading...</h1>
          ) : user ? (
            <h1>Welcome, {user.name}!</h1>
          ) : (
            <h1>Error loading user</h1>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {!loading && user && (
          <div className="user-info">
            <h2>Your Details</h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>

            {user.role === "student" && user.studentDetails && (
              <div>
                <h3>Student Details</h3>
                <ul>
                  <li>
                    <strong>Roll Number:</strong>{" "}
                    {user.studentDetails.rollNumber}
                  </li>
                  <li>
                    <strong>Phone:</strong> {user.studentDetails.phone}
                  </li>
                  <li>
                    <strong>Parent Contact:</strong>{" "}
                    {user.studentDetails.parentContact}
                  </li>
                  <li>
                    <strong>Bus Number:</strong> {user.studentDetails.busNumber}
                  </li>
                  <li>
                    <strong>Route:</strong> {user.studentDetails.route}
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bus Details Modal */}
      {showBusDetails && user?.studentDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowBusDetails(false)}
            >
              ×
            </button>
            <h2 className="modal-title">🚌 Bus Details</h2>
            <div className="modal-table-container">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Bus No</th>
                    <th>Route</th>
                    <th>Driver</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{user.studentDetails.busNumber}</td>
                    <td>{user.studentDetails.route}</td>
                    <td>{user.studentDetails.driver || "N/A"}</td>
                    <td>
                      {user.studentDetails.driverContact ? (
                        <a
                          href={`tel:${user.studentDetails.driverContact}`}
                          className="contact-link"
                        >
                          {user.studentDetails.driverContact}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              className="modal-action-btn"
              onClick={() => setShowBusDetails(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notifications Sidebar */}
      {showNotifications && (
        <div className="notifications-overlay">
          <div className="notifications-sidebar">
            <button
              className="notifications-close"
              onClick={() => setShowNotifications(false)}
            >
              ×
            </button>
            <h2 className="notifications-title">🔔 Notifications</h2>
            <ul className="notifications-list">
              <li>
                🚍 Bus {user?.studentDetails?.busNumber} delayed by 10 mins
              </li>
              <li>💰 Fee due date: 25th Aug</li>
              <li>📅 New timetable updated</li>
            </ul>
            <button
              className="notifications-action-btn"
              onClick={() => setShowNotifications(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
