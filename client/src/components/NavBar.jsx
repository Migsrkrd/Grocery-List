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

  const myName = () => {
    if (Auth.loggedIn()) {
      const name = Auth.getProfile().data.username;
      return name;
    } else {
      return " ";
    }
  }
  // console.log(myName);

  return (
    <div className="navBar">
      {Auth.loggedIn() ? (
        <>
          <h2 className="btn">
            <Link to="/">Make a List!</Link>
          </h2>
          <h2 className="btn">
            <Link to="/dashboard">{myName()}</Link>
          </h2>
          <h2 className="btn" onClick={openLogoutModal}>
            Logout
          </h2>
        </>
      ) : (
        <div className="notLoggedIn">
          <h2 onClick={openLogInModal}>Login</h2>
          <h2 onClick={openSignUpModal}>Signup</h2>
        </div>
      )}
      <Modal isOpen={isSignUpModalOpen} closeModal={closeSignUpModal}>
        <SignUp closeModal={closeSignUpModal} />
      </Modal>
      <Modal isOpen={isLogoutModalOpen} closeModal={closeLogoutModal}>
        <div className="logoutModal">
          <h1>Are you sure you want to logout?</h1>
          <div className="logoutBtns">
            <button onClick={Auth.logout}>Logout</button>
            <button onClick={closeLogoutModal}>Cancel</button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isLogInModalOpen} closeModal={closeLogInModal}>
        <Login closeModal={closeLogInModal} />
      </Modal>
    </div>
  );
};
export default NavBar;
