import './Signup.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Form
} from 'react-bootstrap';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    createUserWithEmailAndPassword
} from "firebase/auth";
import {
    getDatabase,
    ref,
    set
} from "firebase/database";

const agreement = "I understand this application was created in the context \
        of an academic project and that my account information may be viewed \
        by students and faculty of The University of Texas at Austin. I \
        acknowledge that I have the ability to delete my account information \
        from this platform at any time."

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const user = auth.currentUser;

function Signup() {
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onEmailInput = ({target:{value}}) => setEmail(value);
  const onUsernameInput = ({target:{value}}) => setUsername(value);
  const onPasswordInput = ({target:{value}}) => setPassword(value);

  const onCreateUserSubmit = e => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const db = getDatabase();
          set(ref(db, 'users/' + userCredential.user.uid), {
            uid: username,
            email: email
          });
          
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + ": " + errorMessage);
        });
    }
    setValidated(true);
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
