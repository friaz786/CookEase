import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";

const MealPlanDetails = ({ route, navigation }) => {
  const { mealPlans, date } = route.params;

  const groupedMealPlans = mealPlans.reduce((acc, plan) => {
    (acc[plan.mealType] = acc[plan.mealType] || []).push(plan);
    return acc;
  }, {});

  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}></View>
      </View>
      <Text style={styles.screenTitle}>My Meal Plans</Text>
      <Text style={styles.dateTitle}>Meal Plan for {date}</Text>

      {mealTypes.map((mealType) => (
        <View key={mealType} style={styles.mealTypeContainer}>
          <Text style={styles.mealTypeHeader}>{mealType}</Text>
          {groupedMealPlans[mealType]?.map((plan, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate("Recipe", { recipe: plan })}
              style={styles.card}
            >
              <Text style={styles.cardText}>
                {index + 1}. {plan.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backIcon: {
    padding: 10,
    marginTop: 20,
    marginLeft: 1,
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
  screenTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#4CAF50",
  },
  mealTypeContainer: {
    marginBottom: 10,
  },
  mealTypeHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 15,
    marginHorizontal: 16,
    //color: "",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#4CAF50",
    borderWidth: 2,
    padding: 10,
    marginHorizontal: 16,
    marginTop: 1,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    color: "#666666",
  },
});

export default MealPlanDetails;