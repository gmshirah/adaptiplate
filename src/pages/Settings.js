import './Settings.css';
import { app } from '../index.js';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListGroup, Container, Image, Alert, Button, Form } from 'react-bootstrap';
import
{
  getAuth,
  onAuthStateChanged,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import
{
  getDatabase,
  ref,
  get,
  child,
  onValue,
  remove
} from "firebase/database";

function Settings ()
{
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );
  // const user = auth.currentUser;

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [deleteUserConfirm, setDeleteUserConfirm] = useState(false);

  const [userData, setUserData] = useState([]);

  const [password, setPassword] = useState("");

  const onPasswordInput = ( { target: { value } } ) => setPassword( value );

  const onSignOut = e => {
    signOut(auth)
      .then(() => {
        setUserData([]);
      }).catch((error) => {
        console.error(error);
        alert("Error signing out. Please try again!");
      });
  }

  const onDeleteUser = e => {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    reauthenticateWithCredential(auth.currentUser, credential).then(() => {
      // User re-authenticated.
      const uid = auth.currentUser.uid;
      deleteUser(auth.currentUser).then(() => {
        // User deleted
        const dbRef = ref(getDatabase());
        remove(child(dbRef, `users/${uid}`)).then(() => {
          setUserData([]);
          setPassword("");
          setDeleteUserConfirm(false);
        }).catch((error) => {
          console.error(error);
        });
      }).catch((error) => {
        console.error(error);
        alert("Failed to delete user account. Please try again!");
      });
    }).catch((error) => {
      console.error(error);
      alert("Failed to authenticate user account. Please try again!");
    });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${currentUser.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        }).catch((error) => {
          console.error(error);
          alert("Error retrieving user data.");
        });
      }
      setLoggedIn(currentUser != null);
    });
  }, []);

  if (deleteUserConfirm) {
    return (
      <Alert id="deleteAccountAlert" variant="danger">
        <Alert.Heading>Delete Account</Alert.Heading>
        <p>This action will permanently delete your account ({userData.email}). Please enter your password to proceed.</p>
        <Form id="passwordConfirmForm" onSubmit={onDeleteUser}>
          <Form.Control type="password" placeholder="password" onChange={onPasswordInput} value={password} />
          <hr />
          <div id="deleteAccountButtons">
            <Button id="deleteAccountBtn" variant="danger" onClick={() => {setPassword(""); setDeleteUserConfirm(false);}}>Cancel</Button>
            <Button id="deleteAccountBtn" variant="danger" type="submit">Proceed</Button>
          </div>
        </Form>
      </Alert>
    );
  }

  return (
    <Container>
      {loggedIn ? (
        <div>
          <h1 id="titleText">Settings</h1>
          <Image id="accountImage" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" roundedCircle fluid thumbnail />
          <ListGroup id="settings" variant="flush">
            <ListGroup.Item id="setting" onClick={() => {navigate(`/settings/dietary-restrictions`);}}>
              <span id="settingText">Dietary Restrictions</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
            <ListGroup.Item id="setting" onClick={() => {navigate(`/settings/nutritional-preferences`);}}>
              <span id="settingText">Nutritional Preferences</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
            <ListGroup.Item id="setting" onClick={() => {navigate(`/settings/financial-preferences`);}}>
              <span id="settingText">Financial Preferences</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
            <ListGroup.Item id="setting" onClick={() => {navigate(`/settings/app-appearance`);}}>
              <span id="settingText">App Appearance</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
            <ListGroup.Item id="setting">
              <span id="settingText">Clear Saved Recipes</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
            <ListGroup.Item id="setting" onClick={() => {onSignOut();}}>
              <span id="settingText">Sign Out</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
            <ListGroup.Item id="deleteAccount" onClick={() => {setDeleteUserConfirm(true);}}>
              <span id="settingText">Delete Account</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
          </ListGroup>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button id="loginButton">Login</button>
          </Link>
        </div>
      )}
    </Container>
  );
}

export default Settings;
