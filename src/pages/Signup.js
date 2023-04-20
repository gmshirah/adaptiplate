import './Signup.css';
import { app } from '../index.js';
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
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import
{
  getDatabase,
  ref,
  set,
  child,
} from "firebase/database";

const agreement = "I understand this application was created in the context \
        of an academic project and that my account information may be viewed \
        by students and faculty of The University of Texas at Austin. I \
        acknowledge that I have the ability to delete my account information \
        from this platform at any time."

function Signup ()
{
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );
  const user = auth.currentUser;

  const [ validated, setValidated ] = useState( false );
  const [ loggedIn, setLoggedIn ] = useState( user != null );

  const navigate = useNavigate();

  const [ email, setEmail ] = useState( "" );
  const [ username, setUsername ] = useState( "" );
  const [ password, setPassword ] = useState( "" );

  const onEmailInput = ( { target: { value } } ) => setEmail( value );
  const onUsernameInput = ( { target: { value } } ) => setUsername( value );
  const onPasswordInput = ( { target: { value } } ) => setPassword( value );

  const onCreateUserSubmit = e =>
  {
    const form = e.currentTarget;
    if ( form.checkValidity() === false )
    {
      e.preventDefault();
      e.stopPropagation();
    } else
    {
      createUserWithEmailAndPassword( auth, email, password )
        .then( ( userCredential ) =>
        {
          // Signed in 
          const db = getDatabase();
          set( ref( db, 'users/' + userCredential.user.uid ), {
            uid: username,
            email: email,
            recipes: [ {} ],
            settings: {
              "appearance": "0",
              "dietary": "0",
              "financial": "0",
              "name": "0",
              "nutritional": "0"
            },
            recentlyViewed: [],
          } );
          setLoggedIn( true );
          navigate( "/" );
        } )
        .catch( ( error ) =>
        {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log( errorCode + ": " + errorMessage );
        } );
    }
    setValidated( true );
  }

  const onSignOut = e =>
  {
    signOut( auth )
      .then( () =>
      {
        setEmail( "" );
        setUsername( "" );
        setPassword( "" );
        setLoggedIn( false );
      } ).catch( ( error ) =>
      {
        console.error( error );
        alert( "Error signing out. Please try again!" );
      } );
  }

  if ( loggedIn )
  {
    return (
      <Container>
        <h1 id="titleText">Sign Up</h1>
        <h3>Already Signed In</h3>
        <Button variant="secondary" onClick={() => { onSignOut(); }}>Sign Out</Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 id="titleText">Sign Up</h1>
      <Form noValidate validated={validated} onSubmit={onCreateUserSubmit}>
        <Form.Group id="formElement">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" required onChange={onEmailInput} value={email} />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group id="formElement">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="username" required onChange={onUsernameInput} value={username} />
          <Form.Control.Feedback type="invalid">
            Please choose a username.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group id="formElement">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="password" required onChange={onPasswordInput} value={password} />
          <Form.Control.Feedback type="invalid">
            Please enter a password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group id="formElement">
          <Form.Check
            id="agreeCheckbox"
            label={agreement}
            required
            feedback="You must acknowledge the statement before submitting."
            feedbackType="invalid"
          />
        </Form.Group>
        <Button id="submitBtn" variant="secondary" type="submit">Sign Up</Button>
      </Form>
      <p>Already have an account? <Link to="/login">Login!</Link></p>
    </Container>
  );
}

export default Signup;
