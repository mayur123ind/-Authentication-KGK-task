import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3001/dashboard")
      .then((res) => {
        // console.log(res);
        if (res.data.valid) {
          setMessage(res.data.message);
        } else {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  });

  const handleLogout = () => {
    axios
      .post("http://localhost:3001/logout", {}, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          alert("Logged out successfully");
          // Redirect to login page or perform any other action
          navigate("/");
        } else {
          console.error("Failed to logout");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div>
        <div className="bg-zinc-300 font-extrabold text-3xl m-auto">
          <h1>Dashbord</h1>
          <h1 className="text-center">User is {message}</h1>
          <div className="  justify-center items-center h-screen gap-10 px-3 py-3 font-semibold text-2xl">
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-300 rounded m-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
