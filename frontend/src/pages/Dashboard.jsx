import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await API.get("/test/history");
      setResults(res.data.reverse());
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const chartData = {
    labels: results.map((_, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: "WPM Progress",
        data: results.map((item) => item.wpm),
        borderColor: "blue",
        backgroundColor: "lightblue",
        tension: 0.3
      }
    ]
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

        <div className="card">
          <h2>WPM Progress</h2>
          {results.length > 0 ? (
            <Line data={chartData} />
          ) : (
            <p>No data yet.</p>
          )}
        </div>

        <div className="card">
          <h2>Typing History</h2>
          {results.length === 0 ? (
            <p>No test results yet.</p>
          ) : (
            <div className="history-table">
                <div className="history-header">
                    <span>WPM</span>
                    <span>CPM</span>
                    <span>Accuracy</span>
                    <span>Date</span>
                </div>

                {results.map((item) => (
                    <div className="history-row" key={item._id}>
                    <span>{item.wpm}</span>
                    <span>{item.cpm}</span>
                    <span>{item.accuracy}%</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                ))}
                </div>

          )}
        </div>
      </div>
    </>
  );
};


export default Dashboard;
