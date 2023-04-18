import './FinancialPreferences.css';
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

function FinancialPreferences ()
{
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );
  // const user = auth.currentUser;

  const prefs = [
    ["veryCheap", "Less Than $0.50 / serving"],
    ["cheap", "Less Than $1.00 / serving"],
    ["moderate", "Less Than $3.00 / serving"],
    ["expensive", "Less Than $5.00 / serving"],
    ["veryExpensive", "No Limit"]
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
            if (!snapshot.val().financialPreferences) {
              for (let i = 0; i < prefs.length; i++) {
                const newPrefRef = child(dbRef, `users/${currentUser.uid}/financialPreferences/${i}`);
                set(newPrefRef, {
                    id: prefs[i][0],
                    index: i,
                    name: prefs[i][1],
                    value: i == prefs.length - 1,
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

  const changePref = (index) => {
    const dbRef = ref(getDatabase());
    for (let i = 0; i < prefs.length; i++) {
        const prefRef = child(dbRef, `users/${auth.currentUser.uid}/financialPreferences/${i}`);
        update(prefRef, {
            value: i == index
        }).then(() => {
            setChanged(i);
        }).catch((error) => {
            console.error(error);
            alert("Error updating user data.");
        });
    }
  };

  const IconSelector = (flag) => {
    if (flag) {
      return (
        <span className="material-symbols-outlined" id="selectIcon">
            radio_button_checked
        </span>
      );
    } else {
      return (
        <span className="material-symbols-outlined" id="selectIcon">
            radio_button_unchecked
        </span>
      );
    }
  };

  return (
    <Container>
      {loggedIn ? (
        <div>
          <h1 id="titleText">Financial Preferences</h1>
          <ListGroup id="financialPreferences" variant="flush">
            {userData.financialPreferences && userData.financialPreferences.map(pref =>
                <ListGroup.Item id="pref" onClick={() => {changePref(pref.index);}}>
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

export default FinancialPreferences;
