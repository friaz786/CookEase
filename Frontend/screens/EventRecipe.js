import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import timerSound from "../assets/timer.mp3";

const EventRecipe = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [timerOn, setTimerOn] = useState(false);
  const [sound, setSound] = useState();

  async function playSound() {
    console.log("Playing sound");
    const { sound } = await Audio.Sound.createAsync(timerSound);
    setSound(sound);
    await sound.playAsync();
  }
  useEffect(() => {
    let interval = null;

    if (timerOn) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          let intSeconds = parseInt(prevSeconds, 10);
          let intMinutes = parseInt(minutes, 10);
          let intHours = parseInt(hours, 10);

          if (intSeconds > 0) {
            return String(intSeconds - 1).padStart(2, "0");
          } else if (intMinutes > 0 || intHours > 0) {
            if (intMinutes > 0) {
              setMinutes(String(intMinutes - 1).padStart(2, "0"));
            } else if (intHours > 0) {
              setHours(String(intHours - 1).padStart(2, "0"));
              setMinutes("59");
            }
            return "59";
          } else {
            // Timer finishes
            clearInterval(interval);
            playSound().then(() => {
              setTimerOn(false);
              // Reset timer
              setHours("");
              setMinutes("");
              setSeconds("");
            });
            return "00";
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerOn, hours, minutes, seconds]);

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recipe Name: </Text>
        <Text style={styles.recipeTitle}>{recipe.recipe}</Text>
        {/* <Text style={styles.cardContent}>
          Calorie count: {recipe.calorie_count} cal
        </Text> */}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientText}>
            - {ingredient}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Steps</Text>
        {recipe.steps.map((step, index) => (
          <Text key={index} style={styles.stepText}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>
      <Text style={styles.timerText}>Set Timer</Text>
      <View style={styles.timerContainer}>
        <TextInput
          style={styles.timerInput}
          onChangeText={(newHours) => setHours(newHours.replace(/[^0-9]/g, ""))}
          value={hours}
          keyboardType="numeric"
          placeholder="HH"
        />
        <TextInput
          style={styles.timerInput}
          onChangeText={(newMinutes) =>
            setMinutes(newMinutes.replace(/[^0-9]/g, ""))
          }
          value={minutes}
          keyboardType="numeric"
          placeholder="MM"
        />
        <TextInput
          style={styles.timerInput}
          onChangeText={(newSeconds) =>
            setSeconds(newSeconds.replace(/[^0-9]/g, ""))
          }
          value={seconds}
          keyboardType="numeric"
          placeholder="SS"
        />
        <TouchableOpacity
          style={styles.timerButton}
          onPress={() => setTimerOn(!timerOn)}
        >
          <Text style={styles.timerButtonText}>
            {timerOn ? "Stop" : "Start"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  backIcon: {
    zIndex: 10,
    marginTop: "5%",
    marginBottom: "2%",
  },
  card: {
    backgroundColor: "lightgrey", // Light grey background for the card
    borderRadius: 8, // Rounded corners for the card
    padding: 20, // Padding inside the card
    marginBottom: 5, // Space between cards
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4, // Elevation for Android
  },
  recipeTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "grey",
  },
  ingredientText: {
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 5,
  },
  stepText: {
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 5,
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: "87%",
    marginLeft: "7%",
    marginRight: "7%",
    marginBottom: "15%",
  },
  timerText: {
    marginTop: "6%",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: "7%",
  },
  timerInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    marginRight: 10,
    padding: 10,
    width: "25%",
    alignItems: "center",
  },
  timerButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  timerButtonText: {
    color: "#ffffff",
  },
});

export default EventRecipe;