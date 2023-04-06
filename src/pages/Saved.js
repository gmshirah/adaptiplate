import './Saved.css';
import { app } from '../index.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import
{
  Container,
  Row,
  Col,
  Card
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
      <Link to="/recipe" onClick={handleClick}>
        <Card>
          <Card.Img variant="top" src={recipe.img} />
          <Card.ImgOverlay>
            <h4 id="recipeTitle">{recipe.name}</h4>
            <div id="recipeStats">
              <Card.Text>{recipe.price}</Card.Text>
              <Card.Text>{recipe.health}</Card.Text>
              <Card.Text>{recipe.time}</Card.Text>
            </div>
          </Card.ImgOverlay>
        </Card>
      </Link>
    </Col>
  );
};

function Saved ()
{
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth( app );
  const user = auth.currentUser;

  const [userData, setUserData] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect( () =>
  {
    if ( user )
    {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      }).catch((error) => {
        console.error(error);
        alert("Error retrieving user data.");
      });

      const db = getDatabase();
      const dbSavedRecipesRef = ref(db, `users/${user.uid}/recipes`);
      onValue(dbSavedRecipesRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((recipeSnapshot) => {
          const recipeData = recipeSnapshot.val();
          arr.push(recipeData);
        });
        arr.reverse();
        setSavedRecipes(arr);
      }, {
        onlyOnce: false
      });
    } else
    {
      setSavedRecipes( [] );
    }

  }, [ user ] );

  return (
    <Container>
      {user ? (
        <div>
          <h1 id="titleText">Saved Recipes</h1>
          <div id="scrollableContent">
            <Row>
              {savedRecipes.map( ( recipe ) => (
                <RecipeCard recipe={recipe} />
              ) )}
            </Row>
          </div>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button class="loginButton">Login</button>
          </Link>
        </div>
      )}
    </Container>
  );

}

export default Saved;
