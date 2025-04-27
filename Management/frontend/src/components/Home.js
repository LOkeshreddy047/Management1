import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to the Student Management System</h1>
      <p>Use the navigation links below to manage student records.</p>
      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
        <Link to="/students" style={linkStyle}>Student List</Link>
        <Link to="/add-student" style={linkStyle}>Add Student</Link>
      </div>
    </div>
  );
}

const linkStyle = {
  display: 'inline-block',
  margin: '0 15px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer'
};

export default Home;
