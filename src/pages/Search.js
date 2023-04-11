import { useLocation, Link } from 'react-router-dom';
import
{
    Container,
    Row,
    Col,
    Card
} from 'react-bootstrap';


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
                    </Card.ImgOverlay>
                </Card>
            </Link>
        </Col>
    );
};

function Search ()
{

    const location = useLocation();
    const recipes = location.state.recipes;
    console.log( recipes );
    return (
        <Container>

            <div>
                <h1 id="titleText">Search Results</h1>
                <div>
                    <Row>
                        {recipes.results.map( ( recipe ) => (
                            <RecipeCard recipe={recipe} />
                        ) )}
                    </Row>
                </div>
            </div>

        </Container>
    );
}

export default Search;