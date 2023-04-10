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
  Tabs,
  Tab
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
        <span id="ingredientAmount">{ingredient.amount} {ingredient.measures.us.unitShort}</span>
      </Accordion.Header>
      <Accordion.Body>
        {ingredient.substitutions ? (
          ingredient.subs && ingredient.subs.map(sub =>
            <Container id="sub">
              <div>
                <p id="subName">{sub.name}</p>
                <p id="subEffect">{sub.effect}</p>
              </div>
              <span className="material-symbols-outlined" id="infoIcon">
                info
              </span>
            </Container>
          )
        ) : (
          <Container id="noSub">
            <p id="noSubText">No substitutions available!</p>
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
  const [instructionData, setInstructionData] = useState([]);

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `recipes/${params.id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setRecipeData(snapshot.val());
      }
    }).catch((error) => {
      console.error(error);
    });

    get(child(dbRef, `recipes/${params.id}/extendedIngredients`)).then((snapshot) => {
      if (snapshot.exists()) {
        setIngredientData(snapshot.val());
      }
    }).catch((error) => {
      console.error(error);
    });

    get(child(dbRef, `recipes/${params.id}/analyzedInstructions/0/steps`)).then((snapshot) => {
      if (snapshot.exists()) {
        setInstructionData(snapshot.val());
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

      <h1 id="recipeTitleText">{recipeData.title}</h1>
      <p id="recipeSourceText"><i>{recipeData.sourceName}</i></p>

      {/* FOOD IMAGE  */}
      <Image id="recipeImage" src={recipeData.image} />

      <div id="recipeInfo">
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            payments
          </div>
          <p id="statText">${(recipeData.pricePerServing / 100).toFixed(2)}</p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            favorite
          </div>
          <p id="statText">{recipeData.healthScore}</p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            schedule
          </div>
          <p id="statText">{recipeData.readyInMinutes} mins</p>
        </div>
      </div>

      <Tabs
        defaultActiveKey="ingredients"
        id="ingredientsInstructionsTab"
        justify
      >
        <Tab eventKey="ingredients" title="Ingredients">
          {ingredientData.map(ingredient =>
            <Accordion>
              <Ingredient key={ingredient.id} ingredient={ingredient} />
            </Accordion>
          )}
        </Tab>
        <Tab eventKey="instructions" title="Instructions">
            <ol>
              {instructionData.map(instruction =>
                <li id="instruction">
                  {instruction.step}
                </li>
              )}
            </ol>
        </Tab>
      </Tabs>

      <a id="visitSourceLink" target="_blank" href={recipeData.sourceUrl}>
        <span id="visitRecipeSource">Visit recipe source</span>
        <span id="openLinkIcon" class="material-symbols-outlined">
          open_in_new
        </span>
      </a>
    </Container>
  );
}

export default Recipe;
