import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const RecipeResults = ({ route, navigation }) => {
  const { recipes } = route.params;

  const handlePress = (recipe) => {
    navigation.navigate('Recipe', { recipe });
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      {recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <View style={styles.recipeItem}>
                <Text style={styles.recipeTitle}>{item.name}</Text>
                <Text>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noRecipesText}>No recipe can be made using these ingredients</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noRecipesText: {
    fontSize: 18,
    color: 'red',
  },
});

export default RecipeResults;
