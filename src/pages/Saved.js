import './Saved.css';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

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
    name: 'Hamburger',
    img: 'https://media.cnn.com/api/v1/images/stellar/prod/220428140436-04-classic-american-hamburgers.jpg?c=original',
    cost: '$8',
    health: 'Un-Healthy',
    time: '15 min',
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
        <Card className="mb-4 border-0" style={{ minWidth: '300px' }}>
          <Card.Img variant="top" src={recipe.img} className='card-image' />
          <Card.ImgOverlay className="card-overlay">
            <div className="recipe-info">
              <h4 style={{ fontSize: '24px' }}>{recipe.name}</h4>
            </div>
            <div className="recipe-stats">
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



function Saved() {
  return (
    <div>
      <h3>Temporary Page Navigation</h3>
      <Link to="/">Home Page</Link>
      <br />
      <Link to="/recipe">Recipe Page</Link>
      <br />
      <Link to="/settings">Settings Page</Link>

      <h1 className='heading'>Favorites</h1>

      <Container>
        <div className="scrollable-content">
          <Row>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </Row>
        </div>

      </Container>
    </div>
  );
}

export default Saved;
