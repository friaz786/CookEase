import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { db } from "../firebase"; // Ensure this is correctly setting up Firestore.
import { collection, query, where, getDocs, limit } from "firebase/firestore";

const Ingredient = ({ route, navigation }) => {
  const { ingredients } = route.params;
  const [ingredientList, setIngredientList] = useState(ingredients);

  const removeIngredient = (index) => {
    const newIngredients = [...ingredientList];
    newIngredients.splice(index, 1);
    setIngredientList(newIngredients);
  };

  const fetchRecipes = async (ingredients) => {
    const recipesRef = collection(db, 'recipe');
    const q = query(
      recipesRef,
      where('cleanIngredient', 'array-contains-any', ingredients.slice(0, 10)), // Firestore allows up to 10 items in 'array-contains-any'
      limit(50) // You might want to adjust the limit based on expected data volume
    );
  
    const querySnapshot = await getDocs(q);
    const allRecipes = querySnapshot.docs.map(doc => doc.data());
  
    // Filter recipes to include only those that have all the specified ingredients
    const filteredRecipes = allRecipes.filter(recipe =>
      ingredients.every(ingredient => recipe.cleanIngredient.includes(ingredient))
    );
  
    if (filteredRecipes.length === 0) {
      console.log('No matching recipes found.');
      return [];
    }
    return filteredRecipes;
  };
  


  const findRecipes = async () => {
    try {
      const recipes = await fetchRecipes(ingredientList);
      navigation.navigate('RecipeResults', { recipes });
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <FlatList
        data={ingredientList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.ingredientItem}>
            <Text style={styles.ingredientText}>{item}</Text>
            <TouchableOpacity onPress={() => removeIngredient(index)}>
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.showRecipesButton}
        onPress={findRecipes}
      >
        <Text style={styles.showRecipesButtonText}>Show Recipes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  ingredientText: {
    fontSize: 18,
  },
  removeIcon: {
    fontSize: 24,
    color: 'red',
  },
  showRecipesButton: {
    backgroundColor: '#4CAF50', // Green background for the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  showRecipesButtonText: {
    color: 'white', // White text color
    fontSize: 16,
  },
  backIcon: {
    padding: 10,
    marginTop: 20,
    marginLeft: 1,
  },
});

export default Ingredient;
