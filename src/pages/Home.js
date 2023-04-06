import './Home.css';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Card
} from 'react-bootstrap';

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
    id: 2,
    name: 'Chicken Alfredo',
    img: 'https://hips.hearstapps.com/hmg-prod/images/delish-221130-perfect-chicken-alfredo-0683-eb-1670449995.jpg?crop=1xw:0.8277591973244147xh;center,top',
    cost: '$12',
    health: 'Moderate',
    time: '40 min',
  },
];

const RecipeCard = ({ recipe, path }) => {
  const handleClick = (event) => {
  };

  return (
    <Col md={6}>
      <Link to="/recipe" onClick={handleClick}>
        <Card>
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

function Home() {
  return (
    <Container>
      <h1 id="titleText">Welcome!</h1>
      <h3 id="headingText">Paste a recipe link below</h3>
      <Form>
        <InputGroup>
          <Form.Control type="text" />
          <Button variant="outline-secondary" id="searchBtn" type="submit">
            {/* <span className="material-symbols-outlined">
              search
            </span> */}
            <Link to="/recipe" id="searchLink" className="material-symbols-outlined">
              search
            </Link>
          </Button>
        </InputGroup>
      </Form>
      <h3 id="headingText">Recently Viewed</h3>
      <div id="scrollableContent">
        <Row>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default Home;
