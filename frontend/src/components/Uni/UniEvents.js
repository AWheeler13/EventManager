import { useState, useEffect } from 'react';
import { Tabs } from '@mantine/core';
import "../../styles/index.css";
import LargeCalendar from './LargeCalendar';  // Ensure this path is correct
const events = [
    {
        event_id: 1,
        name: "Tech Trends 2025",
        description: "A discussion on upcoming technology trends and innovations.",
        category: "tech talk",
        date_time: "2025-04-10 15:00:00",
        location_id: 101,
        contact_phone: "123-456-7890",
        contact_email: "info@techevent.com",
        visibility: "public",
        university_id: 1,
        rso_id: 1,
        created_by: 10,
        approved_by: 5
    },
    {
        event_id: 2,
        name: "Spring Fundraiser Gala",
        description: "Annual fundraising event for student scholarships.",
        category: "fundraising",
        date_time: "2025-04-15 19:00:00",
        location_id: 102,
        contact_phone: "987-654-3210",
        contact_email: "fundraiser@university.edu",
        visibility: "private",
        university_id: 1,
        rso_id: 2,
        created_by: 12,
        approved_by: 7
    },
    {
        event_id: 3,
        name: "Movie Night in the Park",
        description: "Outdoor movie screening for students and families.",
        category: "social",
        date_time: "2025-04-20 20:30:00",
        location_id: 103,
        contact_phone: "555-666-7777",
        contact_email: "events@campuslife.org",
        visibility: "public",
        university_id: 2,
        rso_id: 3,
        created_by: 15,
        approved_by: 9
    },
    {
        event_id: 4,
        name: "AI in Business Seminar",
        description: "Exploring the impact of AI on modern businesses.",
        category: "tech talk",
        date_time: "2025-05-05 14:00:00",
        location_id: 104,
        contact_phone: "444-555-6666",
        contact_email: "ai@businessforum.com",
        visibility: "rso",
        university_id: 1,
        rso_id: 5,
        created_by: 16,
        approved_by: null // Pending approval
    },
    {
        event_id: 5,
        name: "Volunteer Beach Cleanup",
        description: "Join us in keeping our beaches clean and beautiful!",
        category: "fundraising",
        date_time: "2025-05-10 09:00:00",
        location_id: 105,
        contact_phone: "333-444-5555",
        contact_email: "cleanup@environmentalrso.org",
        visibility: "rso",
        university_id: 3,
        rso_id: 8,
        created_by: 20,
        approved_by: null // Pending approval
    },
    {
        event_id: 6,
        name: "Gaming Tournament",
        description: "Competitive gaming tournament with cash prizes.",
        category: "social",
        date_time: "2025-05-20 18:00:00",
        location_id: 106,
        contact_phone: "777-888-9999",
        contact_email: "gaming@campusgames.com",
        visibility: "public",
        university_id: 2,
        rso_id: 6,
        created_by: 25,
        approved_by: 11
    }
];

export default function UniDashboard() {
    const [eventList, setEventList] = useState(events);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("PendingEvents");
    
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
    const approveEvent = async (event) => {
      const isConfirmed = alert(`Are you sure you want to approve ${event.name}?`);
    
      if (!isConfirmed) return;
    
      try {
        const response = await fetch(`https://your-api.com/user/${event.id}`, {
          method: "UPDATE",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        alert("Event approved successfully!");
  
        window.location.reload();
      } catch (error) {
        alert("Failed to delete event: " + error.message);
      }
    };
  
    const denyEvent = async (event) => {
      const isConfirmed = alert(`Are you sure you want to deny ${event.name}?`);
    
      if (!isConfirmed) return;
    
      try {
        const response = await fetch(`https://your-api.com/user/${event.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        alert("Event denied successfully!");
  
        window.location.reload();
      } catch (error) {
        alert("Failed to deny event: " + error.message);
      }
    };
  
    const saveChanges = () => {
      if (activeTab === "PendingEvents") {
        setEventList(eventList.map(event => (event.id === selectedItem.id ? selectedItem : event)));
      } else if (activeTab === "CurrentEvents") {
        setEventList(eventList.map(event => (event.id === selectedItem.id ? selectedItem : event)));
      }
      closeEditModal();
    };
  
    return (
      <div>
        <h2>Event Manager</h2>
        <div className="table-tabs">
          <button
            className={`admin-tabs ${activeTab === "PendingEvents" ? "active" : ""}`}
            onClick={() => setActiveTab("PendingEvents")}
          >
            Pending Events
          </button>
          <button
            className={`admin-tabs ${activeTab === "CurrentEvents" ? "active" : ""}`}
            onClick={() => setActiveTab("CurrentEvents")}
          >
            Current Events
          </button>
        </div>
        {activeTab === "PendingEvents" && 
            <table>
            <thead>
                <tr>
                {/* HEADINGS FOR THE DIFFERENT TABLE TABS */}
                
                    <>
                    <th>Event Name</th>
                    <th>RSO Name</th>
                    <th>Date & Time</th>
                    <th>Actions</th>
                    </>
                </tr>
            </thead>
            <tbody>
                {events.map(event => (
                    <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{event.rso_id}</td>
                    <td>{event.date_time}</td>
                    <td>
                        <button          
                        type="submit"
                        onClick={() => approveEvent(event)}>
                        Approve
                        </button>
                        <button          
                        type="submit"
                        onClick={() => denyEvent(event)}>
                        Deny
                        </button>
                    </td>
                    </tr>
                ))}
            </tbody>
            </table>
        }
        {activeTab === "CurrentEvents" &&
            <div id="CalendarDiv">
                <LargeCalendar />
            </div>
        }
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
                      case "role":
                          return (
                            <label key={key}>
                              {key}: 
                              <select name={key} value={selectedItem[key]} onChange={handleEditChange}>
                                <option value="student">Student</option>
                                <option value="event_admin">RSO Admin</option>
                              </select>
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