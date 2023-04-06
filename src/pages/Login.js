import './Login.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import
  {
    Button,
    Container,
    Form
  } from 'react-bootstrap';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import
  {
    getAuth,
    signInWithEmailAndPassword
  } from "firebase/auth";
import
  {
    getDatabase,
    ref,
    get,
    child
  } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlPgsYfKfSl15rkPbRzdX_7pjf3N5i424",
  authDomain: "adaptipla.firebaseapp.com",
  databaseURL: "https://adaptipla-default-rtdb.firebaseio.com",
  projectId: "adaptipla",
  storageBucket: "adaptipla.appspot.com",
  messagingSenderId: "826210962785",
  appId: "1:826210962785:web:1ba40a0510126f3dc54920",
  measurementId: "G-235FB92HNR"
};

// Initialize Firebase
const app = initializeApp( firebaseConfig );
const analytics = getAnalytics( app );

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth( app );
const user = auth.currentUser;

function Login ()
{
  const [ userData, setUserData ] = useState( [] );

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
        const dbRef = ref( getDatabase() );
        get( child( dbRef, `users/${ userCredential.user.uid }` ) ).then( ( snapshot ) =>
        {
          if ( snapshot.exists() )
          {
            setUserData( snapshot.val() );
          }
        } ).catch( ( error ) =>
        {
          console.error( error );
        } );

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
