import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";
import PropTypes from "prop-types";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      // Store token and userID in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userID", response.data.userID);

      onLogin();
      navigate("/play");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("User not found. Please register first.");
      } else {
        setError(error.response?.data.message || "Error logging in");
      }
    }
  };

  // Redirect user to registration page
  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={styles.input}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={`${styles.button} ${styles.loginButton}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className={`${styles.button} ${styles.registerButton}`}
          >
            Register
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

// Define prop types to enforce correct usage
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
