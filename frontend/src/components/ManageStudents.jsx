import React, { useEffect, useState } from "react";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    parentContact: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStudents(data.filter(u => u.role === "student"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:5000/api/admin/users/${editingId}`
        : "http://localhost:5000/api/admin/users";
      const method = editingId ? "PUT" : "POST";

      const body = {
        name: form.name,
        email: form.email,
        role: "student",
        studentDetails: {
          phone: form.phone,
          parentContact: form.parentContact
        }
      };

      if (form.password.trim() !== "") body.password = form.password;

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      setForm({ name: "", email: "", password: "", phone: "", parentContact: "" });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      name: student.name,
      email: student.email,
      password: "",
      phone: student.studentDetails?.phone || "",
      parentContact: student.studentDetails?.parentContact || ""
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await fetch(`http://localhost:5000/api/admin/users/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter students based on search input
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.studentDetails?.phone || "").includes(search) ||
    (s.studentDetails?.parentContact || "").includes(search)
  );

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Manage Students</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by name, email, phone, or parent..."
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
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
        <input placeholder="Parent Contact" value={form.parentContact} onChange={e => setForm({ ...form, parentContact: e.target.value })} style={inputStyle} />
        <button type="submit" style={submitBtnStyle(editingId)}>
          {editingId ? "Update" : "Add"} Student
        </button>
      </form>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Email</th>
            <th style={thTdStyle}>Phone</th>
            <th style={thTdStyle}>Parent</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s, idx) => (
            <tr key={s._id} style={idx % 2 === 0 ? evenRow : oddRow}>
              <td style={thTdStyle}>{s.name}</td>
              <td style={thTdStyle}>{s.email}</td>
              <td style={thTdStyle}>{s.studentDetails?.phone || ""}</td>
              <td style={thTdStyle}>{s.studentDetails?.parentContact || ""}</td>
              <td style={thTdStyle}>
                <button onClick={() => handleEdit(s)} style={actionBtnStyle("#2980b9")}>Edit</button>
                <button onClick={() => handleDelete(s._id)} style={actionBtnStyle("#c0392b")}>Delete</button>
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
  maxWidth: "950px",
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

export default ManageStudents;
