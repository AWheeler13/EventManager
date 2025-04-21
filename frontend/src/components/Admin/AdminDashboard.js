import React, { useState } from 'react';
import "../../styles/index.css";

const universities = [
  { id: 1, name: "University A", location: "City A", description: "A top university", num_students: 20000, url: "www.UniA.com", status: "pending" },
  { id: 2, name: "University B", location: "City B", description: "A great place to study", num_students: 15000, url: "www.UniB.com", status: "approved" },
  { id: 3, name: "University C", location: "City C", description: "Well known for research", num_students: 18000, url: "www.UniC.com", status: "pending" },
  { id: 4, name: "University D", location: "City D", description: "Innovative research and development", num_students: 25000, url: "www.UniD.com", status: "approved" },
  { id: 5, name: "University E", location: "City E", description: "Focus on global studies and humanities", num_students: 12000, url: "www.UniE.com", status: "approved" },
  { id: 6, name: "University F", location: "City F", description: "Famous for its arts programs", num_students: 22000, url: "www.UniF.com", status: "pending" },
  { id: 7, name: "University G", location: "City G", description: "Leading in engineering and technology", num_students: 28000, url: "www.UniG.com", status: "approved" },
  { id: 8, name: "University H", location: "City H", description: "Committed to sustainability and environment", num_students: 16000, url: "www.UniH.com", status: "pending" },
  { id: 9, name: "University I", location: "City A", description: "A top university", num_students: 20000, url: "www.UniA.com", status: "pending" },
  { id: 10, name: "University J", location: "City B", description: "A great place to study", num_students: 15000, url: "www.UniB.com", status: "approved" },
  { id: 11, name: "University K", location: "City C", description: "Well known for research", num_students: 18000, url: "www.UniC.com", status: "pending" },
  { id: 12, name: "University L", location: "City D", description: "Innovative research and development", num_students: 25000, url: "www.UniD.com", status: "approved" },
  { id: 13, name: "University M", location: "City E", description: "Focus on global studies and humanities", num_students: 12000, url: "www.UniE.com", status: "approved" },
  { id: 14, name: "University N", location: "City F", description: "Famous for its arts programs", num_students: 22000, url: "www.UniF.com", status: "pending" },
  { id: 15, name: "University O", location: "City G", description: "Leading in engineering and technology", num_students: 28000, url: "www.UniG.com", status: "approved" },
  { id: 16, name: "University P", location: "City H", description: "Committed to sustainability and environment", num_students: 16000, url: "www.UniH.com", status: "pending" }
];

const rsos = [
  { id: 1, name: "Tech Club", university_id: 1, admin_id: 1, status: "pending" },
  { id: 2, name: "Science Society", university_id: 2, admin_id: 2, status: "active" },
  { id: 3, name: "Debate Team", university_id: 3, admin_id: 3, status: "active" },
  { id: 4, name: "Photography Club", university_id: 4, admin_id: 4, status: "pending" },
  { id: 5, name: "AI Research Group", university_id: 5, admin_id: 5, status: "active" },
  { id: 6, name: "Environmental Club", university_id: 6, admin_id: 6, status: "pending" },
  { id: 7, name: "Music Ensemble", university_id: 7, admin_id: 7, status: "active" },
  { id: 8, name: "Cooking Club", university_id: 8, admin_id: 8, status: "pending" }
];

const users = [
  { id: 1, first_name: "John", last_name: "Doe", email: "johndoe@example.com", role: "admin", university_id: 1 },
  { id: 2, first_name: "Jane", last_name: "Smith", email: "janesmith@example.com", role: "admin", university_id: 2 },
  { id: 3, first_name: "Alex", last_name: "Johnson", email: "alexjohnson@example.com", role: "university", university_id: 3 },
  { id: 4, first_name: "Emily", last_name: "Brown", email: "emilybrown@example.com", role: "rso", university_id: 4 },
  { id: 5, first_name: "Michael", last_name: "Davis", email: "michaeldavis@example.com", role: "rso", university_id: 5 },
  { id: 6, first_name: "Sarah", last_name: "Miller", email: "sarahmiller@example.com", role: "rso", university_id: 6 },
  { id: 7, first_name: "David", last_name: "Wilson", email: "davidwilson@example.com", role: "student", university_id: 7 },
  { id: 8, first_name: "Sophia", last_name: "Martinez", email: "sophiamartinez@example.com", role: "student", university_id: 8 }
];


