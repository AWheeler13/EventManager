import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import "../styles/index.css";

const baseUrl = "http://localhost:5000";

function CreateAccount() {
  const [message, setMessage] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [accountType, setAccountType] = useState('');
  const [universities, setUniversities] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    retypePassword: '',
    universityName: '',
    universityLocation: '',
    universityDescription: '',
    universityNumStudents: '',
    universityUrl: '',
    selectedUniversityId: '',
  });

  // Fetch available universities when student is selected
  useEffect(() => {
    if (accountType === 'student') {
      fetch(`${baseUrl}/api/universities/getActiveUniversityList`)
        .then(response => response.json())
        .then(data => {
          setUniversities(data);
        })
        .catch(error => console.error("Error fetching universities:", error));
    }
  }, [accountType]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const doCreateAccount = async (event) => {
    event.preventDefault();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Invalid email format');
      return;
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[^\da-zA-Z]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setMessage('Password must contain at least 8 characters, including one uppercase, one lowercase, one digit, and one special character.');
      return;
    }

    // Validate that passwords match
    if (formData.password !== formData.retypePassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      // First API call to create user
      const userResponse = await fetch(`${baseUrl}/api/users/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: accountType
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const userResult = await userResponse.json();
      if (userResult.error) {
        setMessage('API Error: ' + userResult.error);
        return;
      }

      const userId = userResult.user_id; // Assume API returns created user ID
      let secondaryResponse;

      // Second API call to populate university/student table
      if (accountType === 'university') {
        secondaryResponse = await fetch(`${baseUrl}/api/universities/createUniversity`, {
          method: 'POST',
          body: JSON.stringify({
            name: formData.universityName,
            location: formData.universityLocation,
            description: formData.universityDescription,
            num_students: formData.universityNumStudents,
            website: formData.universityUrl,
            user_id: userId,
            status: "active",
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (accountType === 'student') {
        secondaryResponse = await fetch(`${baseUrl}/api/students/createStudent`, {
          method: 'POST',
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            university_id: parseInt(formData.selectedUniversityId, 10),
            user_id: userId
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const secondaryResult = await secondaryResponse.json();
      if (secondaryResult.error) {
        setMessage('API Error: ' + secondaryResult.error);
        return;
      }

      setMessage('Account created successfully! Please reach out to your respective administrator to approve your account!');
      open();

    } catch (error) {
      setMessage('Error: ' + error.toString());
    }
  };

  return (
    <div id="loginDiv">
      <form onSubmit={doCreateAccount}>
        <span id="inner-title">Create an account</span>
        <br />

        <select
          id="createAccountType"
          className="user-authentication-text-form"
          required
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="" disabled>Select account type</option>
          <option value="university">University</option>
          <option value="student">Student</option>
        </select>
        <br />
        <br />


        {/* University-Specific Fields */}
        {accountType === 'university' && (
          <>
            <input
              type="text"
              className="user-authentication-text-form"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="password"
              className="user-authentication-text-form"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="password"
              className="user-authentication-text-form"
              name="retypePassword"
              placeholder="Retype Password"
              required
              value={formData.retypePassword}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="text"
              className="user-authentication-text-form"
              name="universityName"
              placeholder="University Name"
              required
              value={formData.universityName}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="text"
              className="user-authentication-text-form"
              name="universityLocation"
              placeholder="Location"
              required
              value={formData.universityLocation}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="text"
              className="user-authentication-text-form"
              name="universityDescription"
              placeholder="Description"
              value={formData.universityDescription}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="number"
              className="user-authentication-text-form"
              name="universityNumStudents"
              placeholder="Number of Students"
              value={formData.universityNumStudents}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="text"
              className="user-authentication-text-form"
              name="universityUrl"
              placeholder="Website"
              value={formData.universityUrl}
              onChange={handleInputChange}
            />
            <br />
          </>
        )}

        {/* Student-Specific Fields */}
        {accountType === 'student' && (
          <>
            <input
              type="text"
              className="user-authentication-text-form"
              name="firstName"
              placeholder="First Name"
              required
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="text"
              className="user-authentication-text-form"
              name="lastName"
              placeholder="Last Name"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="text"
              className="user-authentication-text-form"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="password"
              className="user-authentication-text-form"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            <br />
            <input
              type="password"
              className="user-authentication-text-form"
              name="retypePassword"
              placeholder="Retype Password"
              required
              value={formData.retypePassword}
              onChange={handleInputChange}
            />
            <br />
            <select
              className="user-authentication-text-form"
              name="selectedUniversityId"
              required
              value={formData.selectedUniversityId}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select Your University</option>
              {universities.map((uni) => (
                <option key={uni.university_id} value={uni.university_id}>
                  {uni.name}
                </option>
              ))}
            </select>

            <br />
          </>
        )}

        <input
          type="submit"
          id="loginButton"
          className="user-authentication-buttons"
          value="Create Account"
        />
      </form>

      <Link to="/Login">
        <button className="user-authentication-redirect-links">
          Have an Account? Sign In Here!
        </button>
      </Link>
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default CreateAccount;