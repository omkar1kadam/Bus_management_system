import React from "react";

const FeeManagement = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Fee Management</h1>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Term</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Term 1</td>
            <td>₹20,000</td>
            <td>Paid</td>
          </tr>
          <tr>
            <td>Term 2</td>
            <td>₹20,000</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FeeManagement;