export default function AdminDashboard() {
  const [uniList, setUniList] = useState(universities);
  const [rsoList, setRsoList] = useState(rsos);
  const [userList, setUserList] = useState(users);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Pending");
  
  const openEditModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleEditChange = (e) => {
    setSelectedItem({ ...selectedItem, [e.target.name]: e.target.value });
  };

  const approveUniversity = async (uni) => {
    const isConfirmed = alert(`Are you sure you want to approve ${uni.name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${uni.id}`, {
        method: "UPDATE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("University approved successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to delete university: " + error.message);
    }
  };

  const denyUniversity = async (uni) => {
    const isConfirmed = alert(`Are you sure you want to deny ${uni.name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${uni.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("University denied successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to deny university: " + error.message);
    }
  };

  const deleteUniversity = async (uni) => {
    const isConfirmed = alert(`Are you sure you want to delete ${uni.name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/universities/${uni.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("University deleted successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to delete university: " + error.message);
    }
  };

  const deleteRSO = async (rso) => {
    const isConfirmed = alert(`Are you sure you want to delete ${rso.name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/rso/${rso.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("University deleted successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to delete rso: " + error.message);
    }
  };

  const deleteUser = async (user) => {
    const isConfirmed = alert(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("University deleted successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to delete user: " + error.message);
    }
  };

  const saveChanges = () => {
    if (activeTab === "Universities") {
      setUniList(uniList.map(uni => (uni.id === selectedItem.id ? selectedItem : uni)));
    } else if (activeTab === "RSOs") {
      setRsoList(rsoList.map(rso => (rso.id === selectedItem.id ? selectedItem : rso)));
    } else if (activeTab === "Users") {
      setUserList(userList.map(user => (user.id === selectedItem.id ? selectedItem : user)));
    }
    closeEditModal();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="table-tabs">
        <button
          className={`admin-tabs ${activeTab === "Pending" ? "active" : ""}`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending University Approvals
        </button>
        <button
          className={`admin-tabs ${activeTab === "Universities" ? "active" : ""}`}
          onClick={() => setActiveTab("Universities")}
        >
          Manage Universities
        </button>
        <button
          className={`admin-tabs ${activeTab === "RSOs" ? "active" : ""}`}
          onClick={() => setActiveTab("RSOs")}
        >
          Manage RSO
        </button>
        <button
          className={`admin-tabs ${activeTab === "Users" ? "active" : ""}`}
          onClick={() => setActiveTab("Users")}
        >
          Manage Users
        </button>
      </div>
      <table>
        <thead>
          <tr>
          {/* HEADINGS FOR THE DIFFERENT TABLE TABS */}
            {activeTab === "Pending" && 
              <>
                <th>University Name</th>
                <th>Status</th>
              </>}
            {activeTab === "Universities" && 
              <>
                <th>University Name</th>
                <th>Location</th>
                <th>Description</th>
                <th>Number of Students</th>
                <th>Website</th>
              </>}
            {activeTab === "RSOs" && 
              <>
                <th>RSO Name</th>
                <th>University Name</th>
                <th>Status</th>
              </>}
            {activeTab === "Users" && 
              <>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
              </>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {/* PENDING UNIVERSITY APPROVALS TAB */}
        {activeTab === "Pending" && uniList.map(uni => (
            <tr key={uni.id}>
              <td>{uni.name}</td>
              <td>{uni.status}</td>
              <td>
                <button          
                  type="submit"
                  onClick={() => approveUniversity(uni)}>
                  Approve
                </button>
                <button          
                  type="submit"
                  onClick={() => denyUniversity(uni)}>
                  Deny
                </button>
              </td>
            </tr>
          ))}
          {/* MANAGE UNIVERSITIES TAB */}
          {activeTab === "Universities" && uniList.map(uni => (
            <tr key={uni.id}>
              <td>{uni.name}</td>
              <td>{uni.location}</td>
              <td>{uni.description}</td>
              <td>{uni.num_students}</td>
              <td><a href="{{ uni.url }}">Link</a></td>
              <td>
                <button          
                  type="submit"
                  onClick={() => openEditModal(uni)}>
                  Edit
                </button>
                <button          
                  type="submit"
                  onClick={() => deleteUniversity(uni)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {/* MANAGE RSO TAB */}
          {activeTab === "RSOs" && rsoList.map(rso => (
            <tr key={rso.id}>
              <td>{rso.name}</td>
              <td>{rso.university_id}</td>
              <td>{rso.status}</td>
              <td>
                <button          
                  type="submit"
                  onClick={() => openEditModal(rso)}>
                  Edit
                </button>
                <button          
                  type="submit"
                  onClick={() => deleteRSO(rso)}>
                  Delete
                </button>
              </td>            
            </tr>
          ))}
          {/* MANAGE USERS TAB */}
          {activeTab === "Users" && userList.map(user => (
            <tr key={user.id}>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button          
                  type="submit"
                  onClick={() => openEditModal(user)}>
                  Edit
                </button>
                <button          
                  type="submit"
                  onClick={() => deleteUser(user)}>
                  Delete
                </button>
              </td>            
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeEditModal}>&times;</button>
            <h2 className="modal-title">Edit Details</h2>
            {selectedItem && Object.keys(selectedItem).map((key) => {
              switch (key) {
                case "name":
                  return (
                    <label key={key}>
                      {key}: 
                      <input type="name" name={key} value={selectedItem[key]} onChange={handleEditChange} />
                    </label>
                  );
                case "first_name":
                  return (
                    <label key={key}>
                      {key}: 
                      <input type="first_name" name={key} value={selectedItem[key]} onChange={handleEditChange} />
                    </label>
                  );
                case "last_name":
                  return (
                    <label key={key}>
                      {key}: 
                      <input type="last_name" name={key} value={selectedItem[key]} onChange={handleEditChange} />
                    </label>
                  );
                case "status":
                  return (
                    <label key={key}>
                      {key}: 
                      <select name={key} value={selectedItem[key]} onChange={handleEditChange}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                      </select>
                    </label>
                  );
                case "url":
                  return (
                    <label key={key}>
                      {key}: 
                      <input type="url" name={key} value={selectedItem[key]} onChange={handleEditChange} />
                    </label>
                  );
                case "num_students":
                  return (
                    <label key={key}>
                      {key}: 
                      <input type="number" name={key} value={selectedItem[key]} onChange={handleEditChange} />
                    </label>
                  );
                case "university_id":
                  return (
                    <label key={key}>
                      University: 
                      <select name={key} value={selectedItem[key]} onChange={handleEditChange}>
                        {universities.map((uni) => (
                          <option key={uni.id} value={uni.id}>{uni.name}</option>
                        ))}
                      </select>
                    </label>
                  );
                case "email":
                  return (
                    <label key={key}>
                      {key}: 
                      <input type="email" name={key} value={selectedItem[key]} onChange={handleEditChange} />
                    </label>
                  );
                default:

              }
            })}
            <div className="modal-buttons">
              <button className="save-btn" onClick={saveChanges}>Save</button>
              <button className="cancel-btn" onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}