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


  const firebaseConfig = {
    apiKey: "AIzaSyBlPgsYfKfSl15rkPbRzdX_7pjf3N5i424",
    authDomain: "adaptipla.firebaseapp.com",
    databaseURL: "https://adaptipla-default-rtdb.firebaseio.com",
    projectId: "adaptipla",
    storageBucket: "adaptipla.appspot.com",
    messagingSenderId: "826210962785",
    appId: "1:826210962785:web:1ba40a0510126f3dc54920",
    measurementId: "G-235FB92HNR"
  };

  firebase.initializeApp( firebaseConfig );

  const [ savedRecipes, setSavedRecipes ] = useState( [] );
  useEffect( () =>
  {
    const recipeIdsRef = firebase.database().ref( `users/-NSD9UtFvXgxz4Mwgbmm/recipes` );
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
  }, [] );


  return (
    <Container>
      <h1 id="titleText">Saved Recipes</h1>
      <div id="scrollableContent">
        <Row>
          {savedRecipes.map( ( recipe ) => (
            <RecipeCard recipe={recipe} />
          ) )}
        </Row>
      </div>
    </Container>
  );
}

export default Saved;
