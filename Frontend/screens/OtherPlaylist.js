import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db } from "../firebase"; // Adjust this import according to your file structure
import { collection, query, where, getDocs } from "firebase/firestore";
import { Video } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";

const OtherPlaylist = ({ route, navigation }) => {
  const { userId } = route.params; // Ensure this userId is the same as in your Firestore documents
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      console.log("Attempting to fetch videos for userId:", userId); // Debugging log
      const q = query(
        collection(db, "playlist"),
        where("userID", "==", userId)
      );
      try {
        const querySnapshot = await getDocs(q);
        const fetchedVideos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched videos:", fetchedVideos); // Debugging log
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error); // Debugging log
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
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <View style={styles.videoContainer}>
        {videos.length > 0 ? (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text>No videos found</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  videoContainer: {
    marginBottom: 20,
    marginTop: "5%",
  },
  video: {
    width: "100%",
    height: 200,
    //marginTop: '10%',
  },
  caption: {
    fontSize: 16,
    marginTop: 5,
  },
  backIcon: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: "11%",
  },
});

export default OtherPlaylist;
