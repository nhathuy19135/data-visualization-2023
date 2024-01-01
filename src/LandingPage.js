// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import "./LandingPage.css"

const LandingPage = () => {
  const members = [
    { name: 'Nguyen Nhat Huy', id: 'ITITIU19135' },
    { name: 'Nguyen Tri Nhan', id: 'ITITIU19170' },
    { name: 'Pham Trung Tin', id: 'ITDSIU19019' },
    { name: 'Nguyen Quoc Hong Ky', id: 'ITITIU19151' },
    // Add more members as needed
  ];

  return (
    <div className="landing-page">
      <h1 className="title">Vietnam Weather Data</h1>
      <p className="subtitle">DataScience and Data Visualization </p>
      <Link to="/dashboard" className="link">DASHBOARD</Link>
      <table className="members-table">
        <thead>
          <tr>
            <th align=''>Name</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td align='center'>{member.name}</td>
              <td align='center'>{member.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LandingPage;