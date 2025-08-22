import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BusMap from "../components/BusMap";

const LiveBusTracking = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // redirect to login
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/student/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <h1>Loading...</h1>;
  if (!user || !user.studentDetails) return <h1>No student data found</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📍 Live Bus Tracking</h1>
      <h3>Bus Number: {user.studentDetails.busNumber}</h3>
      <BusMap busId={user.studentDetails.busNumber} />
    </div>
  );
};

export default LiveBusTracking;
