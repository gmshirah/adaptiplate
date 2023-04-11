import { useLocation, Link, useNavigate } from 'react-router-dom';
import
{
    Container,
    Row,
    Col,
    Card,
    Spinner
} from 'react-bootstrap';
import { app, api, apiKey } from '../index.js';
import { useState } from 'react';
import axios from 'axios';
import
{
    getDatabase,
    ref,
    set,
    child,
} from "firebase/database";

function parseId ( source, title )
{
    return source.replace( / /g, "-" ).toLowerCase().split( "." )[ 0 ] + "-" + title.replace( / /g, "-" ).toLowerCase();
}

const RecipeCard = ( { recipe } ) =>
{
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState( false );
    const handleClick = ( event ) =>
    {
        event.preventDefault();
        setLoading( true );
        console.log( 'recipe' );
        console.log( recipe.id );
        axios.get( `${ api }/recipes/${ recipe.id }/information`, {
            params: {
                apiKey: apiKey,
                includeNutrition: true,
            }
        } )
            .then( ( response ) =>
            {
                const dbRef = ref( getDatabase() );
                const newId = parseId( response.data.sourceName, response.data.title );
                const newRecipeRef = child( dbRef, `recipes/${ newId }` );
                response.data.id = newId;
                set( newRecipeRef, response.data ).then( () =>
                {
                    setLoading( false );
                    navigate( `/recipe/${ newId }` );
                } ).catch( ( error ) =>
                {
                    setLoading( false );
                    alert( "Error retrieving recipe. Please try again! 1" );
                    console.error( error );
                } );
            } )
            .catch( ( error ) =>
            {
                setLoading( false );
                alert( "Error retrieving recipe. Please try again! 3" );
                console.error( error );
            } )
            .then( () =>
            {

            } );
    };

    return (
        <Container style={{ margin: 0, paddingBottom: 0 }}>
            {loading ? (
                <div id="loadingScreen">
                    <Spinner id="loadingSpinner" variant="light" animation="border" />
                </div>
            ) : ( <span /> )}
            <Col md={6}>
                <Link to={`/recipe/${ recipe.id }`} onClick={handleClick}>
                    <Card id="recipeCard">
                        <Card.Img variant="top" src={recipe.image} />
                        <Card.ImgOverlay>
                            <h4 id="recipeTitle">{recipe.title}</h4>
                            <div id="recipeStats">
                                <Card.Text>${( recipe.pricePerServing / 100 ).toFixed( 2 )}</Card.Text>
                                <Card.Text>{recipe.healthScore}</Card.Text>
                                <Card.Text>{recipe.readyInMinutes} mins</Card.Text>
                            </div>
                        </Card.ImgOverlay>
                    </Card>
                </Link>
            </Col>
        </Container>
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