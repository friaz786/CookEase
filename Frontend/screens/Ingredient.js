import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const Ingredient = ({ route, navigation }) => {
  const { ingredients } = route.params;
  const [ingredientList, setIngredientList] = useState(ingredients);

  const removeIngredient = (index) => {
    const newIngredients = [...ingredientList];
    newIngredients.splice(index, 1);
    setIngredientList(newIngredients);
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {/* Back Icon */}
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
});

export default Ingredient;
