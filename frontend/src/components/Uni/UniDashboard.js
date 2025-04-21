import React, { useState, useEffect } from 'react';
import "../../styles/index.css";

const baseUrl = "http://localhost:5000";

export default function UniDashboard() {
  const [rsoList, setRsoList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("PendingRSO");
  
  useEffect(() => {
    if (activeTab === 'PendingRSO') {
      fetch(`${baseUrl}/api/universities/getPendingRSOList`)
        .then(response => response.json())
        .then(data => {
          setRsoList(data);
        })
        .catch(error => console.error("Error fetching rsos:", error));
    } else if (activeTab === 'PendingStudents') {
      fetch(`${baseUrl}/api/universities/getPendingStudentList`)
        .then(response => response.json())
        .then(data => {
          setStudentList(data);
        })
        .catch(error => console.error("Error fetching students:", error));
    } else if (activeTab === "RSOs") {
        fetch(`${baseUrl}/api/universities/getActiveRSOList`)
        .then(response => response.json())
        .then(data => {
          setRsoList(data);
        })
        .catch(error => console.error("Error fetching rsos:", error));
    } else if (activeTab === "Students") {
      fetch(`${baseUrl}/api/universities/getActiveStudentList`)
        .then(response => response.json())
        .then(data => {
          setStudentList(data);
        })
        .catch(error => console.error("Error fetching students:", error));
    }
  }, [activeTab]);

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

  const approveStudent = async (student) => {
    const isConfirmed = window.confirm("Are you sure you want to approve this student?");
    if (!isConfirmed) return;    

    try {
        const response = await fetch(`${baseUrl}/api/universities/approveStudent/${student.student_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        alert("Student approved successfully!");
        window.location.reload();
    } catch (error) {
        alert("Failed to approve student: " + error.message);
    }
};

const denyStudent = async (student) => {
  const isConfirmed = window.confirm("Are you sure you want to denny this student?");
  if (!isConfirmed) return;    

  try {
      const response = await fetch(`${baseUrl}/api/users/deleteUser/${student.user_id}`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      alert("Student denied successfully!");
      window.location.reload();
  } catch (error) {
      alert("Failed to deny student: " + error.message);
  }
};

const approveRSO = async (rso) => {
  const isConfirmed = window.confirm("Are you sure you want to approve this rso?");
  if (!isConfirmed) return;    

  try {
      const response = await fetch(`${baseUrl}/api/universities/approveRSO/${rso.rso_id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      alert("RSO approved successfully!");
      window.location.reload();
  } catch (error) {
      alert("Failed to approve rso: " + error.message);
  }
};

const denyRSO = async (rso) => {
  const isConfirmed = window.confirm("Are you sure you want to denny this rso?");
  if (!isConfirmed) return;    

  try {
      const response = await fetch(`${baseUrl}/api/users/deleteUser/${rso.user_id}`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      alert("RSO denied successfully!");
      window.location.reload();
  } catch (error) {
      alert("Failed to deny rso: " + error.message);
  }
};


const deleteRSO = async (rso) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this rso?");
  if (!isConfirmed) return;    

  try {
      const response = await fetch(`${baseUrl}/api/users/deleteUser/${rso.user_id}`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      alert("RSO deleted successfully!");
      window.location.reload();
  } catch (error) {
      alert("Failed to delete rso: " + error.message);
  }
};

const deleteUser = async (student) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this student?");
  if (!isConfirmed) return;    

  try {
      const response = await fetch(`${baseUrl}/api/users/deleteUser/${student.user_id}`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      alert("Student deleted successfully!");
      window.location.reload();
  } catch (error) {
      alert("Failed to delete student: " + error.message);
  }
};

  const saveChanges = () => {
    if (activeTab === "PendingRSO") {
      setRsoList(rsoList.map(rso => (rso.rso_id === selectedItem.id ? selectedItem : rso)));
    } else if (activeTab === "PendingStudents") {
      setRsoList(rsoList.map(rso => (rso.rso_id === selectedItem.id ? selectedItem : rso)));
    } else if (activeTab === "RSOs") {
      setRsoList(rsoList.map(rso => (rso.rso_id === selectedItem.id ? selectedItem : rso)));
    } else if (activeTab === "Students") {
      setStudentList(studentList.map(student => (student.student_id === selectedItem.id ? selectedItem : student)));
    }
    closeEditModal();
  };

  return (
    <div>
      <h2>University Dashboard</h2>
      <div className="table-tabs">
        <button
          className={`admin-tabs ${activeTab === "PendingRSO" ? "active" : ""}`}
          onClick={() => setActiveTab("PendingRSO")}
        >
          Pending RSOs
        </button>
        <button
          className={`admin-tabs ${activeTab === "PendingStudents" ? "active" : ""}`}
          onClick={() => setActiveTab("PendingStudents")}
        >
          Pending Students
        </button>
        <button
          className={`admin-tabs ${activeTab === "RSOs" ? "active" : ""}`}
          onClick={() => setActiveTab("RSOs")}
        >
          Manage RSOs
        </button>
        <button
          className={`admin-tabs ${activeTab === "Students" ? "active" : ""}`}
          onClick={() => setActiveTab("Students")}
        >
          Manage Students
        </button>
      </div>
      <table>
        <thead>
          <tr>
          {/* HEADINGS FOR THE DIFFERENT TABLE TABS */}
            {activeTab === "PendingRSO" && 
              <>
                <th>University Name</th>
                <th>Status</th>
              </>}
            {activeTab === "PendingStudents" && 
              <>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Status</th>
              </>}
            {activeTab === "RSOs" && 
              <>
                <th>RSO Name</th>
                <th>Status</th>
              </>}
            {activeTab === "Students" && 
              <>
                <th>First Name</th>
                <th>Last Name</th>
              </>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {/* PENDING RSO APPROVALS TAB */}
          {activeTab === "PendingRSO" && rsoList.map(rso => (
                <tr key={rso.rso_id}>
                <td>{rso.name}</td>
                <td>{rso.status}</td>
                <td>
                    <button          
                    type="submit"
                    onClick={() => approveRSO(rso)}>
                    Approve
                    </button>
                    <button          
                    type="submit"
                    onClick={() => denyRSO(rso)}>
                    Deny
                    </button>
                </td>
                </tr>
            ))}
        {/* PENDING STUDENT APPROVALS TAB */}
          {activeTab === "PendingStudents" && studentList.map(student => (
                <tr key={student.student_id}>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>                
              <td>{student.status}</td>
                <td>
                    <button          
                    type="submit"
                    onClick={() => approveStudent(student)}>
                    Approve
                    </button>
                    <button          
                    type="submit"
                    onClick={() => denyStudent(student)}>
                    Deny
                    </button>
                </td>
                </tr>
            ))}
          {/* MANAGE RSO TAB */}
          {activeTab === "RSOs" && rsoList.map(rso => (
            <tr key={rso.rso_id}>
              <td>{rso.name}</td>
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
          {/* MANAGE STUDENTS TAB */}
          {activeTab === "Students" && studentList.map(student => (
            <tr key={student.student_id}>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>
                <button          
                  type="submit"
                  onClick={() => openEditModal(student)}>
                  Edit
                </button>
                <button          
                  type="submit"
                  onClick={() => deleteUser(student)}>
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
                    case "role":
                        return (
                          <label key={key}>
                            {key}: 
                            <select name={key} value={selectedItem[key]} onChange={handleEditChange}>
                              <option value="student">Student</option>
                              <option value="rso_admin">RSO Admin</option>
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