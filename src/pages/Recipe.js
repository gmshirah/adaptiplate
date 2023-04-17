import './Recipe.css';
import axios from 'axios';
import { app, api, apiKey, apiHost } from '../index.js';
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
  Tabs,
  Tab,
  Spinner,
  Alert
} from 'react-bootstrap';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
getDatabase,
ref,
get,
set,
child,
remove,
push
} from "firebase/database";

function parseSubResponse(response) {
  response = response.split("=")[0].trim();
  return response.split(" ");
}

const Ingredient = ({ ingredient, onInfoClick }) => {
  const [subs, setSubs] = useState(null);
  const [numSubs, setNumSubs] = useState(99);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subs && subs.length == numSubs) {
      setLoading(false);
    }
  }, [subs, numSubs]);

  const onIngredientClick = (e) => {
    e.preventDefault();
    if (!subs) {
      setLoading(true);
      setSubs(Array());
      axios.get(`${api}/food/ingredients/${ingredient.id}/substitutes`, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        }
      })
        .then((response) => {
          if (response.data.substitutes) {
            let arr = response.data.substitutes;
            setNumSubs(arr.length);
            for (let i = 0; i < arr.length; i++) {
              let parsedSub = parseSubResponse(arr[i]);
              axios.get(`${api}/recipes/convert`, {
                params: {
                  'ingredientName': ingredient.name,
                  'sourceAmount': ingredient.amount,
                  'sourceUnit': ingredient.measures.us.unitShort,
                  'targetUnit': parsedSub[1],
                },
                headers: {
                  'X-RapidAPI-Key': apiKey,
                  'X-RapidAPI-Host': apiHost
                }
              })
              .then((response) => {
                let targetAmount = response.data.targetAmount;

                // arr[i] format example: 1 cup = 7/8 cup [ingredient] + 1 tsp [ingredient]

                // response.data.targetAmount example:
                //   sourceAmount: 8
                //   sourceUnit: Tbsp
                //   targetUnit: cup
                //   targetAmount: 0.5
                // we will use this to determine measurements for ingredient substitutes

                // subsStr format example: 7/8 cup [ingredient] + 1 tsp [ingredient]
                let subsStr = arr[i].split("=")[1].trim();
                
                // regex to split subsStr at "+" and "and" (API responses are inconsistent)
                const re = /(?: and | \+ )([1-9])/g;

                // subsStr format example: ["7/8 cup [ingredient]", "1 tsp [ingredient]"]
                subsStr = subsStr.split(re);

                // subsArr will represent array of substitute ingredients from one string
                let subsArr = [];

                for (let j = 0; j < subsStr.length; j += 2) {
                  if (j >= 2) {
                    subsStr[j] = subsStr[j-1] + subsStr[j];
                  }

                  if (ingredient.measures.us.unitShort == "") {
                    // parse first word in each string as a numeric value and multiply it by
                    // ingredient.amount
                    let str = eval(subsStr[j].trim().split(" ")[0]) * ingredient.amount;

                    // round value to nearest hundredth if it's not a whole number
                    str % 1 == 0 ? str = str : str = str.toFixed(2);

                    // concatenate the rest of the string to the newly converted value
                    str += subsStr[j].substring(subsStr[j].trim().split(" ")[0].length +
                        subsStr[j].trim().split(" ")[1].length + 1);

                    // push this string into subsArr
                    subsArr.push(str.trim());
                  } else if (!targetAmount) {
                    // parse first word in each string as a numeric value and multiply it by
                    // ingredient.amount
                    let str = eval(subsStr[j].trim().split(" ")[0]) * ingredient.amount;

                    // round value to nearest hundredth if it's not a whole number
                    str % 1 == 0 ? str = str : str = str.toFixed(2);

                    // concatenate original ingredient unit as best guess
                    str += " " + ingredient.measures.us.unitShort;

                    // concatenate the rest of the string to the newly converted value
                    str += subsStr[j].substring(subsStr[j].trim().split(" ")[0].length +
                        subsStr[j].trim().split(" ")[1].length + 1);

                    // push this string into subsArr
                    subsArr.push(str.trim());
                  } else {
                    // parse first word in each string as a numeric value and multiply it by
                    // response.data.targetAmount
                    let str = eval(subsStr[j].trim().split(" ")[0]) * targetAmount;

                    // round value to nearest hundredth if it's not a whole number
                    str % 1 == 0 ? str = str : str = str.toFixed(2);

                    // concatenate the rest of the string to the newly converted value
                    str += subsStr[j].substring(subsStr[j].trim().split(" ")[0].length);

                    // push this string into subsArr
                    subsArr.push(str.trim());
                  }
                }

                // subsArr format example: ["0.44 cup [ingredient]", "0.5 tsp [ingredient]"]
                setSubs(oldArray => [...oldArray, subsArr]);
              })
              .catch((error) => {
                setLoading(false);
                alert("Error converting substitutions. Please try again!");
                console.error(error);
              });
            }
          } else {
            setSubs([]);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          alert("Error retrieving substitutions. Please try again!");
          console.error(error);
        });
    }
  };

  return (
    <Accordion.Item eventKey={ingredient.id} onClick={onIngredientClick}>
      <Accordion.Header>
        <span id="ingredientName">{ingredient.name}</span>
        <span id="ingredientAmount">{ingredient.amount % 1 == 0 ? ingredient.amount : (ingredient.amount).toFixed(2)} {ingredient.measures.us.unitShort}</span>
      </Accordion.Header>
      <Accordion.Body>
        {loading ? (
          <div>
            <Spinner animation="border" />
          </div>
        ) : (
          subs && subs.length > 0 ? (
            <div>
              <h3 id="subTitle">Substitute Conversions</h3>
              {subs.map(sub =>
                <Container id="sub">
                  <div>
                    {sub && sub.length > 0 ? (
                      sub.map(subPart =>
                        <p id="subDesc">{subPart}</p>
                      )
                    ) : (
                      <span />
                    )}
                  </div>
                  <span className="material-symbols-outlined" id="infoIcon" onClick={() => {onInfoClick(sub);}}>
                    info
                  </span>
                </Container>
              )}
            </div>
          ) : (
            <Container id="noSub">
              <p id="noSubText">No substitutions available!</p>
            </Container>
          )
        )}
      </Accordion.Body>
    </Accordion.Item>
  );
}

