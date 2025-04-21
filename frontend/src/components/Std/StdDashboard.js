import React, { useState } from 'react';
import "../../styles/index.css";

const rsos = [
  { id: 1, name: "Tech Club", university_id: 1, admin_id: 2, status: "pending", role: "rso_admin" },
  { id: 2, name: "Science Society", university_id: 1, admin_id: 2, status: "active", role: "member" },
  { id: 3, name: "Debate Team", university_id: 1, admin_id: 2, status: "active", role: "rso_admin" },
  { id: 4, name: "Photography Club", university_id: 1, admin_id: 2, status: "pending", role: "member" },
  { id: 5, name: "AI Research Group", university_id: 1, admin_id: 2, status: "active", role: "rso_admin" },
  { id: 6, name: "Environmental Club", university_id: 1, admin_id: 2, status: "pending", role: "member" },
  { id: 7, name: "Music Ensemble", university_id: 1, admin_id: 2, status: "active", role: "rso_admin" },
  { id: 8, name: "Cooking Club", university_id: 1, admin_id: 2, status: "pending", role: "member" }
];


export default function StdDashboard() {
  const [rsoList, setRsoList] = useState(rsos);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("PendingMembership");
  
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

  const joinRSO = async (rso) => {
    const isConfirmed = alert(`Are you sure you want to request to join ${rso.name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${rso.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      window.location.reload();
    } catch (error) {
      alert("Failed to request to join RSO: " + error.message);
    }
  };

  const leaveRSO = async (rso) => {
    const isConfirmed = alert(`Are you sure you want to leave ${rso.name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${rso.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("Successfully left RSO!");

      window.location.reload();
    } catch (error) {
      alert("Failed to leave RSO: " + error.message);
    }
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <div className="table-tabs">
      <button
          className={`admin-tabs ${activeTab === "Memberships" ? "active" : ""}`}
          onClick={() => setActiveTab("Memberships")}
        >
          Manage Memberships
        </button>
        <button
          className={`admin-tabs ${activeTab === "PendingMembership" ? "active" : ""}`}
          onClick={() => setActiveTab("PendingMembership")}
        >
          Pending Memberships
        </button>
        <button
          className={`admin-tabs ${activeTab === "RSOs" ? "active" : ""}`}
          onClick={() => setActiveTab("RSOs")}
        >
          View RSOs
        </button>
      </div>
      <table>
        <thead>
          <tr>
          {/* HEADINGS FOR THE DIFFERENT TABLE TABS */}
            {activeTab === "PendingMembership" && 
              <>
                <th>RSO Name</th>
                <th>Status</th>
              </>}
            {activeTab === "Memberships" && 
              <>
                <th>RSO Name</th>
                <th>Role</th>
                <th>Actions</th>
              </>}
            {activeTab === "RSOs" && 
              <>
                <th>RSO Name</th>
                <th>Actions</th>
              </>}
          </tr>
        </thead>
        <tbody>
        {/* MANAGE MEMBERSHIPS TAB */}
          {activeTab === "PendingMembership" && rsoList.map(rso => (
              <tr key={rso.id}>
                <td>{rso.name}</td>
                <td>{rso.status}</td>  
              </tr>
            ))}
          {/* PENDING MEMBERSHIPS TAB */}
          {activeTab === "Memberships" && rsoList.map(rso => (
            <tr key={rso.id}>
              <td>{rso.name}</td>
              <td>{rso.role}</td>
              <td>
                    <button          
                      type="submit"
                      onClick={() => leaveRSO(rso)}>
                      Leave RSO
                    </button>
              </td>        
            </tr>
          ))}
          {/* ALL RSOS TAB */}
          {activeTab === "RSOs" && rsoList.map(rso => (
            <tr key={rso.id}>
              <td>{rso.name}</td>
              <td>
                    <button          
                      type="submit"
                      onClick={() => joinRSO(rso)}>
                      Request to Join
                    </button>
              </td>        
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}