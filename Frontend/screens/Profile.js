import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { db } from "../firebase"; // Your Firebase configuration file
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  getFirestore,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { Video } from "expo-av";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";

const Profile = ({ navigation }) => {
  const [userName, setUserName] = useState({ name: "Loading..." });
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChef, setIsChef] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [currentView, setCurrentView] = useState("posts"); // "posts" or "blogs"

  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();

  useEffect(() => {
    if (user) {
      // Fetch user's name
      const userDocRef = doc(db, "users", user.uid);

      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName({ ...userName, ...docSnap.data() }); // Assuming the field for the user's name is 'name'
            setUserProfile(userData);
            setUserProfilePic(userData.profilePhoto);
            //setUserProfilePic(userData.profilePhoto);
          } else {
            console.log("No user data found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
    if (user && user.photoURL) {
      setUserProfilePic(user.photoURL);
    }
  }, [user, userProfile]);

  // Fetch user's role and subscription status
  useEffect(() => {
    const fetchUserRoleAndSubscription = async () => {
      const userDocRef = doc(db, "users", user.uid);

      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setIsChef(userData.role === "chef");
        setIsSubscribed(userData.subscribers?.includes(currentUser.uid));
      }
    };

    fetchUserRoleAndSubscription();
  }, [user.uid]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      console.log("Starting upload...");
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Blob created");

      const fileRef = ref(storage, `profile_photos/${user.uid}`);
      console.log("Storage ref created:", fileRef);

      await uploadBytes(fileRef, blob);
      console.log("Blob uploaded");

      const photoURL = await getDownloadURL(fileRef);

      console.log("Download URL received:", photoURL);
      setUserProfilePic(photoURL);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { profilePhoto: photoURL });
        console.log("Firestore document updated with new photo URL");
      }
      // ... (the rest of your code for updating Firestore and state)
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      // Assuming you have a 'posts' collection with a 'userID' field linking to the user's UID
      const postsRef = query(
        collection(db, "posts"),
        where("userID", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const postsSnap = await getDocs(postsRef);
      const fetchedPosts = [];
      postsSnap.forEach((doc) => {
        fetchedPosts.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      //console.log(fetchedPosts);
      setUserPosts(fetchedPosts); // Set the user's posts
      //console.log(userPosts);
    };

    fetchUserData();
  }, [userPosts]);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (user) {
        const blogsRef = query(
          collection(db, "blogs"),
          where("userId", "==", user.uid)
          //orderBy("createdAt", "desc") // Assuming you have a 'createdAt' field for sorting
        );
        const blogsSnap = await getDocs(blogsRef);
        const fetchedBlogs = [];
        blogsSnap.forEach((doc) => {
          fetchedBlogs.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setUserBlogs(fetchedBlogs);
      }
    };

    fetchUserBlogs();
  }, [user, userBlogs]);

  const deleteBlog = async (blogId) => {
    // Show confirmation alert before deleting
    Alert.alert("Delete Blog", "Are you sure you want to delete this blog?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "blogs", blogId));
            // Optionally, refresh the list or show a confirmation message
            Alert.alert("Blog deleted successfully");
          } catch (error) {
            console.error("Error deleting blog:", error);
            Alert.alert("Error deleting blog");
          }
        },
      },
    ]);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          {userProfilePic ? (
            <Image source={{ uri: userProfilePic }} style={styles.profilePic} />
          ) : (
            <Icon name="person-circle-outline" size={100} color="#4F8EF7" />
          )}
        </TouchableOpacity>
        <Text style={styles.userName}>{userName.name || "User Name"}</Text>

        {/* Counts Container positioned before the Button Container */}
        <View style={styles.countsContainer}>
          <View style={styles.countItem}>
            <Text style={styles.countNumber}>
              {userProfile.followers?.length || 0}
            </Text>
            <Text style={styles.countLabel}>Followers</Text>
          </View>
          {isChef && (
            <View style={styles.countItem}>
              <Text style={styles.countNumber}>
                {userProfile.subscribers?.length || 0}
              </Text>
              <Text style={styles.countLabel}>Subscribers</Text>
            </View>
          )}
          <View style={styles.countItem}>
            <Text style={styles.countNumber}>
              {userProfile.following?.length || 0}
            </Text>
            <Text style={styles.countLabel}>Following</Text>
          </View>
        </View>

        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("editprofile")}
          >
            <Text style={styles.text}>Edit Profile</Text>
          </TouchableOpacity>

          {isChef && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("playlist", { userId: user.uid })
              }
            >
              <Text style={styles.text}>My Playlist</Text>
            </TouchableOpacity>
          )}

          {currentView === "posts" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("add")}
            >
              <Text style={styles.text}>Upload Post</Text>
            </TouchableOpacity>
          )}

          {currentView === "blogs" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("uploadblog")}
            >
              <Text style={styles.text}>Upload Blog</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setCurrentView("posts")}
        >
          <MaterialCommunityIcons name="grid" size={30} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setCurrentView("blogs")}
        >
          <FontAwesome5 name="readme" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      <View style={styles.container1}>
        <View style={styles.container1}>
          {currentView === "posts" ? (
            <FlatList
              key={"posts-3-columns"} // Unique key for posts view
              data={userPosts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("postdetail", { post: item })
                  }
                  style={styles.postItem}
                >
                  {item.image &&
                  (item.image.endsWith(".mp4") ||
                    item.image.endsWith(".mov")) ? (
                    <Video
                      source={{ uri: item.image }}
                      style={styles.image}
                      useNativeControls
                      resizeMode="contain"
                    />
                  ) : (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  )}
                </TouchableOpacity>
              )}
              numColumns={3}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            />
          ) : (
            <FlatList
              key={"blogs-1-column"} // Unique key for blogs view, assuming 1 column for blogs
              data={userBlogs} // Replace with your state variable for blogs
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                // Adjust according to how you want to render each blog
                <View style={styles.blogPostContainer}>
                  <Text style={styles.blogTitle}>{item.title}</Text>
                  <Text style={styles.blogText}>{item.text}</Text>
                  <View style={styles.blogActions}>
                    {/* <TouchableOpacity
                  onPress={() => editBlog(item)}
                  style={styles.blogActionButton}
                >
                  <Feather name="edit" size={24} color="black" />
                </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() => deleteBlog(item.id)}
                      style={styles.blogActionButton}
                    >
                      <MaterialIcons
                        name="delete-forever"
                        size={24}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              numColumns={1} // Assuming blogs are rendered in a single column
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  blogPostContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  blogText: {
    fontSize: 14,
  },
  blogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  blogActionButton: {
    marginLeft: 10,
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 20, // Adjust padding top for safe area
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dbdbdb",
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60, // Make it perfectly round
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 8,
  },
  countsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginBottom: 10, // Space between counters and buttons
  },
  countItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  countNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#262626",
  },
  countLabel: {
    fontSize: 14,
    color: "#8e8e8e",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginBottom: 20, // Space below the buttons
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: "white",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#dbdbdb",
    backgroundColor: "#fafafa",
    marginTop: "-5%",
  },

  iconButton: {
    alignItems: "center",
  },
  image: {
    width: "33%",
    aspectRatio: 1,
    margin: 1,
  },
  container1: {
    paddingHorizontal: 10, // Side padding for the whole container
  },
  postItem: {
    flex: 1 / 3, // Divide the row into three equal parts
    aspectRatio: 1, // Your images are square
    padding: 2, // This will create a small space between items
  },
  image: {
    flex: 1, // Make the image fill the entire space
    margin: 1, // Margin to create spacing between images
    // Remove aspectRatio here if you want the images to fill the space
  },
});

export default Profile;
