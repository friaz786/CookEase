import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import EventRecipe from "./EventRecipe";
import { Ionicons } from "@expo/vector-icons";

const EventDetails = ({ route, navigation }) => {
  const { eventName, date } = route.params;
  const [eventMeals, setEventMeals] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "users", auth.currentUser.uid, "eventRecipes"),
      where("eventName", "==", eventName),
      where("date", "==", date)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const meals = [];
        snapshot.forEach((doc) => {
          meals.push(doc.data());
        });
        setEventMeals(meals);
      },
      (error) => {
        console.error("Error fetching event meals", error);
        // Alert.alert("Error fetching event meals", error.message);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser, eventName, date]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Event Plan for {eventName}</Text>

      <Text style={styles.dateText}>
        Date:{" "}
        {new Date(date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Text>

      {eventMeals.map((meal, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate("EventRecipe", { recipe: meal })}
          style={styles.card}
        >
          <Text style={styles.cardText}>{meal.recipe}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backIcon: {
    // Removed absolute positioning to allow natural flow within the flex container
    zIndex: 10,
    marginTop: "5%",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  dateText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: "2%",
    marginTop: "2%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#4CAF50",
    borderWidth: 2,
    padding: 15,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    color: "#000",
  },
});

export default EventDetails;
