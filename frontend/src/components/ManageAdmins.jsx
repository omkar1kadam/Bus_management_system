import React, { useEffect, useState } from "react";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAdmins(data.filter(u => u.role === "admin"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:5000/api/admin/users/${editingId}`
        : "http://localhost:5000/api/admin/users";
      const method = editingId ? "PUT" : "POST";

      const body = { name: form.name, email: form.email, role: "admin" };
      if (form.password.trim() !== "") body.password = form.password;

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      setForm({ name: "", email: "", password: "" });
      setEditingId(null);
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (admin) => {
    setEditingId(admin._id);
    setForm({ name: admin.name, email: admin.email, password: "" });
  };

  const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this admin?")) {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete admin");
      }

      fetchAdmins(); // refresh list
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("Failed to delete admin: " + err.message);
    }
  }
};


  // Filter admins based on search input
  const filteredAdmins = admins.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Manage Admins</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={searchStyle}
      />

      <form onSubmit={handleSubmit} style={formStyle}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
        <input
          placeholder={editingId ? "Leave blank to keep password" : "Password"}
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required={!editingId}
          style={inputStyle}
        />
        <button type="submit" style={submitBtnStyle(editingId)}>
          {editingId ? "Update" : "Add"} Admin
        </button>
      </form>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Email</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map((a, idx) => (
            <tr key={a._id} style={idx % 2 === 0 ? evenRow : oddRow}>
              <td style={thTdStyle}>{a.name}</td>
              <td style={thTdStyle}>{a.email}</td>
              <td style={thTdStyle}>
                <button onClick={() => handleEdit(a)} style={actionBtnStyle("#2980b9")}>Edit</button>
                <button onClick={() => handleDelete(a._id)} style={actionBtnStyle("#c0392b")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: "650px",
  margin: "50px auto",
  padding: "25px",
  borderRadius: "12px",
  backgroundColor: "#f4f6f8",
  boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
};

const headerStyle = { textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "28px" };

const searchStyle = {
  width: "96.5%",
  padding: "12px 15px",
  marginBottom: "25px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none"
};

const formStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "35px",
  justifyContent: "space-between"
};

const inputStyle = {
  padding: "12px",
  flex: "1 1 200px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "14px"
};

const submitBtnStyle = (editingId) => ({
  padding: "12px 25px",
  backgroundColor: editingId ? "#f39c12" : "#27ae60",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.3s",
  minWidth: "140px",
  fontWeight: "bold"
});

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const theadStyle = { backgroundColor: "#2c3e50", color: "white", fontSize: "15px" };

const thTdStyle = { padding: "14px 12px", textAlign: "center", fontSize: "14px" };

const actionBtnStyle = (bgColor) => ({
  padding: "6px 12px",
  margin: "0 5px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.3s",
  fontSize: "13px"
});

const evenRow = { backgroundColor: "#f9f9f9", transition: "0.3s" };
const oddRow = { backgroundColor: "#fff", transition: "0.3s" };

export default ManageAdmins;
