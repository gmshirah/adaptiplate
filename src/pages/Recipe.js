import './Recipe.css';
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
} from 'react-bootstrap';
import
{
  getDatabase,
  ref,
  get,
  child
} from "firebase/database";

const Ingredient = ({ ingredient }) => {
  return (
    <Accordion.Item eventKey={ingredient.id}>
      <Accordion.Header>
        <span id="ingredientName">{ingredient.name}</span>
        <span id="ingredientAmount">{ingredient.amount}</span>
      </Accordion.Header>
      <Accordion.Body>
        {ingredient.subs && ingredient.subs.map(sub =>
          <Container id="sub">
            <div>
              <p id="subName">{sub.name}</p>
              <p id="subEffect">{sub.effect}</p>
            </div>
            <span className="material-symbols-outlined" id="infoIcon">
              info
            </span>
          </Container>
        )}
      </Accordion.Body>
    </Accordion.Item>
  );
}

function Recipe() {
  let navigate = useNavigate();
  let params = useParams();

  const [recipeData, setRecipeData] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);

  const [favorite, setFavorite] = useState(false);
  
  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `recipes/${params.id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setRecipeData(snapshot.val());
        setIngredientData(snapshot.val().ingredients);
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const SaveButtonClick = (event) => {
    setFavorite(!favorite);
  };

  const BackButtonClick = (event) => {
    navigate(-1);
  };

  const StarSelector = () => {
    if (favorite) {
      return (
        <span className="material-symbols-outlined" id="saveIconFilled">
          star
        </span>
      );
    } else {
      return (
        <span className="material-symbols-outlined" id="saveIcon">
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

      <h1 id="recipeTitleText">{recipeData.name}</h1>

      {/* FOOD IMAGE  */}
      <Image id="recipeImage" src={recipeData.img} />

      <div id="recipeInfo">
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            payments
          </div>
          <p id="statText">{recipeData.price}</p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            favorite
          </div>
          <p id="statText">{recipeData.health}</p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            schedule
          </div>
          <p id="statText">{recipeData.time}</p>
        </div>
      </div>

      <h3 id="ingredientsHeading">Ingredients</h3>

      <div>
        {ingredientData.map(ingredient =>
          <Accordion>
            <Ingredient key={ingredient.id} ingredient={ingredient} />
          </Accordion>
        )}
      </div>
    </Container>
  );
}

export default Recipe;
