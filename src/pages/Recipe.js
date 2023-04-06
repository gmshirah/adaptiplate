import './Recipe.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
  let [subs, setSubs] = useState(
    [
      {
        id: 1,
        name: "Chicken",
        amount: "1/2 LB",
        subs: [
          {
            name: "Tofu",
            effect: "+ 30g fat"
          }
        ]
      },
      {
        id: 2,
        name: "Flour",
        amount: "2 Cup",
        subs: [
          {
            name: "Corn Starch",
            effect: "- 200 calories"
          },
          {
            name: "Almond Flour",
            effect: "+ 10g protein"
          }
        ]
      },
      {
        id: 3,
        name: "Egg",
        amount: "2",
        subs: [
          {
            name: "Applesauce",
            effect: "+ 10g sugar"
          }
        ]
      },
      {
        id: 4,
        name: "Soy Sauce",
        amount: "2 TBSP",
        subs: [
          {
            name: "Worcestershire Sauce",
            effect: "- 100g sodium"
          }
        ]
      },
      {
        id: 5,
        name: "Orange Juice",
        amount: "4 OZ",
        subs: [
          {
            name: "Lemon Juice",
            effect: "+ 10g sugar"
          }
        ]
      }
    ]
  );

  let [recipe, setRecipe] = useState({
    name: "Orange Chicken",
    price: "$$",
    time: "30 min",
    health: 2,
    favorite: false
  })

  let [favorite, setFavorite] = useState(false);

  let navigate = useNavigate();

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

      <h1 id="recipeTitleText">{recipe.name}</h1>

      {/* FOOD IMAGE  */}
      <Image id="recipeImage" src="https://www.modernhoney.com/wp-content/uploads/2018/01/Chinese-Orange-Chicken-2.jpg" />

      <div id="recipeInfo">
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            payments
          </div>
          <p id="statText">{recipe.price}</p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            favorite
          </div>
          <p id="statText">{recipe.health}</p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            schedule
          </div>
          <p id="statText">{recipe.time}</p>
        </div>
      </div>

      <h3 id="ingredientsHeading">Ingredients</h3>

      <div>
        {subs && subs.map(ingredient =>
          <Accordion>
            <Ingredient key={ingredient.id} ingredient={ingredient} />
          </Accordion>
        )}
      </div>
    </Container>
  );
}

export default Recipe;
