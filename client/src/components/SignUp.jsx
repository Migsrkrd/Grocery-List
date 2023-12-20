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
        }
    
        setUserFormData({
          username: '',
          email: '',
          password: '',
        });
      };



    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleFormSubmit}>
                <input type="text" id='username' placeholder="username" onChange={handleInputChange} />
                <input type="text" id='email' placeholder='email' onChange={handleInputChange} />
                <input type="password" id='password' placeholder="password" onChange={handleInputChange} />
                <button type="submit">Submit</button>
            </form>
            <button onClick={closeModal}>Close</button>
        </div>
    );

};

export default SignUp;