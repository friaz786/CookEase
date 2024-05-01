import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
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
//import Icon from "react-native-vector-icons/Ionicons";

const PostDetail = ({ route, navigation }) => {
  const { post } = route.params;
  const [likes, setLikes] = useState(post.likes || []);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  const handleLike = async () => {
    const postRef = doc(db, "posts", post.id);
    // Toggle like
    if (!likes.includes(currentUser.uid)) {
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser.uid),
      });
      setLikes([...likes, currentUser.uid]);
    } else {
      await updateDoc(postRef, {
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
    const postRef = doc(db, "posts", post.id);
    try {
      await updateDoc(postRef, {
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
      const postRef = doc(db, "posts", post.id);
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        if (postData.comments) {
          setComments(postData.comments); // Assuming 'comments' is an array field in your post document
        }
      } else {
        console.log("No such document!");
      }
    };

    fetchComments();
  }, [post.id]); // Dependency on post.id to refetch if the post changes

  useEffect(() => {
    console.log("Post User ID:", post.userID);
    console.log("Current User ID:", currentUser?.uid);
  }, [post, currentUser]);

  useEffect(() => {
    console.log(post); // Check the structure of 'post' to ensure it includes 'userId'
  }, [post]);

  const isCurrentUserThePoster = currentUser?.uid === post.userID;

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
    <SafeAreaView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>
      {isCurrentUserThePoster && (
        <TouchableOpacity
          style={styles.editPostButton}
          onPress={() => navigation.navigate("editpost", { post })}
        >
          <Text style={styles.editPostButtonText}>Edit Post</Text>
        </TouchableOpacity>
      )}
      {/* <Image source={{ uri: post.image }} style={styles.image} /> */}
      <View style={styles.imgContainer}>
      {post.image &&
      (post.image.endsWith(".mp4") || post.image.endsWith(".mov")) ? (
        <Video
          source={{ uri: post.image }}
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
        
        <Image source={{ uri: post.image }} style={styles.image} />
      )}
</View>
      {post.caption && <Text style={styles.caption}>{post.caption}</Text>}
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
      <Text style={styles.like}>{likes.length} Likes</Text>
      <Text style={styles.like}>{comments.length} Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentText}>{item.text}</Text>
            {/* Optionally display commenter's name or timestamp */}
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsCommentModalVisible(false);
        }}
      >
        {/* TouchableWithoutFeedback allows to dismiss the modal by tapping outside */}
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPressOut={() => setIsCommentModalVisible(false)}
        >
          {/* This inner view will stop the touch propagation */}
          <TouchableOpacity activeOpacity={1} style={styles.modalView}>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Write a comment..."
              autoFocus={true} // Optional: bring up the keyboard automatically
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
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  imgContainer:{
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    marginTop: "6%",
    alignItems: "center",
    justifyContent: "center",
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
  editPostButton: {
    paddingVertical: 8,
    width: "30%",
    paddingHorizontal: 16,
    marginRight: "10%",
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    marginTop: 45,
    marginLeft: "60%",
  },
  editPostButtonText: {
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

export default PostDetail;
