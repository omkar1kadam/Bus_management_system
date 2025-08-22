import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [showBusManagement, setShowBusManagement] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null); // Store admin details
  const [loading, setLoading] = useState(true); // Loading state

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    window.location.href = "/"; // Redirect to login
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Admin Details:", data);
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin details:", error);
        setLoading(false);
      }
    };

    if (token) {
      fetchUserDetails();
    } else {
      console.log("No token found");
      setLoading(false);
      navigate("/"); // Redirect if no token
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src="/images/logo.png" alt="Logo" />
          <h2>EduPlus Admin</h2>
        </div>
        <ul className="sidebar-menu">
          <li className="active">🏠 Dashboard</li>
          <li onClick={() => setShowBusManagement(true)}>🚌 Manage Buses</li>
          <li onClick={() => navigate("/manage-students")}>👨‍🎓 Manage Students</li>
          <li onClick={() => navigate("/manage-admins")}>👨‍🎓 Manage Admins</li>
          <li onClick={() => navigate("/fee-management")}>💳 Manage Fees</li>
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
            <h1>Error loading admin</h1>
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
          </div>
        )}
      </div>

      {/* Bus Management Modal */}
      {showBusManagement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowBusManagement(false)}
            >
              ×
            </button>
            <h2 className="modal-title">🚌 Bus Management</h2>
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
                  {user?.buses && user.buses.length > 0 ? (
                    user.buses.map((bus, index) => (
                      <tr key={index}>
                        <td>{bus.busNumber}</td>
                        <td>{bus.route}</td>
                        <td>{bus.driver || "N/A"}</td>
                        <td>
                          {bus.driverContact ? (
                            <a href={`tel:${bus.driverContact}`} className="contact-link">
                              {bus.driverContact}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No buses available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              className="modal-action-btn"
              onClick={() => setShowBusManagement(false)}
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
              <li>🚍 Bus delay reported</li>
              <li>💰 Fees pending for some students</li>
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

export default DashboardAdmin;
