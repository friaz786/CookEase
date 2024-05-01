import { firestore } from './firebaseConfig';
import recipes from './recipe'; // Adjust the path to your recipe.js

const uploadRecipes = async () => {
  const recipesCollection = firestore.collection('recipes');

  for (let i = 0; i < 500; i++) { // Limit to 500 items
    const recipe = recipes[i];
    await recipesCollection.add(recipe)
      .then(docRef => console.log(`Document written with ID: ${docRef.id}`))
      .catch(error => console.error("Error adding document: ", error));
  }
};

uploadRecipes();
