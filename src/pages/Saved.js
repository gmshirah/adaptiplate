import './Saved.css';
import { app } from '../index.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import
{
  Container,
  Row,
  Col,
  Card,
  Image,
  Button
} from 'react-bootstrap';
import
{
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import
{
  getDatabase,
  ref,
  get,
  child,
  onValue
} from "firebase/database";

const RecipeCard = ( { recipe, path } ) =>
{
  const handleClick = ( event ) =>
  {
  };

  return (
    <Col md={6}>
      <Link to={`/recipe/${recipe.id}`} onClick={handleClick}>
        <Card id="recipeCard">
          <Card.Img variant="top" src={recipe.image} />
          <Card.ImgOverlay>
            <h4 id="recipeTitle">{recipe.title}</h4>
            <div id="recipeStats">
              <Card.Text><b>${(recipe.pricePerServing / 100).toFixed(2)}</b> <i id="recipeStatsLabel">per serving</i></Card.Text>
              <Card.Text><b>{recipe.healthScore}</b> <i id="recipeStatsLabel">health score</i></Card.Text>
              <Card.Text><b>{recipe.readyInMinutes}</b> <i id="recipeStatsLabel">minutes</i></Card.Text>
            </div>
          </Card.ImgOverlay>
        </Card>
      </Link>
    </Col>
  );
};

const RecipeCardAlt = ( { recipe, path } ) =>
{
  const handleClick = ( event ) =>
  {
  };

  return (
    <Col md={6}>
      <Link to={`/recipe/${recipe.id}`} id="recipeCardLinkAlt" onClick={handleClick}>
        <div id="recipeCardAlt">
          <div id="recipeCardHeaderAlt">
            <Image thumbnail id="recipeImageAlt" src={recipe.image} />
            <div id="recipeTitleDivAlt">
              <h4 id="recipeTitleAlt">{recipe.title}</h4>
              <div id="cardDietTags">
                {recipe.dairyFree ? (
                  <span id="cardTag">Dairy Free</span>
                ) : (<span />)}
                {recipe.glutenFree ? (
                  <span id="cardTag">Gluten Free</span>
                ) : (<span />)}
                {recipe.lowFodmap ? (
                  <span id="cardTag">Low FODMAP</span>
                ) : (<span />)}
                {recipe.sustainable ? (
                  <span id="cardTag">Sustainable</span>
                ) : (<span />)}
                {recipe.vegan ? (
                  <span id="cardTag">Vegan</span>
                ) : (<span />)}
                {recipe.vegetarian ? (
                  <span id="cardTag">Vegetarian</span>
                ) : (<span />)}
              </div>
            </div>
          </div>
          <hr />
          <div id="recipeCardBodyAlt">
            <div id="cardStat">
              <div className="material-symbols-outlined" id="cardStatIcon">
                payments
              </div>
              <p id="cardStatText">${(recipe.pricePerServing / 100).toFixed(2)}</p>
              <p id="cardStatName"><i>per serving</i></p>
            </div>
            <div id="cardStat">
              <div className="material-symbols-outlined" id="cardStatIcon">
                favorite
              </div>
              <p id="cardStatText">{recipe.healthScore}</p>
              <p id="cardStatName"><i>health score</i></p>
            </div>
            <div id="cardStat">
              <div className="material-symbols-outlined" id="cardStatIcon">
                schedule
              </div>
              <p id="cardStatText">{recipe.readyInMinutes}</p>
              <p id="cardStatName"><i>minutes</i></p>
            </div>
          </div>
        </div>
      </Link>
    </Col>
  );
};

function Saved ()
{
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );
  // const user = auth.currentUser;

  const [loggedIn, setLoggedIn] = useState(false);

  const [userData, setUserData] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const [cardLayout, setCardLayout] = useState(false);

  useEffect( () =>
  {
    onAuthStateChanged(auth, (currentUser) => {
      setSavedRecipes([]);
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

        getSavedRecipes();
      }
      setLoggedIn(currentUser != null);
    });
  }, [] );

  function getSavedRecipes() {
    const dbRef = ref(getDatabase());
    const db = getDatabase();
    const dbSavedRecipesRef = ref(db, `users/${auth.currentUser.uid}/recipes`);
    onValue(dbSavedRecipesRef, (snapshot) => {
      let recipeIds = [];
      snapshot.forEach((recipeIdSnapshot) => {
        const recipeId = recipeIdSnapshot.val();
        recipeIds.push(recipeId);
      });
      recipeIds.forEach((id) => {
        get(child(dbRef, `recipes/${id.id}`)).then((recipeSnapshot) => {
          if (recipeSnapshot.exists()) {
            setSavedRecipes(oldArray => [...oldArray, recipeSnapshot.val()]);
          }
        }).catch((error) => {
          console.error(error);
          alert("Error retrieving recipe data.");
        });
      });
    }, {
      onlyOnce: false
    });
  }

  const switchCardLayout = (event) => {
    setCardLayout(!cardLayout);
  };

  return (
    <Container>
      {loggedIn ? (
        <div>
          <h1 id="titleText">Saved Recipes</h1>
          <div>
            <Row>
              {cardLayout ? (
                savedRecipes.map( ( recipe ) => (
                  <RecipeCardAlt recipe={recipe} />
                ) )
              ) : (
                savedRecipes.map( ( recipe ) => (
                  <RecipeCard recipe={recipe} />
                ) )
              )}
            </Row>
          </div>
          <Button variant="secondary" id="switchCardLayoutBtn" onClick={switchCardLayout}>Switch Card Layout</Button>
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

export default Saved;
