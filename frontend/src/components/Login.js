import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import "../styles/index.css";

// const baseUrl = "https://knightsreserv-00cde8777914.herokuapp.com";
const baseUrl = "http://localhost:5000";

function Login() {
  var loginName;
  var loginPassword;
  var resetEmail;
  const [message, setMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const doLogin = async (event) => {
    event.preventDefault();

    var obj = { Email: loginName.value, Password: loginPassword.value };
    var js = JSON.stringify(obj);
    console.log(js);

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email: loginName.value, password: loginPassword.value }),
        headers: { "Content-Type": "application/json" },
      });
    
      const res = await response.json();
    
      if (res.error) {
        setMessage(res.error);
      } else {
        const token = res.token;
        const userRole = res.user.role; // Retrieve user role from API response
    
        if (token) {
          // Store token and user data
          localStorage.setItem("userToken", token);
          localStorage.setItem("userInfo", JSON.stringify(res.user));
    
          // Redirect based on user role
          switch (userRole) {
            case "admin":
              window.location.href = "/AdminDashboard";
              break;
            case "university":
              window.location.href = "/UniDashboard";
              break;
            case "rso_admin":
              window.location.href = "/RSODashboard";
              break;
            case "student":
              window.location.href = "/StudentDashboard";
              break;
            default:
              setMessage("Unknown role. Unable to redirect.");
          }
        } else {
          setMessage("No token received, login failed");
        }
      }
    } catch (e) {
      alert(e.toString());
    }
  };

  const sendResetEmail = async (event) => {
    event.preventDefault();
    var obj = { Email:resetEmail.value };
    var js = JSON.stringify(obj);
    //console.log(js);
    var response;
    try {
      response = await fetch(`${baseUrl}/api/request-password-reset`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: js
      });
      if (response.status === 404)
        setEmailMessage("User not found.");
      else
        setEmailMessage("Check your email to reset your password!");
    } catch (error) {
      alert(error.toString());
    }
  };

  return (
    <div id="loginDiv">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;700&display=swap"
        rel="stylesheet"
      ></link>
      <form onSubmit={doLogin}>
        <span id="inner-title">Please Log In</span>
        <br />
        <input
          type="text"
          class="user-authentication-text-form"
          id="loginName"
          placeholder="Email"
          ref={(c) => (loginName = c)}
          required
        />
        <br />
        <input
          type="password"
          class="user-authentication-text-form"
          id="loginPassword"
          placeholder="Password"
          ref={(c) => (loginPassword = c)}
          required
        />
        <br />
        <input
          type="submit"
          id="loginButton"
          class="user-authentication-buttons"
          value="Login"
          onClick={doLogin}
        />

      </form>
      <span id="loginResult">{message}</span>
      <Link to="/SignUp">
          <button className="user-authentication-redirect-links">Don't Have an Account? Sign Up Here!</button>
      </Link>
      <button className="user-authentication-redirect-links" onClick={open}>Forgot Password?</button>
      <Modal id="reset-password-modal" opened={opened} onClose={close}>
        <div id="reset-password-email-container">
          <span className="dumb-font">Please enter the email associated with your account</span>
          <form className="dumb-layout" id="password-email-form" onSubmit={sendResetEmail}>
            <input className="dumb-font" type="text" placeholder="Email" ref={(c) => (resetEmail = c)} required></input>
            <button className="dumb-font" type="submit">Confirm</button>
          </form>
          <span id="reset-message">{emailMessage}</span>
        </div>
      </Modal>
    </div>
  );
}
export default Login;
