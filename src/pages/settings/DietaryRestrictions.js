import './DietaryRestrictions.css';
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

function DietaryRestrictions ()
{
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );
  // const user = auth.currentUser;

  const diets = [
    ["dairyFree", "Dairy Free"],
    ["glutenFree", "Gluten Free"],
    ["lowFodmap", "Low FODMAP"],
    ["sustainable", "Sustainable"],
    ["vegan", "Vegan"],
    ["vegetarian", "Vegetarian"],
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
            if (!snapshot.val().dietaryRestrictions) {
              for (let i = 0; i < diets.length; i++) {
                const newDietRef = child(dbRef, `users/${currentUser.uid}/dietaryRestrictions/${i}`);
                set(newDietRef, {
                    id: diets[i][0],
                    index: i,
                    name: diets[i][1],
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

  const changeDiet = (index, value) => {
    const dbRef = ref(getDatabase());
    const dietRef = child(dbRef, `users/${auth.currentUser.uid}/dietaryRestrictions/${index}`);
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
          <h1 id="titleText">Dietary Restrictions</h1>
          <ListGroup id="dietaryRestrictions" variant="flush">
            {userData.dietaryRestrictions && userData.dietaryRestrictions.map(diet =>
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

export default DietaryRestrictions;
