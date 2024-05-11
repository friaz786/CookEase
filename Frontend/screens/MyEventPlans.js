import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { getAuth } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";

const MyEventPlan = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) return;

    // Subscribe to eventRecipes for the current user
    const q = query(
      collection(db, "users", auth.currentUser.uid, "eventRecipes")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventMap = new Map(); // Use a Map to track unique event names and their dates

        snapshot.forEach((doc) => {
          const { eventName, date } = doc.data();
          if (!eventMap.has(eventName) || eventMap.get(eventName) > date) {
            // Store the event with its earliest date
            eventMap.set(eventName, date);
          }
        });

        // Convert Map to array for rendering, preserving unique event names and their dates
        const loadedEvents = Array.from(eventMap, ([eventName, date]) => ({
          eventName,
          date,
        }));

        setEvents(loadedEvents);
      },
      (error) => {
        console.log(error);
        Alert.alert("Error fetching event plans", error.message);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);
  const deleteEventPlan = async (item) => {
    // Show confirmation dialog
    Alert.alert(
      "Delete Event Plan",
      "Are you sure you want to delete this event plan and all its recipes?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              // Query to find all recipes with the same eventName for the current user
              const q = query(
                collection(db, "users", auth.currentUser.uid, "eventRecipes"),
                where("eventName", "==", item.eventName)
              );

              // Execute the query
              const querySnapshot = await getDocs(q);

              // Delete each document found by the query
              const deletePromises = querySnapshot.docs.map((doc) => {
                const docRef = doc.ref; // Get a reference to the document
                return deleteDoc(docRef); // Return the delete operation promise
              });

              // Wait for all delete operations to complete
              await Promise.all(deletePromises);

              // Optionally: refresh the events list or notify the user
              Alert.alert(
                "Success",
                "Event plan and its recipes deleted successfully."
              );

              // Refresh events list or navigate as needed
              // setEvents(...) or navigation.navigate(...)
            } catch (error) {
              console.error("Error deleting event plans", error);
              Alert.alert("Error deleting event plans", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <SafeAreaView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>My Event Plans</Text>
          <FlatList
            data={events}
            keyExtractor={(item, index) => `${item.eventName}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.eventPlanItem}>
                <TouchableOpacity
                  style={styles.eventNameContainer}
                  onPress={() =>
                    navigation.navigate("EventDetails", {
                      eventName: item.eventName,
                      date: item.date,
                    })
                  }
                >
                  <Text style={styles.eventNameText}>{item.eventName}</Text>
                  {/* Additional Text component for the date */}
                  <Text style={styles.eventDateText}>
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={() =>
                    navigation.navigate("EventSearch", {
                      eventName: item.eventName,
                      date: item.date,
                    })
                  }
                >
                  <Icon name="add-circle-outline" size={24} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteEventPlan(item)}
                  style={styles.deleteButton}
                >
                  <MaterialIcons name="delete-forever" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("EventCalendar")}
          >
            <Text style={styles.createButtonText}>Create New Event Plan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: "center", // Correct: applied through contentContainerStyle
    justifyContent: "center", // Correct: applied through contentContainerStyle
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: "3%",
  },
  eventNameText: {
    fontSize: 18,
    color: "#333333",
  },
  createButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    //width: "70%",
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginHorizontal: "2%",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  deleteButton: {
    marginLeft: 10,
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
  },
  eventPlanItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: "2%",
    marginHorizontal: "2%",
    marginTop: "2%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#4CAF50",
    borderWidth: 2,
    padding: 20,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  eventNameContainer: {
    flex: 1, // Ensure it fills the space left by the plus button
  },
  plusButton: {
    marginLeft: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 5,
  },
  plusButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  eventDateText: {
    fontSize: 16,
    color: "#666", // Lighter text color for the date
    marginTop: 5, // Space between eventName and date
  },
});

export default MyEventPlan;
