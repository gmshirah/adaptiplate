import './Home.css';
import { app, api, apiKey } from '../index.js';
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
  } from "firebase/database";

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
          <Card.Img variant="top" src={recipe.img} />
          <Card.ImgOverlay>
            <h4 id="recipeTitle">{recipe.name}</h4>
            <div id="recipeStats">
              <Card.Text>{recipe.cost}</Card.Text>
              <Card.Text>{recipe.health}</Card.Text>
              <Card.Text>{recipe.time}</Card.Text>
            </div>
          </Card.ImgOverlay>
        </Card>
      </Link>
    </Col>
  );
};

function parseId(source, title) {
  return source.replace(/ /g, "-").toLowerCase().split(".")[0] + "-" + title.replace(/ /g, "-").toLowerCase();
}

function Home ()
{
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleNewSearch = async ( event ) =>
  {
    event.preventDefault();
    setLoading(true);
    const input = document.querySelector( 'input[name="searchInput"]' ).value;
    const regex = /^(http|https):\/\/([\w\d]+\.)+[\w\d]{2,}(\/.*)?$/;
    if ( regex.test( input ) )
    {
      console.log( 'recipe' );

      axios.get(`${api}/recipes/extract`, {
        params: {
          apiKey: apiKey,
          url: input,
          analyze: true,
          includeNutrition: true,
        }
      })
      .then((response) => {
        const dbRef = ref(getDatabase());
        const newId = parseId(response.data.sourceName, response.data.title);
        const newRecipeRef = child(dbRef, `recipes/${newId}`);
        response.data.id = newId;
        set(newRecipeRef, response.data).then(() => {
          setLoading(false);
          navigate(`/recipe/${newId}`);
        }).catch((error) => {
          setLoading(false);
          alert("Error retrieving recipe. Please try again!");
          console.error(error);
        });
      })
      .catch((error) => {
        setLoading(false);
        alert("Error retrieving recipe. Please try again!");
        console.error(error);
      })
      .then(() => {
          
      });
    } else
    {
      try
      {
        const apiKey = '4e44682c76b3497d87414d53291ba8a6';
        const response = await fetch( `https://api.spoonacular.com/recipes/complexSearch?apiKey=${ apiKey }&query=${ input }` );
        if ( response.ok )
        {
          const data = await response.json();
          navigate( '/search', { state: { recipes: data } } );
        } else
        {
          throw new Error( 'API request failed' );
        }
      } catch ( error )
      {
        console.error( 'Error fetching data', error );
      }
    }
  };

  return (
    <Container>
      {loading ? (
        <div id="loadingScreen">
          <Spinner id="loadingSpinner" variant="light" animation="border" />
        </div>
      ) : (<span />)}

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
      {/* <div>
        <Row>
          {recipes.map( ( recipe ) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ) )}
        </Row>
      </div> */}
    </Container>
  );
}

export default Home;
