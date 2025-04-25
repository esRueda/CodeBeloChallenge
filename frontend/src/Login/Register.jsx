import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      setMessage(response.data.message);
      setIsError(false);
      // Redirect to login after delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data.message || "Error registering");
      setIsError(true);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Register</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className={styles.input}
            required
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
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Register
        </button>
        {message && (
          <p
            className={`${styles.message} ${
              isError ? styles.error : styles.success
            }`}
          >
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={handleLoginRedirect}
          className={styles.backToLoginButton}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default Register;
