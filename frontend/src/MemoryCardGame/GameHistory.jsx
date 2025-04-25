import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GameHistory.module.css";

const GameHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'failed'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        // Get userID from localStorage to fetch only this user's history
        const userID = localStorage.getItem("userID");

        if (!userID) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/memory/history",
          {
            params: { userID },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setHistory(response.data.history);
        setFilteredHistory(response.data.history);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching game history:", err);
        setError(err.response?.data?.message || "Error fetching game history");
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, []);

  useEffect(() => {
    // Apply filters when filter state changes
    if (filter === "all") {
      setFilteredHistory(history);
    } else if (filter === "completed") {
      setFilteredHistory(history.filter((game) => game.completed));
    } else if (filter === "failed") {
      setFilteredHistory(history.filter((game) => game.failed));
    }
  }, [filter, history]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return `Level ${difficulty}`;
    }
  };

  const handleBackClick = () => {
    navigate("/play");
  };

  return (
    <div className={styles.container}>
      <div className={styles.historyCard}>
        <h1 className={styles.title}>Game History</h1>

        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <div className={styles.loading}>Loading history...</div>
        ) : (
          <>
            <div className={styles.filterContainer}>
              <button
                className={`${styles.filterButton} ${
                  filter === "all" ? styles.active : ""
                }`}
                onClick={() => setFilter("all")}
              >
                All Games
              </button>
              <button
                className={`${styles.filterButton} ${
                  filter === "completed" ? styles.active : ""
                }`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
              <button
                className={`${styles.filterButton} ${
                  filter === "failed" ? styles.active : ""
                }`}
                onClick={() => setFilter("failed")}
              >
                Failed
              </button>
            </div>

            {filteredHistory.length === 0 ? (
              <p className={styles.noHistory}>No game history found</p>
            ) : (
              <div className={styles.historyList}>
                {filteredHistory.map((game, index) => (
                  <div key={index} className={styles.historyItem}>
                    <div className={styles.gameHeader}>
                      <span className={styles.date}>
                        {formatDate(game.gameDate)}
                      </span>
                      <span
                        className={`${styles.status} ${
                          game.completed ? styles.completed : ""
                        } ${game.failed ? styles.failed : ""}`}
                      >
                        {game.failed
                          ? "Failed"
                          : game.completed
                          ? "Completed"
                          : "In Progress"}
                      </span>
                    </div>
                    <div className={styles.gameDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.label}>Difficulty:</span>
                        <span className={styles.value}>
                          {getDifficultyLabel(game.difficulty)}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.label}>Time:</span>
                        <span className={styles.value}>
                          {formatTime(game.timeTaken)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className={styles.backButton} onClick={handleBackClick}>
              Back to Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameHistory;
