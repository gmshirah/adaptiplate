import './Recipe.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Button,
  Container,
  Form,
  InputGroup,
  Row,
  Col,
  Image
} from 'react-bootstrap';

import { Accordion, AccordionSummary, Typography, AccordionDetails, responsiveFontSizes } from '@mui/material';
import { borderRadius } from '@mui/system';
import backButton from "../assets/back-arrow.png";
import chickenPic from "../assets/orangechicken.png";
import savedButton from "../assets/save-star.png";
import savedYellowButton from "../assets/save-star-yellow.png"





const Ingredient = ({ ingredient }) => {
  return (

    <Accordion
      sx={{
        backgroundColor: "#33DB80",
        borderRadius: "5px",
        borderCollapse: "separate"
      }}
    >
      <AccordionSummary
        sx={{
          borderColor: "black",
          borderWidth: "2px",
          borderStyle: "solid",
          borderRadius: "5px",
          fontSize: "xx-large",
          maxHeight: "fit-content"

        }}
        expandIcon="&#94;"
        aria-controls="panel1a-content"
        id="panel1a-header"
      >

        <Typography ><Row ><Col className='ingredient-name'>{ingredient.name}</Col><Col className='ingredient-amount'>{ingredient.amount}</Col></Row> </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {ingredient.subs && ingredient.subs.map(sub =>

          <Row className='sub'>
            <Col>
              <Row>
                <Col className='col-sm-auto'>{sub.name}</Col> <Col>{sub.effect}</Col>
              </Row>
            </Col>
            <Col >
              <button type="button" class="btn btn-sm info-button" data-toggle="modal" data-target="#exampleModal">
                i
              </button>
            </Col>
          </Row>
        )}

      </AccordionDetails>

    </Accordion>
  );
}

export default function Recipe() {

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
    time: "30min",
    health: 2,
    image: { chickenPic },
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
      return savedYellowButton;
    } else {
      return savedButton;
    }
  }

  return (
    <div>
      {/* BACK AND SAVE BUTTONS */}
      <Container>
        <Row>
          <Col className=' back-button'>
            <Link onClick={BackButtonClick}><img src={backButton} ></img></Link>
          </Col>
          <Col className=' save-button'>
            <Link onClick={SaveButtonClick}><img src={StarSelector()} ></img></Link>
          </Col>
        </Row>

        {/* SEARCH BAR */}
        <Form>
          <InputGroup>
            <Form.Control type="text" />
            <Button variant="outline-secondary" id="searchBtn" type="submit">
              <span className="material-symbols-outlined ">
                search
              </span>
            </Button>
          </InputGroup>
        </Form>

        {/* FOOD IMAGE  */}
        <div className="card bg-dark text-white">
          <img className='card-img food-image' src={chickenPic} alt="Card image" />
          <div className='card-img-overlay'>
            <h5 className='card-title recipe-name'>{recipe.name}</h5>
            <Row>
              <Col>
                <p className='card-text col-sm-2 recipe-price'>Price <p className="dollars">{recipe.price}</p></p>
              </Col>
              <Col>
                <p className='card-text col-sm-2 recipe-time'>Time<p className="minutes">{recipe.time}</p></p>
              </Col>
              <Col>
                <p className='card-text col-sm-2 recipe-health'> Health <p className="leaves">{recipe.health}</p> </p>
              </Col>
            </Row>
          </div>
        </div>

        <h1>Ingredients and Substitutes</h1>

        {subs && subs.map(ingredient =>
          <div className='ingredient-card'>
            <Ingredient key={ingredient.id} ingredient={ingredient} />
          </div>
        )}

      </Container>
    </div>
  );
}




