import './Recipe.css';
import { app } from '../index.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Accordion,
  Button,
  Container,
  Form,
  InputGroup,
  Row,
  Col,
  Image,
} from 'react-bootstrap';
import { initializeApp } from "firebase/app";
import { getAuth , onAuthStateChanged } from "firebase/auth";
import
  {
    getDatabase,
    ref,
    get,
    set,
    child,
    remove,
    push
  } from "firebase/database";

// const DBQuery = (path) => {
//   console.log(path);
//   get(child(dbRef, path)).then((snapshot) => {
//     if (snapshot.exists && snapshot.val()) {
//       console.log(snapshot.val())
//       return snapshot.val();
//     } else {
//       console.error("Error: DB data could not be accessed");
//       return -1;
//     }
//   }).catch((error) => {
//     console.error("DB Query Error: " + error);
//     return -1;
//   })
// };

const Ingredient = ({ ingredient }) => {
  return (
    <Accordion.Item eventKey={ingredient.id}>
      <Accordion.Header>
        <span id="ingredientName">{ingredient.name}</span>
        <span id="ingredientAmount">{ingredient.amount}</span>
      </Accordion.Header>
      <Accordion.Body>
        {ingredient.subs && ingredient.subs.map(sub =>
          <Container id="sub">
            <div>
              <p id="subName">{sub.name}</p>
              <p id="subEffect">{sub.effect}</p>
            </div>
            <span className="material-symbols-outlined" id="infoIcon">
              info
            </span>
          </Container>
        )}
      </Accordion.Body>
    </Accordion.Item>
  );
}

function Recipe() {
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );

  let [saved, setSaved] = useState(false);

  let [loggedIn, setLoggedIn] = useState(false);

  let navigate = useNavigate();
  let params = useParams();

  const [userData, setUserData] = useState([]);
  const [recipeData, setRecipeData] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `recipes/${params.id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setRecipeData(snapshot.val());
        setIngredientData(snapshot.val().ingredients);
      }
    }).catch((error) => {
      console.error(error);
    });

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
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

  useEffect(() => {
    if (userData.recipes) {
      for (let id in userData.recipes) {
        if (userData.recipes[id].id === recipeData.id) {
          setSaved(true);
        }
      }
    }
  }, [userData, recipeData]);

  const SaveButtonClick = (event) => {
    const dbRef = ref(getDatabase());
    if (saved) {
      // Need to remove from saved
      remove(child(dbRef, `users/${auth.currentUser.uid}/recipes/${recipeData.id}`)).then(() => {
        setSaved(false);
      }).catch((error) => {
        console.error(error);
        alert("Error removing from saved recipes. Please try again!");
      });
    } else {
      // Need to add to saved
      if (!loggedIn) {
        alert("You must login to save recipes!");
      } else {
        const newRecipeRef = child(dbRef, `users/${auth.currentUser.uid}/recipes/${recipeData.id}`);
        set(newRecipeRef, {
            id: recipeData.id
        });
        get(child(dbRef, `users/${auth.currentUser.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        }).catch((error) => {
          console.error(error);
        });
        setSaved(true);
      }
    }
  };

  const BackButtonClick = (event) => {
    navigate(-1);
  };

  const StarSelector = () => {
    if (saved) {
      return (
        <span  className="material-symbols-outlined" id="saveIconFilled">
          star
        </span>
      );
    } else {
      return (
        <span  className="material-symbols-outlined" id="saveIcon">
          star
        </span>
      );
    }
  }

  return (
    <Container>
      {/* BACK AND SAVE BUTTONS */}
      <Row>
        <Col id="backCol">
          <Button onClick={BackButtonClick} id="backBtn">
            <span className="material-symbols-outlined" id="backIcon">
              arrow_back
            </span>
          </Button>
        </Col>
        <Col id="saveCol">
          <Button onClick={SaveButtonClick} id="saveBtn">{StarSelector()}</Button>
        </Col>
      </Row>

      {/* SEARCH BAR */}
      <Form>
        <InputGroup>
          <Form.Control type="text" />
          <Button variant="outline-secondary" id="searchBtn" type="submit">
            <span className="material-symbols-outlined">
              search
            </span>
          </Button>
        </InputGroup>
      </Form>

      <h1 id="recipeTitleText">{recipeData.name}</h1>

      {/* FOOD IMAGE  */}
      <Image id="recipeImage" src={recipeData.img} />

      <div id="recipeInfo">
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            payments
          </div>
          <p id="statText">{recipeData.price}</p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            favorite
          </div>
          <p id="statText">{recipeData.health}</p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            schedule
          </div>
          <p id="statText">{recipeData.time}</p>
        </div>
      </div>

      <h3 id="ingredientsHeading">Ingredients</h3>

      <div>
        {ingredientData.map(ingredient =>
          <Accordion>
            <Ingredient key={ingredient.id} ingredient={ingredient} />
          </Accordion>
        )}
      </div>
    </Container>
  );
}

export default Recipe;
