import './Recipe.css';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import { initializeApp } from "firebase/app";
import { getAuth , onAuthStateChanged } from "firebase/auth";
import
  {
    getDatabase,
    ref,
    get,
    child
  } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBlPgsYfKfSl15rkPbRzdX_7pjf3N5i424",
  authDomain: "adaptipla.firebaseapp.com",
  databaseURL: "https://adaptipla-default-rtdb.firebaseio.com",
  projectId: "adaptipla",
  storageBucket: "adaptipla.appspot.com",
  messagingSenderId: "826210962785",
  appId: "1:826210962785:web:1ba40a0510126f3dc54920",
  measurementId: "G-235FB92HNR"
};

// Initialize Firebase
const app = initializeApp( firebaseConfig );

const auth = getAuth(app);

const db = getDatabase();
const dbRef = ref(db);


onAuthStateChanged(auth, (user) => {

  if (user) {
    // User is signed in
    const uid = user.uid;
    console.log("UID: " + uid + " Name: " + user.displayName + " logged on!");
  } else {
    // User is not signed in
    console.log("nope!");
  }
});

// const DBQuery = (path) => {
//   console.log(path);
//   get(child(dbRef, path)).then((snapshot) => {
//     if (snapshot.exists && snapshot.val()) {
//       console.log(snapshot.val())
//       return snapshot.val();
//     } else {
//       console.error("Error: DB data could not be accessed");
//       return -1;
//     }
//   }).catch((error) => {
//     console.error("DB Query Error: " + error);
//     return -1;
//   })
// };


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
    health: "moderate",
    img: "https://www.modernhoney.com/wp-content/uploads/2018/01/Chinese-Orange-Chicken-2.jpg"
  })

  let [dataLoaded, setDataLoaded] = useState(false);

  let [favorite, setFavorite] = useState(false);

  let [loggedIn, setLoggedIn] = useState({});

  let navigate = useNavigate();

  const LoadRecipeData = (() => {
    get(child(dbRef, 'users/-NSD9UtFvXgxz4Mwgbmm')).then((userSnapshot) => {
      console.log("joe")
      if (userSnapshot.exists) {
        if (userSnapshot.val().recipes) {
          const recipes = [];
          console.log(userSnapshot.val().recipes[0].id);
          for (let favRecipe in userSnapshot.val().recipes) {
            let key = userSnapshot.val().recipes[favRecipe].id;
            get(child(dbRef, 'recipes/' + key)).then((recipeSnapshot) => {
              console.log(recipeSnapshot.val());
              if (recipeSnapshot && recipeSnapshot.val().name === recipe.name) {
                setFavorite(true);
              }
            })
          }
        }
      } else {
        console.log("Failure to query DB");
      }
    }).catch((error) => {
      console.error(error);
    })
  })

  useEffect(() => {

    console.log("=> useEffect!");
    
    if (auth.currentUser) {
      setLoggedIn(auth.currentUser.uid);
    }
    LoadRecipeData();

  }, [LoadRecipeData]);



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
      <Image id="recipeImage" src={recipe.img} />

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
