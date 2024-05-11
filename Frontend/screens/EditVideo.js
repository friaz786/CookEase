import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Button,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";

const EditVideo = ({ route, navigation }) => {
  const { videoData } = route.params;
  const [caption, setCaption] = useState(videoData.caption || "");

  useEffect(() => {
    // Optionally, load the videoData data if not passed through navigation params
  }, []);

  //   const handleSave = async () => {
  //     const videoDataRef = doc(db, 'videoDatas', videoData.id);
  //     try {
  //       await updateDoc(videoDataRef, { caption });
  //       navigation.goBack(); // Or navigate to a specific screen
  //     } catch (error) {
  //       console.error("Error updating videoData:", error);
  //     }
  //   };

  const handleSave = async () => {
    const videoDataRef = doc(db, "playlist", videoData.id);
    try {
      await updateDoc(videoDataRef, { caption });
      // Assuming you've updated the local 'videoData' object's caption as well
      // Navigate back to videoDataDetail with the updated videoData object
      navigation.navigate("playlistdetail", {
        videoData: { ...videoData, caption },
      });
    } catch (error) {
      console.error("Error updating videoData:", error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete videoData",
      "Are you sure you want to delete this videoData?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => deletevideoData() },
      ]
    );
  };

  const deletevideoData = async () => {
    const videoDataRef = doc(db, "playlist", videoData.id);
    try {
      await deleteDoc(videoDataRef);
      navigation.navigate("My Profile"); // Or navigate to the screen you prefer
    } catch (error) {
      console.error("Error deleting videoData:", error);
    }
  };

  return (
    <View contentContainerStyle={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        placeholder="Edit Caption"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deletebutton} onPress={handleDelete}>
        <Text style={styles.deletebuttonText}>Delete Video Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    alignItems: "center",
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
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#4CAF50",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    marginTop: 50,
    marginHorizontal: "5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#4CAF50",
    borderWidth: 2,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "40%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "7%",
    marginHorizontal: "30%",
    marginTop: "7%",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
  },
  deletebutton: {
    backgroundColor: "#b30000",
    width: "40%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "7%",
    marginHorizontal: "30%",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deletebuttonText: {
    color: "#fff",
    fontSize: 17,
  },
});
export default EditVideo;