import React from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_USER } from '../utils/mutations';
import Auth from '../utils/auth';


const SignUp = ({ closeModal }) => {

    const [userFormData, setUserFormData] = React.useState({
        username: '',
        email: '',
        password: ''
    });

    const [addUser, { data }] = useMutation(SIGNUP_USER, {
        variables: userFormData,
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setUserFormData({ ...userFormData, [id]: value });
        console.log(userFormData);
      };

      const handleFormSubmit = async (event) => {
        event.preventDefault();
        if(!userFormData.username || !userFormData.email || !userFormData.password) {
          alert("Please fill out all fields");
          return;
        } else if (userFormData.password.length < 6) {
          alert("Password must be at least 6 characters");
          return;
        } else if (!userFormData.email.includes('@')) {
          alert("Please enter a valid email");
          return;
        } else if (!userFormData.username) {
          alert("Please enter a username");
          return;
        } else if (!userFormData.password) {
          alert("Please enter a password");
          return;
        } else if (!userFormData.email) {
          alert("Please enter an email");
          return;
        } else if (userFormData.username.length < 3) {
          alert("Username must be at least 3 characters");
          return;
        } else if (userFormData.username.length > 20) {
          alert("Username must be less than 20 characters");
          return;
        } else if (userFormData.email.length > 50) {
          alert("Email must be less than 50 characters");
          return;
        } else if (userFormData.password.length > 20) {
          alert("Password must be less than 20 characters");
          return;
        } 
        try {
          //creates a new user in the db
          const { data } = await addUser({
            variables: { ...userFormData },
          });

          console.log(data);
    
          Auth.login(data.addUser.token);
        } catch (e) {
          console.error(e);
          console.log("error", e)
          if (e.message.includes('duplicate key error')) {
            alert('This user already exists, please select a different username');
          } else if (e.message.includes('validation error')) {
            alert('Please enter a valid email');
          } else {
            alert('Sign up failed, please try again');
          }
        }
    
        setUserFormData({
          username: '',
          email: '',
          password: '',
        });
      };



    return (
        <div className='loginModal'>
            <h1>Sign Up</h1>
            <form className='loginModal' onSubmit={handleFormSubmit}>
              <div className='emailArea'>
                <label htmlFor="username">Username:</label>
                <input type="text" id='username' placeholder="username" onChange={handleInputChange} />
              </div>
              <div className='emailArea'>
                <label htmlFor="email">Email:</label>
                <input type="text" id='email' placeholder='email' onChange={handleInputChange} />
              </div>
              <div className='passwordArea'>
                <label htmlFor="password">Password:</label>
                <input type="password" id='password' placeholder="password" onChange={handleInputChange} />
              </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );

};

export default SignUp;