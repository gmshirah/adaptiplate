import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
Container,
Row,
Col,
Card,
Spinner
} from 'react-bootstrap';
import { app, api, apiKey, apiHost } from '../index.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
getDatabase,
ref,
set,
child,
} from "firebase/database";

function parseId(source, title) {
  return source.replace(/ /g, "-").toLowerCase().split(".")[0] + "-" + title.replace(/ /g, "-").toLowerCase();
}

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  
  const onRecipeCardClick = (e) => {
    e.preventDefault();
    axios.get(`${api}/recipes/${recipe.id}/information`, {
      params: {
        includeNutrition: true,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
      }
    })
      .then((response) => {
        const dbRef = ref(getDatabase());
        const newId = parseId(response.data.sourceName, response.data.title);
        const newRecipeRef = child(dbRef, `recipes/${newId}`);
        response.data.id = newId;
        set(newRecipeRef, response.data).then(() => {
          navigate(`/recipe/${newId}`);
        }).catch((error) => {
          alert("Error retrieving recipe. Please try again!");
          console.error(error);
        });
      })
      .catch((error) => {
        alert("Error retrieving recipe. Please try again!");
        console.error(error);
      })
      .then(() => {

      });
  };

  return (
    <Col md={6}>
      <Card id="recipeCard" onClick={onRecipeCardClick}>
        <Card.Img variant="top" src={recipe.image} />
        <Card.ImgOverlay>
          <h4 id="recipeTitle">{recipe.title}</h4>
        </Card.ImgOverlay>
      </Card>
    </Col>
  );
};

function Search() {
  const location = useLocation();
  const recipes = location.state.recipes;
  console.log(recipes);

  const [loading, setLoading] = useState(false);

  return (
    <Container>
      {loading ? (
        <div id="loadingScreen">
          <Spinner id="loadingSpinner" variant="light" animation="border" />
        </div>
      ) : (<span />)}

      <div>
        <h1 id="titleText">Search Results</h1>
        <div>
          <Row>
            {recipes.results.map((recipe) => (
              <RecipeCard recipe={recipe} />
            ))}
          </Row>
        </div>
      </div>
    </Container>
  );
}

export default Search;