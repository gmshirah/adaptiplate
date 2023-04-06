import './Settings.css';
import { app } from '../index.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Container, Image } from 'react-bootstrap';
import
{
  getAuth,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import
{
  getDatabase,
  ref,
  get,
  child,
  onValue
} from "firebase/database";

function Settings ()
{
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );
  // const user = auth.currentUser;

  const [loggedIn, setLoggedIn] = useState(false);

  const [userData, setUserData] = useState([]);

  const onSignOut = e => {
    signOut(auth)
      .then(() => {
        setUserData([]);
      }).catch((error) => {
        console.error(error);
        alert("Error signing out. Please try again!");
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

  return (
    <Container>
      {loggedIn ? (
        <div>
          <h1 id="titleText">Settings</h1>
          <Image id="accountImage" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" roundedCircle fluid thumbnail />
          <ListGroup id="settings" variant="flush">
            <ListGroup.Item id="setting">
              <span id="settingText">Dietary Restrictions</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
            <ListGroup.Item id="setting">
              <span id="settingText">Nutritional Preferences</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
            <ListGroup.Item id="setting">
              <span id="settingText">Financial Preferences</span>
              <span className="material-symbols-outlined" id="selectIcon">
                navigate_next
              </span>
            </ListGroup.Item>
            <ListGroup.Item id="setting">
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
            <ListGroup.Item id="deleteAccount">
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
