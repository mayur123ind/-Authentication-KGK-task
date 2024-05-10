import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className=" flex justify-center items-center bg-zinc-300 h-screen gap-10 px-3 py-3 font-semibold text-2xl">
        <h2 className=" hover:text-red-300">Home </h2>
        <div className=" hover:text-red-300">
          <Link to="/register">Register</Link>
        </div>
      </div>
    </>
  );
};

export default Home;
