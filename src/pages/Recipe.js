import './Recipe.css';
import axios from 'axios';
import { app, api, apiKey, apiHost } from '../index.js';
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
  Tab,
  Spinner
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
  const [subs, setSubs] = useState(null);
  const [loading, setLoading] = useState(false);

  const onIngredientClick = (e) => {
    e.preventDefault();
    if (!subs) {
      setLoading(true);
      axios.get(`${api}/food/ingredients/${ingredient.id}/substitutes`, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        }
      })
      .then((response) => {
        if (response.data.substitutes) {
          setSubs(response.data.substitutes);
        } else {
          setSubs([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert("Error retrieving substitutions. Please try again!");
        console.error(error);
      })
      .then(() => {

      });
    }
  };

  return (
    <Accordion.Item eventKey={ingredient.id} onClick={onIngredientClick}>
      <Accordion.Header>
        <span id="ingredientName">{ingredient.name}</span>
        <span id="ingredientAmount">{ingredient.amount % 1 == 0 ? ingredient.amount : (ingredient.amount).toFixed(2)} {ingredient.measures.us.unitShort}</span>
      </Accordion.Header>
      <Accordion.Body>
        {loading ? (
          <div>
            <Spinner animation="border" />
          </div>
        ) : (
          subs && subs.length > 0 ? (
            <div>
              <h3 id="subTitle">Substitute Conversions</h3>
              {subs.map(sub =>
                <Container id="sub">
                  <div>
                    <p id="subDesc">{sub}</p>
                  </div>
                  <span className="material-symbols-outlined" id="infoIcon">
                    info
                  </span>
                </Container>
              )}
            </div>
          ) : (
            <Container id="noSub">
              <p id="noSubText">No substitutions available!</p>
            </Container>
          )
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

      <div id="dietTags">
        {recipeData.dairyFree ? (
          <span id="tag">Dairy Free</span>
        ) : (<span />)}
        {recipeData.glutenFree ? (
          <span id="tag">Gluten Free</span>
        ) : (<span />)}
        {recipeData.lowFodmap ? (
          <span id="tag">Low FODMAP</span>
        ) : (<span />)}
        {recipeData.sustainable ? (
          <span id="tag">Sustainable</span>
        ) : (<span />)}
        {recipeData.vegan ? (
          <span id="tag">Vegan</span>
        ) : (<span />)}
        {recipeData.vegetarian ? (
          <span id="tag">Vegetarian</span>
        ) : (<span />)}
      </div>

      <div id="recipeInfo">
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            payments
          </div>
          <p id="statText">${(recipeData.pricePerServing / 100).toFixed(2)}</p>
          <p id="statName"><i>per serving</i></p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            favorite
          </div>
          <p id="statText">{recipeData.healthScore}</p>
          <p id="statName"><i>health score</i></p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            schedule
          </div>
          <p id="statText">{recipeData.readyInMinutes}</p>
          <p id="statName"><i>minutes</i></p>
        </div>
      </div>

      <div id="servingsInfo">
        <span>Servings:</span>
        <span>{recipeData.servings}</span>
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
