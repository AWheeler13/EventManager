import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    "en-US" : require("date-fns/locale/en-US")
};

const localizer = dateFnsLocalizer({
   format,
   parse,
   startOfWeek,
   getDay,
   locales
});

const baseUrl = "http://localhost:5000";

function LargeCalendar() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [newRating, setNewRating] = useState("");
    const [avgRating, setAvgRating] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('userToken');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?.user_id;

    useEffect(() => {
        fetchEventData();
    }, []);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
        fetchComments(event.id);
    };

    // Close modal
    const closeEventModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
        setComments([]);
    };

    const formatEvents = (eventList) => {
        if (!eventList || eventList.length === 0) return;
    
        const formattedEvents = eventList.map(event => {
            const { 
                date_time, 
                event_id, 
                name, 
                description, 
                category, 
                building_id, 
                contact_email, 
                contact_phone 
            } = event;
            
            // Split date and time into the correct format
            const parsedDate = new Date(date_time); // Convert ISO string to Date object
            
            return {
                id: event_id,
                title: name,
                start: parsedDate, // Start time from the parsed Date object
                end: new Date(parsedDate.getTime() + 60 * 60 * 1000), // Default 1-hour duration
                category: category,
                description: description,
                location_id: building_id, // Using building_id as location_id
                contact_email: contact_email,
                contact_phone: contact_phone
            };
        });
    
        setEvents(formattedEvents); // Update the state with the formatted events
    };     
    
    const getEventList = async () =>
    {
        if (!token) {
            setErrorMessage('Error: Authentication token is missing. Please log in again.');
            return;
        }
    
        if (!userId) {
            setErrorMessage('Error: Unable to retrieve user information. Please try again.');
            return;
        }
        try
        {
            const response = await fetch(`${baseUrl}/api/events/getStudentLevelEvents/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            var res = await response.json();
            return res.data;
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    };

    const fetchEventData = async () => {
        var data;
        data = await getEventList();
        formatEvents(data);          
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const fetchComments = async (eventId) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/comments/getCommentList/${eventId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const data = await response.json();
            setComments(data.comments);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
  
    const handleAddComment = async () => {
        if (!comment || !selectedEvent) {
            alert("Please enter a comment.");
            return;
        }
    
        try {
            const response = await fetch(`${baseUrl}/api/comments/addComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    event_id: selectedEvent.id,
                    user_id: userId,
                    comment: comment
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to add comment");
            }
    
            const result = await response.json();
            console.log("Comment added:", result);
            alert("Comment added successfully!");
    
            setComment("");
            fetchComments(selectedEvent.id);
        } catch (error) {
            console.error(error);
            alert("Error adding comment");
        }
    };

    const handleEditComment = async (commentId) => {
        try {
            const response = await fetch(`${baseUrl}/api/comments/updateComment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    comment_id: commentId,
                    comment: editedComment,
                    user_id: userId
                }),
            });
    
            if (!response.ok) throw new Error("Edit failed");
    
            alert("Comment updated successfully.");
            setEditingCommentId(null);
            setEditedComment("");
            fetchComments(selectedEvent.id); // Refresh comments
        } catch (error) {
            console.error(error);
            alert("Error updating comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`${baseUrl}/api/comments/deleteComment`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    comment_id: commentId,
                    user_id: userId
                }),
            });
    
            if (!response.ok) throw new Error("Delete failed");
    
            alert("Comment deleted successfully.");
            fetchComments(selectedEvent.id); // Refresh comments
        } catch (error) {
            console.error(error);
            alert("Error deleting comment");
        }
    };    

    const fetchAvgRating = async (eventId) => {
        try {
            const response = await fetch(`${baseUrl}/api/ratings/getAverage/${eventId}`);
            const data = await response.json();
            setAvgRating(data.average_rating);
        } catch (err) {
            console.error("Failed to fetch average rating:", err);
        }
    };

    const handleAddRating = async () => {
        if (!newRating || !selectedEvent) return;

        try {
            const response = await fetch(`${baseUrl}/api/ratings/addOrUpdateRating`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    event_id: selectedEvent.id,
                    user_id: userId,
                    rating: Number(newRating)
                })
            });

            if (!response.ok) throw new Error("Failed to add/update rating");

            alert("Rating submitted successfully");
            fetchAvgRating(selectedEvent.id);
        } catch (error) {
            console.error(error);
            alert("Error submitting rating");
        }
    };

    return (
        <div id="CalendarDiv">
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            <Calendar 
                className="LargeCalendar" 
                id="LargeCalendar" 
                localizer={localizer} 
                events={events} 
                startAccessor="start" 
                endAccessor="end" 
                views={['month', 'week', 'day']} 
                onSelectEvent={handleEventClick}
            />

            {/* Event Details Modal */}
            {isModalOpen && selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeEventModal}>&times;</button>
                        <h2 className="modal-title">{selectedEvent.name}</h2>

                        <p><strong>Event Name:</strong> {selectedEvent.category}</p>
                        <p><strong>Date:</strong> {format(selectedEvent.start, "yyyy-MM-dd")}</p>
                        <p><strong>Time:</strong> {format(selectedEvent.start, "hh:mm a")} - {format(selectedEvent.end, "hh:mm a")}</p>
                        <p><strong>Category:</strong> {selectedEvent.category}</p>
                        <p><strong>Description:</strong> {selectedEvent.description}</p>
                        <p><strong>Location:</strong> {selectedEvent.location_id}</p>
                        <p><strong>Contact Email:</strong> {selectedEvent.contact_email}</p>
                        <p><strong>Contact Phone:</strong> {selectedEvent.contact_email}</p>
                        <hr />

                        <h3>Comments</h3>
                        <div>
                            {comments.map((c) => (
                                <div 
                                    key={c.comment_id} 
                                    style={{
                                        borderBottom: '1px solid #ccc',
                                        padding: '10px 0'
                                    }}
                                >
                                    {editingCommentId === c.comment_id ? (
                                        <div>
                                            <input 
                                                value={editedComment} 
                                                onChange={(e) => setEditedComment(e.target.value)} 
                                            />
                                            <button onClick={() => handleEditComment(c.comment_id)}>Save</button>
                                            <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span> {c.comment}</span>
                                            {c.user_id === userId && (
                                                <>
                                                    <button 
                                                        onClick={() => {
                                                            setEditingCommentId(c.comment_id);
                                                            setEditedComment(c.comment);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteComment(c.comment_id)}>Delete</button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <hr />
                        <label>
                            Add a Comment
                            <input 
                                type="text" 
                                name="newComment" 
                                value={comment} 
                                onChange={handleCommentChange} 
                            />
                        </label>
                        <button className="save-btn" onClick={handleAddComment}>Add Comment</button>

                        <h3>Rate this Event</h3>
                        {avgRating !== null && <p>Average Rating: {avgRating} / 5</p>}
                        <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
                            <option value="">Select Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                        <button className="save-btn" onClick={handleAddRating}>Add Rating</button>
                    </div>
                </div>
            )}
        </div>
    );
}


export default LargeCalendar;