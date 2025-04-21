import { useState, useEffect } from 'react';
import "../../styles/index.css";

const baseUrl = "http://localhost:5000";

export default function StdSettings() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [rsoData, setRsoData] = useState({
    rso_name: '',
    email_1: '',
    email_2: '',
    email_3: '',
    email_4: ''
  });

  const [userMessage, setUserMessage] = useState('');
  const [rsoMessage, setRsoMessage] = useState('');

  const token = localStorage.getItem('userToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userId = userInfo?.user_id;

  const handleChange = (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRsoChange = (e) => {
    setRsoData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!token || !userId) return;

    try {
      const response = await fetch(`${baseUrl}/api/users/updateUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...user, user_id: userId })
      });

      const result = await response.json();
      setUserMessage(response.ok ? 'Settings updated successfully!' : result.message || 'Failed to update settings.');
    } catch (error) {
      setUserMessage('Error updating settings.');
      console.error(error);
    }
  };

  const handleRSOSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setRsoMessage('Error: Authentication token is missing. Please log in again.');
      return;
    }
  
    if (!userId) {
      setRsoMessage('Error: Unable to retrieve user information. Please try again.');
      return;
    }

    try {
      const uniResponse = await fetch(`${baseUrl}/api/students/getUniId/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!uniResponse.ok) throw new Error('Failed to get University ID');
      const { university_id: uniId } = await uniResponse.json();

      const rsoResponse = await fetch(`${baseUrl}/api/rsos/createRSO`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: rsoData.rso_name,
          university_id: uniId,
          rso_admin: userId
        })
      });

      if (!rsoResponse.ok) throw new Error('Failed to create RSO');
      const { rso_id: rsoId } = await rsoResponse.json();

      setRsoMessage('RSO request successfully sent! Now adding members...');

      const emails = [rsoData.email_1, rsoData.email_2, rsoData.email_3, rsoData.email_4].filter(Boolean);

      for (const email of emails) {
        try {
          const userResponse = await fetch(`${baseUrl}/api/users/getUserId/${email}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!userResponse.ok) {
            console.warn(`Failed to get user ID for ${email}`);
            continue;
          }

          const { user_id: memberId } = await userResponse.json();

          const joinResponse = await fetch(`${baseUrl}/api/students/joinRSO`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ user_id: memberId, rso_id: rsoId })
          });

          if (!joinResponse.ok) {
            console.warn(`Failed to add ${email} to RSO`);
          }
        } catch (error) {
          console.error(`Error processing ${email}:`, error);
        }
      }

      setRsoMessage('RSO created and members added successfully!');
    } catch (error) {
      setRsoMessage('Error processing RSO request.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <div className="settings-container">
        <h3>Sign In Information</h3>
        {userMessage && <p className="userMessage">{userMessage}</p>}
        <form onSubmit={handleUserSubmit}>
          {["email", "password"].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.replace("_", " ")}:</label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                name={field}
                value={user[field] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit">Save Changes</button>
        </form>
      </div>
      <div className="settings-container">
        <h3>Request to Form RSO</h3>
        {rsoMessage && <p className="rsoMessage">{rsoMessage}</p>}
        <form onSubmit={handleRSOSubmit}>
          {["rso_name", "email_1", "email_2", "email_3", "email_4"].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.replace("_", " ")}:</label>
              <input
                type="text"
                id={field}
                name={field}
                value={rsoData[field] || ''}
                onChange={handleRsoChange}
              />
            </div>
          ))}
          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}