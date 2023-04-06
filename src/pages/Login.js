import './Login.css';
import { app } from '../index.js';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import
{
  Button,
  Container,
  Form
} from 'react-bootstrap';
import
{
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import
{
  getDatabase,
  ref,
  get,
  child
} from "firebase/database";

function Login ()
{
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );
  const user = auth.currentUser;

  const [loggedIn, setLoggedIn] = useState(user != null);

  const navigate = useNavigate();

  const [ email, setEmail ] = useState( "" );
  const [ password, setPassword ] = useState( "" );

  const onEmailInput = ( { target: { value } } ) => setEmail( value );
  const onPasswordInput = ( { target: { value } } ) => setPassword( value );

  const onSignInSubmit = e =>
  {
    signInWithEmailAndPassword( auth, email, password )
      .then( ( userCredential ) =>
      {
        // Signed in
        setLoggedIn(true);
        navigate( "/" );
      } )
      .catch( ( error ) =>
      {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log( errorCode + ": " + errorMessage );
        alert( "Error logging in to your account. Please try again!" );
      } );
  }

  const onSignOut = e => {
    signOut(auth)
      .then(() => {
        setEmail("");
        setPassword("");
        setLoggedIn(false);
      }).catch((error) => {
        console.error(error);
        alert("Error signing out. Please try again!");
      });
  }

  if (loggedIn) {
    return (
      <Container>
        <h1 id="titleText">Login</h1>
        <h3>Already Signed In</h3>
        <Button variant="secondary" onClick={() => {onSignOut();}}>Sign Out</Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 id="titleText">Login</h1>
      <Form onSubmit={onSignInSubmit}>
        <Form.Group id="formElement">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" onChange={onEmailInput} value={email} />
        </Form.Group>
        <Form.Group id="formElement">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="password" onChange={onPasswordInput} value={password} />
        </Form.Group>
        <Button id="submitBtn" variant="secondary" type="submit">Login</Button>
      </Form>
      <p>Don't have an account? <Link to="/signup">Sign up!</Link></p>
    </Container>
  );
}

export default Login;
