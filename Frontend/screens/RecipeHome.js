import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // Adjust the path as necessary
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import timerSound from "../assets/timer.mp3";
import { doc, setDoc, updateDoc, collection } from "firebase/firestore";

const RecipeHome = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [timerOn, setTimerOn] = useState(false);
  const [sound, setSound] = useState();

  const renderListItem = (item, index) => (
    <View key={index} style={styles.listItem}>
      <Text style={styles.listItemText}>• {item}</Text>
    </View>
  );
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
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}></View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recipe Name</Text>
        <Text style={styles.cardContent}>{recipe.name}</Text>
        {/* <Text style={styles.cardContent}>
          Calorie count: {recipe.calorie_count} cal
        </Text> */}
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
  },
  backIcon: {
    // Removed absolute positioning to allow natural flow within the flex container
    zIndex: 10,
    marginTop: "5%",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center", // Ensure items are vertically centered
    padding: 20,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    marginTop: "5%",
  },
  headerButtonText: {
    color: "white",
    fontSize: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 20,
    marginTop: "4%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
  },
  listItem: {
    marginTop: 8,
  },
  listItemText: {
    fontSize: 16,
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: "87%",
    marginLeft: "7%",
    marginRight: "7%",
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

export default RecipeHome;