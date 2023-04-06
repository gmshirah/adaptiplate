import './Saved.css';
import { Link } from 'react-router-dom';
import
{
  Container,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { useEffect, useState } from 'react';
import { auth } from './Login.js';
import { onAuthStateChanged } from 'firebase/auth';

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

  const [ savedRecipes, setSavedRecipes ] = useState( [] );
  useEffect( () =>
  {
    if ( auth.currentUser )
    {
      const recipeIdsRef = firebase.database().ref( `users/${ auth.currentUser.uid }/recipes` );
      recipeIdsRef.once( 'value' )
        .then( ( snapshot ) =>
        {
          const tempSavedRecipes = [];
          snapshot.forEach( ( element ) =>
          {
            const recipeId = element.val();
            const recipeRef = firebase.database().ref( `recipes/${ recipeId }` );
            recipeRef.once( 'value' )
              .then( ( recipeSnapshot ) =>
              {
                const recipeData = recipeSnapshot.val();
                tempSavedRecipes.push( recipeData );
                setSavedRecipes( tempSavedRecipes );
              } );
          } );
        } )
        .catch( ( error ) =>
        {
          console.error( error );
        } );
    } else
    {
      setSavedRecipes( [] );
    }

  }, [ auth.currentUser ] );

  return (
    <Container>

      {auth.currentUser ? (
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
