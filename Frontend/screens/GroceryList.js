import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Button,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { collection, getDocs, query, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const GroceryList = ({ navigation }) => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const auth = getAuth();

  useEffect(() => {
    fetchGroceryList();
  }, [auth.currentUser]);

  const fetchGroceryList = async () => {
    if (auth.currentUser) {
      const q = query(
        collection(db, "users", auth.currentUser.uid, "mealPlans")
      );
      const querySnapshot = await getDocs(q);
      let allIngredients = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.ingredients) {
          allIngredients = allIngredients.concat(data.ingredients);
        }
      });

      // Convert to the expected format and ensure unique IDs
      const uniqueIngredients = [...new Set(allIngredients)].map(
        (item, index) => ({
          id: `${index}`, // Ensure unique IDs
          name: item,
          purchased: false,
        })
      );

      setIngredients(uniqueIngredients);
    }
  };

  const togglePurchase = (id) => {
    setIngredients(
      ingredients.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const newItem = {
        id: `${ingredients.length}`, // Ensure unique IDs
        name: newIngredient.trim(),
        purchased: false,
      };
      setIngredients([...ingredients, newItem]);
      setNewIngredient("");
    }
  };

  const saveGroceryList = async () => {
    if (auth.currentUser) {
      try {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            groceryList: ingredients.map(({ name, purchased }) => ({
              name,
              purchased,
            })), // Storing only name and purchased status
          },
          { merge: true }
        );
        alert("Grocery list saved successfully.");
      } catch (error) {
        console.error("Error saving the grocery list: ", error);
        alert("Failed to save the grocery list.");
      }
    } else {
      alert("You must be logged in to save the grocery list.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Grocery List</Text>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.ingredientItem}>
            <TouchableOpacity onPress={() => togglePurchase(item.id)}>
              <Icon
                name={item.purchased ? "checkbox-outline" : "square-outline"}
                size={24}
                color="#4CAF50"
              />
            </TouchableOpacity>
            <Text
              style={[styles.itemText, item.purchased && styles.purchased]}
            >{`${index + 1}. ${item.name}`}</Text>
            <TouchableOpacity onPress={() => deleteIngredient(item.id)}>
              <MaterialIcons name="delete-forever" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add a new ingredient"
          value={newIngredient}
          onChangeText={setNewIngredient}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.addButton}
          title="Add"
          onPress={addIngredient}
        >
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.saveButton}
        title="Save Grocery List"
        onPress={saveGroceryList}
        color="#007bff"
      >
        <Text style={styles.addText}>Save Grocery List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backIcon: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },
  purchased: {
    textDecorationLine: "line-through",
    color: "grey",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginRight: 8,
    backgroundColor: "#ffffff",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "7%",
    marginTop: 17,
  },
  addText: {
    color: "white",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "7%",
    marginTop: 10,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default GroceryList;
