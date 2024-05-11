import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // Adjust the path as necessary
import { doc, setDoc, collection } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const AddRecipeForEvent = ({ route, navigation }) => {
  const { recipe, eventName, date } = route.params;
  const auth = getAuth();

  const renderListItem = (item, index) => (
    <View key={index} style={styles.listItem}>
      <Text style={styles.listItemText}>• {item}</Text>
    </View>
  );

  const addRecipeToEvent = async () => {
    const user = auth.currentUser;

    if (user) {
      // Unique ID for the event recipe item, consider using Firestore auto-generated IDs or something like `uuid`
      const eventRecipeId = doc(
        collection(db, `users/${user.uid}/eventRecipes`)
      ).id;

      try {
        // Adding the selected recipe to the user's event recipe collection
        await setDoc(doc(db, `users/${user.uid}/eventRecipes`, eventRecipeId), {
          recipe: recipe.name, // Assuming you want to save the recipe name, adjust as needed
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          image_url: recipe.image_url,
          date: date,
          eventName: eventName, // Saving under the event's name
        });

        Alert.alert("Recipe added to your event!");
        navigation.goBack();
      } catch (error) {
        console.error("Error writing document: ", error);
        Alert.alert("Failed to add recipe to event.");
      }
    } else {
      Alert.alert("You need to be logged in to add a recipe to your event.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
        <View style={styles.cardimg}>

        </View>
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <TouchableOpacity
          onPress={addRecipeToEvent}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: recipe.image_url }}  // Ensure you use the correct property name for the URL
        style={styles.image}  // You might want to define the style for your images
      />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recipe Name</Text>
        <Text style={styles.cardContent}>{recipe.name}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ingredients</Text>
        {recipe.ingredients.map((ingredient, index) =>
          renderListItem(ingredient, index)
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Steps</Text>
        {recipe.steps.map((step, index) => renderListItem(step, index))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  backIcon: {
    padding: 10,
    marginTop: 20,
    marginLeft: 1,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    marginTop: "3%",
    marginRight: "3%",
  },
  headerButtonText: {
    color: "white",
    fontSize: 16,
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#4CAF50",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#4CAF50",
    borderWidth: 2,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  cardContent: {
    fontSize: 16,
    marginTop: 8,
    color: "#666666",
  },
  calorie_count: {
    fontSize: 14,
    marginTop: 8,
    color: "#666666",
    opacity: 0.8,
  },
  listItem: {
    marginTop: 8,
  },
  listItemText: {
    fontSize: 16,
    color: "#666",
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 16,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  timerInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    padding: 10,
    width: "25%",
    textAlign: "center",
    backgroundColor: "#F5F5F5",
  },
  timerButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  timerButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  image: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifycontent: 'center',
    backgroundColor: "white",
    height: 300,
  },
});

export default AddRecipeForEvent;