function Recipe() {
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);

  let [saved, setSaved] = useState(false);

  let [loggedIn, setLoggedIn] = useState(false);

  let navigate = useNavigate();
  let params = useParams();

  const [userData, setUserData] = useState([]);
  const [recipeData, setRecipeData] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);
  const [instructionData, setInstructionData] = useState([]);

  const [showNutrition, setShowNutrition] = useState(false);
  const [nutritionInfo, setNutritionInfo] = useState(Array(Array()));
  const [nutritionLoading, setNutritionLoading] = useState(false);

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `recipes/${params.id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setRecipeData(snapshot.val());
      }
    }).catch((error) => {
      console.error(error);
    });

    get(child(dbRef, `recipes/${params.id}/extendedIngredients`)).then((snapshot) => {
      if (snapshot.exists()) {
        setIngredientData(snapshot.val());
      }
    }).catch((error) => {
      console.error(error);
    });

    get(child(dbRef, `recipes/${params.id}/analyzedInstructions/0/steps`)).then((snapshot) => {
      if (snapshot.exists()) {
        setInstructionData(snapshot.val());
      }
    }).catch((error) => {
      console.error(error);
    });

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        get(child(dbRef, `users/${currentUser.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        }).catch((error) => {
          console.error(error);
          alert("Error retrieving user data.");
        });
      }
      setLoggedIn(currentUser != null);
    });
  }, []);

  useEffect(() => {
    if (userData.recipes) {
      for (let id in userData.recipes) {
        if (userData.recipes[id].id === recipeData.id) {
          setSaved(true);
        }
      }
    }
  }, [userData, recipeData]);

  const SaveButtonClick = (event) => {
    const dbRef = ref(getDatabase());
    if (saved) {
      // Need to remove from saved
      remove(child(dbRef, `users/${auth.currentUser.uid}/recipes/${recipeData.id}`)).then(() => {
        setSaved(false);
      }).catch((error) => {
        console.error(error);
        alert("Error removing from saved recipes. Please try again!");
      });
    } else {
      // Need to add to saved
      if (!loggedIn) {
        alert("You must login to save recipes!");
      } else {
        const newRecipeRef = child(dbRef, `users/${auth.currentUser.uid}/recipes/${recipeData.id}`);
        set(newRecipeRef, {
          id: recipeData.id
        });
        get(child(dbRef, `users/${auth.currentUser.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        }).catch((error) => {
          console.error(error);
        });
        setSaved(true);
      }
    }
  };

  const BackButtonClick = (event) => {
    navigate(-1);
  };

  const StarSelector = () => {
    if (saved) {
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

  const onInfoClick = (ingredients) => {
    if (!Array.isArray(ingredients)) {
      alert("Ingredients parameter is not an array!");
      return;
    }

    setNutritionLoading(true);
    setShowNutrition(true);

    let str = ingredients[0];
    for (let i = 1; i < ingredients.length; i++) {
      str += "\n" + ingredients[i];
    }

    const encodedParams = new URLSearchParams();
    encodedParams.append("ingredientList", str);
    encodedParams.append("servings", "1");

    axios.post(`${api}/recipes/parseIngredients`, encodedParams, {
      params: {
        'includeNutrition': true,
        'language': "en",
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
      }
    })
    .then((response) => {
      setNutritionInfo(response.data);
      setNutritionLoading(false);
    })
    .catch((error) => {
      alert("Error retrieving nutritional information. Please try again!");
      console.error(error);
    });
  };

  const onNutritionClose = () => {
    setShowNutrition(false);
    setNutritionInfo(Array(Array()));
  };

  return (
    <Container>
      {showNutrition ? (
        <div id="nutritionDiv">
          <Alert id="nutritionAlert" variant="secondary">
            <Alert.Heading id="nutritionAlertHeading">
              <span>Nutrition</span>
              <span id="nutritionAlertCloseIcon" className="material-symbols-outlined" onClick={onNutritionClose}>
                close
              </span>
            </Alert.Heading>
            {nutritionLoading ? (
              <div id="nutritionLoadingDiv">
                <hr />
                <div id="nutritionLoadingScreen">
                  <Spinner id="nutritionLoadingSpinner" variant="dark" animation="border" />
                </div>
              </div>
            ) : (
              nutritionInfo && nutritionInfo.map(ingredient =>
                <div id="ingredientNutritionDiv">
                  <hr />
                  <div id="ingredientNutritionName">{ingredient.amount}{ingredient.unit == "" ? " " : " " + ingredient.unit + " "}{ingredient.name}</div>
                  {ingredient.nutrition && ingredient.nutrition.nutrients.map(nutrient =>
                    <div>
                      <span><b>{nutrient.name}</b></span>
                      <div id="nutritionStatsDiv">
                        <span>{nutrient.amount} {nutrient.unit}</span>
                        <span>{nutrient.percentOfDailyNeeds}% DV</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </Alert>
        </div>
      ) : (
        <span />
      )}

      <div id="recipeHeader">
        <div id="backDiv">
          <Button onClick={BackButtonClick} id="backBtn">
            <span className="material-symbols-outlined" id="backIcon">
              arrow_back
            </span>
          </Button>
        </div>
        <div id="titleDiv">
          <h1 id="recipeTitleText">{recipeData.title}</h1>
          <p id="recipeSourceText"><i>{recipeData.sourceName}</i></p>
        </div>
        <div id="saveDiv">
          <Button onClick={SaveButtonClick} id="saveBtn">{StarSelector()}</Button>
        </div>
      </div>

      {/* FOOD IMAGE  */}
      <Image id="recipeImage" src={recipeData.image} />

      <div id="dietTags">
        {recipeData.dairyFree ? (
          <span id="tag">Dairy Free</span>
        ) : (<span />)}
        {recipeData.glutenFree ? (
          <span id="tag">Gluten Free</span>
        ) : (<span />)}
        {recipeData.lowFodmap ? (
          <span id="tag">Low FODMAP</span>
        ) : (<span />)}
        {recipeData.sustainable ? (
          <span id="tag">Sustainable</span>
        ) : (<span />)}
        {recipeData.vegan ? (
          <span id="tag">Vegan</span>
        ) : (<span />)}
        {recipeData.vegetarian ? (
          <span id="tag">Vegetarian</span>
        ) : (<span />)}
      </div>

      <div id="recipeInfo">
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            payments
          </div>
          <p id="statText">${(recipeData.pricePerServing / 100).toFixed(2)}</p>
          <p id="statName"><i>per serving</i></p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            favorite
          </div>
          <p id="statText">{recipeData.healthScore}</p>
          <p id="statName"><i>health score</i></p>
        </div>
        <div id="stat">
          <div className="material-symbols-outlined" id="statIcon">
            schedule
          </div>
          <p id="statText">{recipeData.readyInMinutes}</p>
          <p id="statName"><i>minutes</i></p>
        </div>
      </div>

      <div id="servingsInfo">
        <span>Servings:</span>
        <span>{recipeData.servings}</span>
      </div>

      <Tabs
        defaultActiveKey="ingredients"
        id="ingredientsInstructionsTab"
        justify
      >
        <Tab eventKey="ingredients" title="Ingredients">
          {ingredientData.map(ingredient =>
            <Accordion>
              <Ingredient key={ingredient.id} ingredient={ingredient} onInfoClick={onInfoClick} />
            </Accordion>
          )}
        </Tab>
        <Tab eventKey="instructions" title="Instructions">
          <ol>
            {instructionData.map(instruction =>
              <li id="instruction">
                {instruction.step}
              </li>
            )}
          </ol>
        </Tab>
      </Tabs>

      <a id="visitSourceLink" target="_blank" href={recipeData.sourceUrl}>
        <span id="visitRecipeSource">Visit recipe source</span>
        <span id="openLinkIcon" class="material-symbols-outlined">
          open_in_new
        </span>
      </a>
    </Container>
  );
}

export default Recipe;
