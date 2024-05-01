import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  SafeAreaView,

} from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // Adjust this import according to your file structure
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Video } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";

const Playlist = ({ route, navigation }) => {
  const { userId } = route.params; // UserId of the profile being visited
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Query to fetch videos from the 'playlist' collection for the given userId
        const videosQuery = query(
          collection(db, "playlist"),
          where("userID", "==", userId),
          orderBy("createdAt", "asc")
        );
        const querySnapshot = await getDocs(videosQuery);
        const fetchedVideos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos: ", error);
        Alert.alert("Error", "Could not fetch videos.");
      }
    };

    fetchVideos();
  }, [userId]);

  const renderVideoItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={() =>
          navigation.navigate("playlistdetail", { videoData: item })
        }
      >
        <Video
          source={{ uri: item.image }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.caption}>{item.caption}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>

      {/* List of videos */}
      <FlatList
        style={styles.videos}
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
      />
      {/* Conditionally showing buttons based on profile */}
      {currentUser?.uid === userId && (
        <View style={styles.buttonsContainer}>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("reels")} // Replace 'AddVideo' with your actual route name
          >
            <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("reels")}
          >
            <Text style={styles.buttonText}>Add Playlist</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("meeting")} // Replace 'CreateClass' with your actual route name
          >
            <Text>Schedule Class</Text>
            <Ionicons name="school-outline" size={24} color="#4CAF50" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("meeting")}
          >
            <Text style={styles.buttonText}>Schedule Class</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Adding a light background color for better contrast
  },
  backIcon: {
    position: "absolute",
    top: 20, // Adjust for better alignment with the status bar
    left: 10,
    zIndex: 10,
    marginTop: "7%",
  },
  imgContainer:{
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    marginTop: "10%",
  },
  videoContainer: {
    width: "100%",
    marginBottom: 20, // Adding space between video items
    alignItems: "center", // Center align video items
  },
  video: {
    aspectRatio: 16 / 9,
    width: "90%", // Adjusting width to not be full screen
    borderRadius: 10, // Adding border radius for a more modern look
    overflow: "hidden", // Ensuring the border radius clips the video
    borderWidth: 1, // Adding a subtle border
    borderColor: "#e1e1e1", // Light grey border for slight contrast
    marginTop: '10%',
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20, // Providing spacing from the top
    marginBottom: 20, // Providing spacing before the video list starts
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 115,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    marginTop: "5%",
    //fontWeight: "bold",
  },
  caption: {
    marginTop: 4,
    fontSize: 16,
    color: "#333",
    width: "90%",
  },
  // Add more styles as needed
});

export default Playlist;
