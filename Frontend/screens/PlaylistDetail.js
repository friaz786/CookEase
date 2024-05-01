import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  FlatList,
  TextInput,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const PlaylistDetail = ({ route, navigation }) => {
  const { videoData } = route.params;
  const [likes, setLikes] = useState(videoData.likes || []);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(videoData.comments || []);
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  const handleLike = async () => {
    const videoDataRef = doc(db, "playlist", videoData.id);
    // Toggle like
    if (!likes.includes(currentUser.uid)) {
      await updateDoc(videoDataRef, {
        likes: arrayUnion(currentUser.uid),
      });
      setLikes([...likes, currentUser.uid]);
    } else {
      await updateDoc(videoDataRef, {
        likes: likes.filter((uid) => uid !== currentUser.uid),
      });
      setLikes(likes.filter((uid) => uid !== currentUser.uid));
    }
  };

  const toggleCommentModal = () => {
    setIsCommentModalVisible(!isCommentModalVisible);
  };

  const handleSaveComment = async () => {
    if (comment.trim() === "") return;
    const newComment = {
      userId: currentUser.uid,
      text: comment,
    };
    const videoDataRef = doc(db, "playlist", videoData.id);
    try {
      await updateDoc(videoDataRef, {
        comments: arrayUnion(newComment),
      });
      setComments([...comments, { ...newComment, timestamp: new Date() }]); // Optimistically update local state
      setComment(""); // Reset comment input
    } catch (error) {
      console.error("Error saving comment:", error);
      // Handle errors, e.g., show a user-friendly message
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const videoDataRef = doc(db, "playlist", videoData.id);
      const docSnap = await getDoc(videoDataRef);

      if (docSnap.exists()) {
        const videoDataData = docSnap.data();
        if (videoDataData.comments) {
          setComments(videoDataData.comments); // Assuming 'comments' is an array field in your videoData document
        }
      } else {
        console.log("No such document!");
      }
    };

    fetchComments();
  }, [videoData.id]); // Dependency on videoData.id to refetch if the videoData changes

  useEffect(() => {
    console.log("videoData User ID:", videoData.userID);
    console.log("Current User ID:", currentUser?.uid);
  }, [videoData, currentUser]);

  useEffect(() => {
    console.log(videoData); // Check the structure of 'videoData' to ensure it includes 'userId'
  }, [videoData]);

  const isCurrentUserThePoster = currentUser?.uid === videoData.userID;

  return (
    <SafeAreaView contentContainerStyle={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      {isCurrentUserThePoster && (
        <TouchableOpacity
          style={styles.editvideoDataButton}
          onPress={() => navigation.navigate("editvideo", { videoData })}
        >
          <Text style={styles.editvideoDataButtonText}>Edit Caption</Text>
        </TouchableOpacity>
      )}
      {/* <Image source={{ uri: videoData.image }} style={styles.image} /> */}
      <View style={styles.imgContainer}>
      {videoData.image &&
      (videoData.image.endsWith(".mp4") || videoData.image.endsWith(".mov")) ? (
        <Video
          source={{ uri: videoData.image }}
          style={styles.image}
          useNativeControls
          resizeMode="contain"
          shouldPlay // Auto-play the video
          isLooping // Loop the video
          onError={(e) => console.error("Error loading video", e)}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          //   {...isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        />
      ) : (
        <Image source={{ uri: videoData.image }} style={styles.image} />
      )}
</View>
      {videoData.caption && (
        <Text style={styles.caption}>{videoData.caption}</Text>
      )}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleLike}>
          <Icon
            name={likes.includes(currentUser.uid) ? "heart" : "heart-outline"}
            size={30}
            color="red"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCommentModal}>
          <Icon name="chatbubble-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Text>{likes.length} Likes</Text>
      {/* Implement comments display and adding new comments here */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsCommentModalVisible(!isCommentModalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPressOut={() => setIsCommentModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalView}>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Write a comment..."
              autoFocus={true}
            />
            <TouchableOpacity
              onPress={handleSaveComment}
              style={styles.commentButton}
            >
              <Text style={styles.commentButtonText}>Post Comment</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "white",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    marginTop: "6%",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
  },
  backIcon: {
    position: "absolute",
    top: 45, // Adjust top and left as per the design requirements
    left: 10,
    zIndex: 10,
  },
  like: {
    marginLeft: "3%",
    fontSize: 16,
    fontWeight: "bold",
  },
  imgContainer:{
    alignItems: "center",
    justifyContent: "center",
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginTop: "2%",
    marginBottom: "5%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginLeft: "2%",
  },
  commentButton: {
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "7%",
    marginTop: "1%",
    marginLeft: "10%",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  commentButtonText: {
    color: "white",
    textAlign: "center",
  },
  comment: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  commentText: {
    fontSize: 16,
  },
  caption: {
    fontSize: 16,
    fontWeight: "normal", // Adjust as needed
    padding: 10, // Provide some padding around the text
    color: "#000", // Adjust color as needed
  },
  editvideoDataButton: {
    paddingVertical: 8,
    width: "30%",
    paddingHorizontal: 16,
    marginRight: "10%",
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    marginTop: 45,
    marginLeft: "60%",
  },
  editvideoDataButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default PlaylistDetail;
