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
    {
      "id": "lowFat",
      "index": 0,
      "name": "Low Fat",
      "value": false
    },
    {
      "id": "highProtein",
      "index": 1,
      "name": "High Protein",
      "value": false
    },
    {
      "id": "lowCarb",
      "index": 2,
      "name": "Low Carb",
      "value": false
    },
    {
      "id": "lowSugar",
      "index": 3,
      "name": "Low Sugar",
      "value": false
    },
    {
      "id": "highFiber",
      "index": 4,
      "name": "High Fiber",
      "value": false
    }
  ];

  const [loggedIn, setLoggedIn] = useState(false);

  const [userData, setUserData] = useState([
    {
      "id": "lowFat",
      "index": 0,
      "name": "Low Fat",
      "value": false
    },
    {
      "id": "highProtein",
      "index": 1,
      "name": "High Protein",
      "value": false
    },
    {
      "id": "lowCarb",
      "index": 2,
      "name": "Low Carb",
      "value": false
    },
    {
      "id": "lowSugar",
      "index": 3,
      "name": "Low Sugar",
      "value": false
    },
    {
      "id": "highFiber",
      "index": 4,
      "name": "High Fiber",
      "value": false
    }
  ]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${currentUser.uid}`)).then((snapshot) => {
          console.log(currentUser.uid)
          if (snapshot.exists()) {
            setUserData(prefs);
            if (!snapshot.val().nutritionalPreferences) {
                for (let i = 0; i < prefs.length; i++) {
                    const newDietRef = child(dbRef, `users/${currentUser.uid}/nutritionalPreferences/${i}`);
                    set(newDietRef, {
                        id: prefs[i][0],
                        index: i,
                        name: prefs[i][1],
                        value: false,
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

  const changeDiet = (index, value) => {
    const dbRef = ref(getDatabase());
    const dietRef = child(dbRef, `users/${auth.currentUser.uid}/nutritionalPreferences/${index}`);
    update(dietRef, {
        value: value
    }).catch((error) => {
        console.error(error);
        alert("Error updating user data.");
    });
    get(child(dbRef, `users/${auth.currentUser.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            setUserData(snapshot.val());
        }
    }).catch((error) => {
        console.error(error);
        alert("Error retrieving user data.");
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
            {prefs && prefs.map(diet =>
                <ListGroup.Item id="diet" onClick={() => {changeDiet(diet.index, !diet.value);}}>
                    <span id="dietText">{diet.name}</span>
                    <span>{IconSelector(diet.value)}</span>
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
