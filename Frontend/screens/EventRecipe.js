import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
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

  const renderListItem = (item, index) => (
    <View key={index} style={styles.listItem}>
      <Text style={styles.listItemText}>• {item}</Text>
    </View>
  );


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

      <Image 
    source={{ uri: recipe.image_url }}  // Ensure you use the correct property name for the URL
    style={styles.image}  // You might want to define the style for your images
  />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recipe Name </Text>
        <Text style={styles.cardContent}>{recipe.recipe}</Text>
        {/* <Text style={styles.cardContent}>
          Calorie count: {recipe.calorie_count} cal
        </Text> */}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ingredients</Text>
        {recipe.ingredients.map(renderListItem)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Steps</Text>
        {recipe.steps.map(renderListItem)}
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
    backgroundColor: "#F7F7F7",
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

export default EventRecipe;