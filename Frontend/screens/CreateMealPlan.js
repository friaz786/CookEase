import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function CreateMealPlan({ navigation, route }) {
  const { date } = route.params;

  const onSelect = (mealType) => {
    navigation.navigate("searchrecipe", { mealType, date });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Choose Meals</Text>
      <Text style={styles.dateText}>{date}</Text>

      <View style={styles.mealSection}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onSelect("Breakfast")}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.mealHeaderText}>Breakfast</Text>
      </View>

      <View style={styles.mealSection}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onSelect("Lunch")}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.mealHeaderText}>Lunch</Text>
      </View>

      <View style={styles.mealSection}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onSelect("Dinner")}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.mealHeaderText}>Dinner</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Meal Planner")}
      >
        <Text style={styles.buttonText}>Complete Meal Plan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "f9f9f9",
    alignItems: "center",
    paddingTop: 20,
  },
  backIcon: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 25,
    textAlign: "center",
  },
  dateText: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 20,
    marginTop: 10,
  },
  mealSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    alignSelf: "flex-start", // Align the mealSection to the start
  },
  addButton: {
    marginRight: 10,
    backgroundColor: "#4CAF50",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  plusText: {
    fontSize: 24,
    color: "#ffffff",
  },
  mealHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "80%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
