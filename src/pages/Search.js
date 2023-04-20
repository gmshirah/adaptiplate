import { useLocation, Link, useNavigate } from 'react-router-dom';
import
{
  Container,
  Row,
  Col,
  Card,
  Spinner
} from 'react-bootstrap';
import { app, api, apiKey, apiHost } from '../index.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import
{
  getDatabase,
  ref,
  set,
  child,
  get,
  update,
} from "firebase/database";

import
{
  getAuth,
} from "firebase/auth";

function parseId ( source, title )
{
  return source.replace( / /g, "-" ).toLowerCase().split( "." )[ 0 ] + "-" + title.replace( / /g, "-" ).toLowerCase();
}

const RecipeCard = ( { recipe } ) =>
{
  const navigate = useNavigate();

  const [ loading, setLoading ] = useState( false );

  const onRecipeCardClick = ( e ) =>
  {
    e.preventDefault();
    setLoading( true );
    axios.get( `${ api }/recipes/${ recipe.id }/information`, {
      params: {
        includeNutrition: true,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
      }
    } )
      .then( ( response ) =>
      {
        const dbRef = ref( getDatabase() );
        const newId = parseId( response.data.sourceName, response.data.title );
        const newRecipeRef = child( dbRef, `recipes/${ newId }` );
        response.data.id = newId;


        const auth = getAuth( app );
        if ( auth.currentUser )
        {
          const userRef = child( dbRef, `users/${ auth.currentUser.uid }` );
          get( userRef ).then( ( snapshot ) =>
          {
            const userData = snapshot.val();
            const recentlyViewed = userData.recentlyViewed || [];
            if ( recentlyViewed[ 0 ] !== newId )
            {
              const newRecentlyViewed = [ newId, ...recentlyViewed ].slice( 0, 3 );
              update( userRef, { recentlyViewed: newRecentlyViewed } );
            }
          } ).catch( ( error ) =>
          {
            alert( "Error updating user data. Please try again!" );
            console.error( error );
          } );
        }

        set( newRecipeRef, response.data ).then( () =>
        {
          setLoading( false );
          navigate( `/recipe/${ newId }` );
        } ).catch( ( error ) =>
        {
          setLoading( false );
          alert( "Error retrieving recipe. Please try again!" );
          console.error( error );
        } );
      } )
      .catch( ( error ) =>
      {
        setLoading( false );
        alert( "Error retrieving recipe. Please try again!" );
        console.error( error );
      } )
      .then( () =>
      {

      } );
  };

  return (
    <Col md={6}>
      {loading ? (
        <div id="loadingScreen">
          <Spinner id="loadingSpinner" variant="light" animation="border" />
        </div>
      ) : ( <span /> )}

      <Card id="recipeCard" onClick={onRecipeCardClick}>
        <Card.Img variant="top" src={recipe.image} />
        <Card.ImgOverlay>
          <h4 id="recipeTitle">{recipe.title}</h4>
        </Card.ImgOverlay>
      </Card>
    </Col>
  );
};

function Search ()
{
  const location = useLocation();
  const recipes = location.state.recipes;

  return (
    <Container>
      <h1 id="titleText">Search Results</h1>
      <Row>
        {recipes.results.map( ( recipe ) => (
          <RecipeCard recipe={recipe} />
        ) )}
      </Row>
    </Container>
  );
}

export default Search;