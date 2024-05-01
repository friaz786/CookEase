import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const Payment = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSearch = async (queryText) => {
    setSearchQuery(queryText);
    if (queryText.length > 2) {
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("name", ">=", queryText),
        where("name", "<=", queryText + "\uf8ff")
      );
      try {
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Recipe Search</Text>

      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search recipes..."
      />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => handleSelectRecipe(item)}
          >
            <Text style={styles.recipeTitle}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedRecipe && (
        <ScrollView style={styles.recipeDetails}>
          <Text style={styles.recipeDetailTitle}>{selectedRecipe.name}</Text>
          <Text style={styles.recipeDetailHeader}>Ingredients:</Text>
          {selectedRecipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.recipeDetailText}>
              {ingredient}
            </Text>
          ))}
          <Text style={styles.recipeDetailHeader}>Steps:</Text>
          {selectedRecipe.steps.map((step, index) => (
            <Text key={index} style={styles.recipeDetailText}>
              {step}
            </Text>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  searchInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    margin: 10,
    borderRadius: 6,
  },
  recipeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  recipeTitle: {
    fontSize: 18,
  },
  recipeDetails: {
    marginTop: 20,
    padding: 10,
  },
  recipeDetailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5cb85c",
  },
  recipeDetailHeader: {
    fontSize: 20,
    marginTop: 10,
    //color: '#5cb85c',
  },
  recipeDetailText: {
    fontSize: 16,
    marginTop: 5,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  iconButton: {
    // Additional styles for the icon buttons if needed
  },
});

export default Payment;
