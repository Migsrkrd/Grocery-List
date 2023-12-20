import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import { useState } from "react";


const Login = ({ closeModal }) => {

    const openLogInModal = () => setLogInModalOpen(true);
    const closeLogInModal = () => setLogInModalOpen(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    
      const [login, { error }] = useMutation(LOGIN_USER, {
        variables: {email: email, password: password },
      });

      console.log("login", email, password);

      const handleLogIn = async (event) => {
        event.preventDefault();
        try {
          const { data } = await login({
            variables: { email: email, password: password },
          });
          console.log(data);
          Auth.login(data.login.token);
        } catch (e) {
          console.error(e);
        }
      };



    return (
        <>
        <h1>Log In</h1>
        <form onSubmit={handleLogIn}>
          <input
            type="text"
            placeholder="email"
            id="emailLogin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            id="passwordLogin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        <button onClick={closeLogInModal}>Close</button>
        </>
    );
}

export default Login;