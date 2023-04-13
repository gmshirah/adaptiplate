import './Home.css';
import { app, api, apiKey, apiHost } from '../index.js';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import
{
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Card,
  Spinner
} from 'react-bootstrap';
import
{
  getDatabase,
  ref,
  set,
  child,
  get,
  update
} from "firebase/database";
import
{
  getAuth, onAuthStateChanged,
} from "firebase/auth";

const recipes = [
  {
    id: 1,
    name: 'Spaghetti',
    img: 'https://www.allrecipes.com/thmb/ASRzxoRrPoMLQEpczFvU7osJNF4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21353-italian-spaghetti-sauce-with-meatballs-2x1-141-cedbb650b4264576ab923c91215ce7fc.jpg',
    cost: '$10',
    health: 'Healthy',
    time: '30 min',
  },
  {
    id: 0,
    name: 'Orange Chicken',
    img: 'https://www.modernhoney.com/wp-content/uploads/2018/01/Chinese-Orange-Chicken-2.jpg',
    cost: '$8',
    health: 'Moderate',
    time: '30 min',
  },
];

const RecipeCard = ( { recipe, path } ) =>
{
  const handleClick = ( event ) =>
  {
  };

  return (
    <Col md={6}>
      <Link to={`/recipe/${ recipe.id }`} onClick={handleClick}>
        <Card id="recipeCard">
          <Card.Img variant="top" src={recipe.image} />
          <Card.ImgOverlay>
            <h4 id="recipeTitle">{recipe.title}</h4>
            <div id="recipeStats">
              <Card.Text><b>${( recipe.pricePerServing / 100 ).toFixed( 2 )}</b> <i id="recipeStatsLabel">per serving</i></Card.Text>
              <Card.Text><b>{recipe.healthScore}</b> <i id="recipeStatsLabel">health score</i></Card.Text>
              <Card.Text><b>{recipe.readyInMinutes}</b> <i id="recipeStatsLabel">minutes</i></Card.Text>
            </div>
          </Card.ImgOverlay>
        </Card>
      </Link>
    </Col>
  );
};

function parseId ( source, title )
{
  return source.replace( / /g, "-" ).toLowerCase().split( "." )[ 0 ] + "-" + title.replace( / /g, "-" ).toLowerCase();
}

function Home ()
{
  const navigate = useNavigate();

  const [ loading, setLoading ] = useState( false );

  const [ searchHistory, setHistory ] = useState( [] );

  const [ historyLoaded, setHistoryLoaded ] = useState( false );



  const handleNewSearch = async ( event ) =>
  {
    event.preventDefault();
    setLoading( true );
    const input = document.querySelector( 'input[name="searchInput"]' ).value;
    const regex = /^(http|https):\/\/([\w\d]+\.)+[\w\d]{2,}(\/.*)?$/;
    if ( regex.test( input ) )
    {
      // URL input
      axios.get( `${ api }/recipes/extract`, {
        params: {
          url: input,
          analyze: true,
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
    } else
    {
      // Search input
      axios.get( `${ api }/recipes/complexSearch`, {
        params: {
          query: input,
          sort: "popularity",
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        }
      } )
        .then( ( response ) =>
        {
          setLoading( false );
          navigate( '/search', { state: { recipes: response.data } } );
        } )
        .catch( ( error ) =>
        {
          setLoading( false );
          alert( "Error retrieving recipes. Please try again!" );
          console.error( error );
        } )
        .then( () =>
        {

        } );
    }
  };

  useEffect( () =>
  {
    const auth = getAuth( app );
    onAuthStateChanged( auth, ( currentUser ) =>
    {
      setHistory( [] );
      if ( currentUser )
      {
        const dbRef = ref( getDatabase() );
        const recentRecipesRef = child( dbRef, `users/${ currentUser.uid }/recentlyViewed` );
        get( recentRecipesRef ).then( ( snapshot ) =>
        {
          const promises = [];
          snapshot.forEach( ( childSnapshot ) =>
          {
            const recipeRef = child( dbRef, `recipes/${ childSnapshot.val() }` );
            promises.push( get( recipeRef ) );
          } );
          Promise.all( promises ).then( ( recipeInfos ) =>
          {
            const tempHistory = recipeInfos.map( ( recipeInfo ) => recipeInfo.val() );
            setHistory( tempHistory );
          } ).catch( ( error ) =>
          {
            console.error( error );
          } );
        } ).catch( ( error ) =>
        {
          console.error( error );
        } );
      }
    } );
  }, [] );


  return (
    <Container>
      {loading ? (
        <div id="loadingScreen">
          <Spinner id="loadingSpinner" variant="light" animation="border" />
        </div>
      ) : ( <span /> )}

      <h1 id="titleText">Welcome!</h1>
      <h3 id="headingText">Paste a recipe link below</h3>
      <Form>
        <InputGroup>
          <Form.Control type="text" name="searchInput" />
          <Button variant="outline-secondary" id="searchBtn" type="submit" onClick={handleNewSearch}>
            {<span className="material-symbols-outlined">
              search
            </span>}
            {/* <Link to={dst} id="searchLink" className="material-symbols-outlined">
              search
            </Link> */}
          </Button>
        </InputGroup>
      </Form>
      <h3 id="headingText">Recently Viewed</h3>
      {
        <div>
          <Row>
            {searchHistory.map( ( recipe ) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ) )}
          </Row>
        </div>
      }
    </Container>
  );
}

export default Home;
