import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from "react-native";
import { getAuth } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { MaterialIcons } from "@expo/vector-icons";

const MyMealPlans = ({ navigation }) => {
  const [mealPlans, setMealPlans] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    // This effect cleans up the listener when the component unmounts or the currentUser changes
    const unsubscribe = auth.currentUser
      ? onSnapshot(
          collection(db, "users", auth.currentUser.uid, "mealPlans"),
          (snapshot) => {
            const plans = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              data.id = doc.id; // Capture the document ID
              plans.push(data);
            });
            setMealPlans(plans);
          },
          (error) => {
            console.log(error);
            Alert.alert("Error fetching meal plans", error.message);
          }
        )
      : null;

    return () => unsubscribe && unsubscribe();
  }, [auth.currentUser]);

  const deleteMealPlan = async (date) => {
    Alert.alert(
      "Delete Meal Plan",
      "Are you sure you want to delete this meal plan?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const q = query(
              collection(db, "users", auth.currentUser.uid, "mealPlans"),
              where("date", "==", date)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (document) => {
              await deleteDoc(
                doc(db, "users", auth.currentUser.uid, "mealPlans", document.id)
              );
            });
            // fetchMealPlans(); No need to manually fetch after deletion as the listener will auto-update
          },
        },
      ]
    );
  };

  const groupedMealPlans = mealPlans.reduce((acc, plan) => {
    if (!acc[plan.date]) acc[plan.date] = [];
    acc[plan.date].push(plan);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Meal Plans</Text>
        <TouchableOpacity
          style={styles.generateListButton}
          onPress={() => navigation.navigate("GroceryList")}
        >
          <Text style={styles.generateListButtonText}>
            Generate Grocery List
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={Object.keys(groupedMealPlans)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.mealPlanItem}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MealDetail", {
                  mealPlans: groupedMealPlans[item],
                  date: item,
                })
              }
              style={styles.mealPlanTextContainer}
            >
              <Text style={styles.mealPlanText}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteMealPlan(item)}
              style={styles.deleteButton}
            >
              <MaterialIcons name="delete-forever" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("calendar")}
      >
        <Text style={styles.createButtonText}>Create new Meal Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "15%",
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  mealPlanText: {
    fontSize: 16,
  },
  mealPlanItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    marginTop: "2%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#4CAF50",
    borderWidth: 2,
    padding: 20,
    //marginHorizontal: 16,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
  createButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    marginTop: 20,
    //paddingBottom: 40,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  mealPlanTextContainer: {
    flex: 1, // Ensure text container takes up the full width minus button
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  generateListButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: "0.5%",
    borderRadius: 5,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  generateListButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  // Rest of the styles remain unchanged
});

export default MyMealPlans;
