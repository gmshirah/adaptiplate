import './NutritionalPreferences.css';
import { app } from '../../index.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  remove,
  update,
  set
} from "firebase/database";

function NutritionalPreferences ()
{
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );
  // const user = auth.currentUser;

  const prefs = [
    ["lowFat", "Low Fat"],
    ["highProtein", "High Protein"],
    ["lowCarb", "Low Carb"],
    ["lowSugar", "Low Sugar"],
    ["highFiber", "High Fiber"]
  ];

  const [loggedIn, setLoggedIn] = useState(false);

  const [changed, setChanged] = useState(99);

  const [userData, setUserData] = useState(Array());

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${currentUser.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
            if (!snapshot.val().nutritionalPreferences) {
              for (let i = 0; i < prefs.length; i++) {
                const newPrefRef = child(dbRef, `users/${currentUser.uid}/nutritionalPreferences/${i}`);
                set(newPrefRef, {
                    id: prefs[i][0],
                    index: i,
                    name: prefs[i][1],
                    value: false,
                }).then(() => {
                  setChanged(i);
                });
              }
            }
          }
        }).catch((error) => {
          console.error(error);
          alert("Error retrieving user data.");
        });
      }
      setLoggedIn(currentUser != null);
    });
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${auth.currentUser.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      }).catch((error) => {
        console.error(error);
        alert("Error retrieving user data.");
      });
    }
  }, [changed]);

  const changePref = (index, value) => {
    const dbRef = ref(getDatabase());
    const prefRef = child(dbRef, `users/${auth.currentUser.uid}/nutritionalPreferences/${index}`);
    update(prefRef, {
        value: value
    }).then(() => {
      get(child(dbRef, `users/${auth.currentUser.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      }).catch((error) => {
        console.error(error);
        alert("Error retrieving user data.");
      });
    }).catch((error) => {
        console.error(error);
        alert("Error updating user data.");
    });
  };

  const IconSelector = (flag) => {
    if (flag) {
      return (
        <span className="material-symbols-outlined" id="selectIcon">
            check_box
        </span>
      );
    } else {
      return (
        <span className="material-symbols-outlined" id="selectIcon">
            check_box_outline_blank
        </span>
      );
    }
  };

  return (
    <Container>
      {loggedIn ? (
        <div>
          <h1 id="titleText">Nutritional Preferences</h1>
          <ListGroup id="nutritionalPreferences" variant="flush">
            {userData.nutritionalPreferences && userData.nutritionalPreferences.map(pref =>
                <ListGroup.Item id="pref" onClick={() => {changePref(pref.index, !pref.value);}}>
                    <span id="prefText">{pref.name}</span>
                    <span>{IconSelector(pref.value)}</span>
                </ListGroup.Item>
            )}
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

export default NutritionalPreferences;
