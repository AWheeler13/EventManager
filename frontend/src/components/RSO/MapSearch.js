import React, { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import "../../styles/index.css";

const baseUrl = "http://localhost:5000";

type Poi = { key: string; id: number; location: google.maps.LatLngLiteral };

const locations: Poi[] = [
    { key: 'su', id: 1, location: { lat: 28.601956, lng: -81.200512 } },
    { key: 'lib', id: 2, location: { lat: 28.600551, lng: -81.201251 } },
    { key: 'sciences', id: 3, location: { lat: 28.600991, lng: -81.200120 } },
    { key: 'ba1', id: 4, location: { lat: 28.601018, lng: -81.199138 } },
    { key: 'ba2', id: 5, location: { lat: 28.600806, lng: -81.198682 } },
    { key: 'eng1', id: 6, location: { lat: 28.601536, lng: -81.198290 } },
    { key: 'eng2', id: 7, location: { lat: 28.601823, lng: -81.198466 } },
    { key: 'hs1', id: 8, location: { lat: 28.603016, lng: -81.198656 } },
    { key: 'hs2', id: 9, location: { lat: 28.603181, lng: -81.198161 } },
    { key: 'global', id: 10, location: { lat: 28.604644, lng: -81.197940 } },
    { key: 'cb1', id: 11, location: { lat: 28.603720, lng: -81.200447 } },
    { key: 'cb2', id: 12, location: { lat: 28.604219, lng: -81.200018 } },
    { key: 'psy', id: 13, location: { lat: 28.604820, lng: -81.199829 } },
    { key: 'arena', id: 14, location: { lat: 28.607334, lng: -81.197283 } },
    { key: 'nsc', id: 15, location: { lat: 28.603960, lng: -81.202879 } },
    { key: 'vab', id: 16, location: { lat: 28.602809, lng: -81.203054 } },
    { key: 'bhc', id: 17, location: { lat: 28.602204, lng: -81.202299 } },
    { key: 'tch', id: 18, location: { lat: 28.601803, lng: -81.203287 } },
    { key: 'hph', id: 19, location: { lat: 28.600255, lng: -81.202716 } },
    { key: 'millican', id: 20, location: { lat: 28.599087, lng: -81.202301 } },
    { key: 'teachAca', id: 21, location: { lat: 28.599256, lng: -81.204119 } },
    { key: 'rwc', id: 22, location: { lat: 28.595499, lng: -81.199418 } },
    { key: 'imFields', id: 23, location: { lat: 28.591216, lng: -81.202890 } },
    { key: 'lakeClaire', id: 24, location: { lat: 28.607125, lng: -81.203275 } },
  ];

const locationNames: { [key: string]: string } = {
  su: "Student Union",
  lib: "Library",
  sciences: "Sciences Building",
  ba1: "Business Administration 1",
  ba2: "Business Administration 2",
  eng1: "Engineering 1",
  eng2: "Engineering 2",
  hs1: "Health Science 1",
  hs2: "Health Science 2",
  global: "UCF Global",
  cb1: "Classroom Building 1",
  cb2: "Classroom Building 2",
  psy: "Psychology",
  arena: "Addition Arena",
  nsc: "Nicholson School of Communications",
  vab: "Visual Arts Building",
  bhc: "Burnett Honors College",
  tch: "Trevor Colburn Hall",
  hph: "Howard Phillips Hall",
  millican: "Millican Hall",
  teachAca: "Teaching Academy",
  rwc: "Recreation and Wellness Center",
  imFields: "Intramural Fields",
  lakeClaire: "Lake Claire",
};

const MapSearch = () => {
    const initialLatLng = { lat: 28.602333068847656, lng: -81.20020294189453 };
    const [selectedLocation, setSelectedLocation] = useState(initialLatLng);
    const [selectedLocationName, setSelectedLocationName] = useState("");
    const [selectedBuildingId, setSelectedBuildingId] = useState(null);
    const [rsoMessage, setRsoMessage] = useState('');

    const [formData, setFormData] = useState({
      building_id: null,
      eventName: "",
      description: "",
      eventType: "social",
      date: "",
      time: "",
      contactPhone: "",
      contactEmail: "",
      visibility: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const token = localStorage.getItem('userToken');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo?.user_id;
  
    useEffect(() => {
      setFormData((prevData) => ({
        ...prevData,
        building_id: selectedBuildingId,
      }));
    }, [selectedBuildingId]);
  
    const handleMarkerClick = (poi: Poi) => {
      setSelectedLocation(poi.location);
      setSelectedLocationName(locationNames[poi.key] || "Unknown Location");
      setSelectedBuildingId(poi.id);
      setIsModalOpen(true);
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    const saveChanges = async () => {
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

            const rsoResponse = await fetch(`${baseUrl}/api/rsos/getRSOId/${userId}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
        
            if (!rsoResponse.ok) throw new Error('Failed to get RSO ID');
            const { rso_id: rsoId } = await rsoResponse.json();
        
            // Convert date and time to DATETIME format
            const formattedDateTime = `${formData.date} ${formData.time}:00`;
        
            // Format data to match the DB schema
            const requestData = {
                name: formData.eventName,
                description: formData.description,
                category: formData.eventType, // Matches ENUM in DB
                date_time: formattedDateTime,
                building_id: selectedBuildingId, // Dynamically set from locations array
                contact_phone: formData.contactPhone,
                contact_email: formData.contactEmail,
                visibility: formData.visibility,
                university_id: uniId,
                rso_id: rsoId,
                rso_admin: userId,
            };

            const response = await fetch("http://localhost:5000/api/events/createEvent", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },              
                body: JSON.stringify(requestData),
            });
    
            if (!response.ok) throw new Error("Failed to save event");
    
            console.log("Event saved successfully");
            const eventAlert = alert(`Event saved successfully`);

            closeModal();
        } catch (error) {
            setRsoMessage('Error processing create event request.');
            console.error(error);
        }
    };
  
    return (
      <div>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <div id="MapView">
            <Map
              className="map-container"
              defaultCenter={initialLatLng}
              defaultZoom={16.2}
              fullscreenControl={false}
              streetViewControl={false}
              mapId="415478165339729e"
            >
              {locations.map((poi) => (
                <AdvancedMarker key={poi.key} position={poi.location} onClick={() => handleMarkerClick(poi)}>
                  <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
                </AdvancedMarker>
              ))}
            </Map>
          </div>
        </APIProvider>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close-btn" onClick={closeModal}>
                &times;
              </button>
              <h2 className="modal-title">Create Event</h2>
              {rsoMessage && <p className="rsoMessage">{rsoMessage}</p>}
              <label>
                Location:
                <input type="text" name="location" value={selectedLocationName} readOnly />
              </label>
              <label>
                Event Name:
                <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} />
              </label>
              <label>
                Description:
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
              </label>
              <label>
                Event Type:
                <select name="eventType" value={formData.eventType} onChange={handleInputChange}>
                  <option value="social">Social</option>
                  <option value="fundraising">Fundraising</option>
                  <option value="tech talk">Tech Talk</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Date:
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
              </label>
              <label>
                Time:
                <input type="time" name="time" value={formData.time} onChange={handleInputChange} />
              </label>
              <label>
                Contact Phone:
                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} />
              </label>
              <label>
                Contact Email:
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} />
              </label>
              <label>
                Visibility:
                <select name="visibility" value={formData.visibility} onChange={handleInputChange}>
                    <option value="" disabled selected>Select visibility</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="rso">RSO</option>
                </select>
              </label>
              <div className="modal-buttons">
                <button className="save-btn" onClick={saveChanges}>
                  Save
                </button>
                <button className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
export default MapSearch;