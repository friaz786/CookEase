import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { db } from "../firebase"; // Adjust this import according to your Firebase configuration
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  getDocs,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Video } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons"; // Or any other icon library

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState(posts.comments || []);
  const [comment, setComment] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Assuming 'users' collection has a 'following' field as an array of userIds the current user follows
    const userRef = doc(db, "users", currentUser.uid);
    getDoc(userRef).then((docSnap) => {
      if (docSnap.exists()) {
        const following = docSnap.data().following;
        // Now, fetch posts from those users
        const postsRef = query(
          collection(db, "posts"),
          where("userID", "in", following)
        );
        onSnapshot(postsRef, (snapshot) => {
          const postsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(postsData);
        });
      }
    });
  }, []);

  const likePost = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: arrayUnion(currentUser.uid),
    });
  };

  const unlikePost = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: arrayRemove(currentUser.uid),
    });
  };

  useEffect(() => {
    const fetchComments = async (postId) => {
      const postRef = doc(db, "posts", postId);
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
  }, [posts.id]); // Dependency on post.id to refetch if the post changes

  const renderPost = ({ item }) => {
    const postLikes = item.likes || [];
    const isLiked = postLikes.includes(currentUser.uid);
    //const isLiked = item.likes.includes(currentUser.uid);
    return (
      <View style={{ margin: 10 }}>
        <Text>{item.caption}</Text>
        {item.image &&
        (item.image.endsWith(".mp4") || item.image.endsWith(".mov")) ? (
          <Video
            source={{ uri: item.image }}
            style={{ width: "100%", height: 300 }}
            useNativeControls
            resizeMode="contain"
          />
        ) : (
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 300 }}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => (isLiked ? unlikePost(item.id) : likePost(item.id))}
          >
            <Icon
              name={isLiked ? "heart" : "heart-outline"}
              size={25}
              color="red"
            />
          </TouchableOpacity>
          <Text>{item.likes.length} likes</Text>
          {/* Add Comment Icon and functionality here */}
        </View>
        {/* Render Comments */}
        <FlatList
          data={item.comments || []} // Use an empty array if comments are undefined
          keyExtractor={(comment) => comment.id}
          //data={item.comments}
          //keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.commentText}>{item.text}</Text>
              {/* Optionally display commenter's name or timestamp */}
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  commentInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    width: "90%",
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: "#4F8EF7",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
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
});

export default Feed;
