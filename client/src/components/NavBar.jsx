import React from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import SignUp from "./SignUp";
import Auth from "../utils/auth";
import { useState } from "react";
import Login from "./Login";

const NavBar = () => {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLogInModalOpen, setLogInModalOpen] = useState(false);

  const openSignUpModal = () => setSignUpModalOpen(true);
  const openLogInModal = () => setLogInModalOpen(true);
  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeSignUpModal = () => setSignUpModalOpen(false);
  const closeLogoutModal = () => setLogoutModalOpen(false);
  const closeLogInModal = () => setLogInModalOpen(false);

  return (
    <div className="navBar">
      {Auth.loggedIn() ? (
        <>
          <h2><Link to="/">Home</Link></h2>
          <h2><Link to="/dashboard">Dashboard</Link></h2>
          <h2 className="btn" onClick={openLogoutModal}>Logout</h2>
        </>
      ) : (
        <div>
          <h2 onClick={openLogInModal}>Login</h2>
          <h2 onClick={openSignUpModal}>Signup</h2>
        </div>
      )}
      <Modal isOpen={isSignUpModalOpen} closeModal={closeSignUpModal}>
        <SignUp closeModal={closeSignUpModal} />
      </Modal>
      <Modal isOpen={isLogoutModalOpen} closeModal={closeLogoutModal}>
        <h1>Are you sure you want to logout?</h1>
        <button onClick={Auth.logout}>Yes</button>
        <button onClick={closeLogoutModal}>No</button>
      </Modal>
      <Modal isOpen={isLogInModalOpen} closeModal={closeLogInModal}>
        <Login closeModal={closeLogInModal} />
      </Modal>
    </div>
  );
};
export default NavBar;
