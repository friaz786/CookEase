import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { db } from "../firebase"; // Adjust this import according to your file structure
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/Ionicons";
import { query, where, getDocs } from "firebase/firestore";
import { Video } from "expo-av";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

const OtherUserProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const [userProfile, setUserProfile] = useState({
    name: "",
    followers: [],
    following: [],
    subscribers: [],
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [userPosts, setUserPosts] = useState([]);
  const [userIsChef, setUserIsChef] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [currentView, setCurrentView] = useState("posts"); // "posts" or "blogs"

  // Fetch the role of the user when the component is mounted or when userId changes
  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     const userDocRef = doc(db, 'users', userId);
  //     const docSnap = await getDoc(userDocRef);
  //     if (docSnap.exists()) {
  //       const userData = docSnap.data();
  //       setUserIsChef(userData.role === 'chef'); // Set userIsChef based on the role
  //       setCurrentUserSubscribed(userData.subscribers?.includes(currentUser.uid)); // Check if the current user is subscribed
  //     }
  //   };

  //   fetchUserRole();
  // }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      //console.log('userId', userId);
      // Assuming you have a 'posts' collection with a 'userID' field linking to the user's UID
      const postsRef = query(
        collection(db, "posts"),
        where("userID", "==", userId),
        //orderBy("createdAt", "asc")
      );

      const postsSnap = await getDocs(postsRef);
      const fetchedPosts = [];
      postsSnap.forEach((doc) => {
        fetchedPosts.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserPosts(fetchedPosts); // Set the user's posts
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profileData = docSnap.data();
        setUserProfile({
          ...profileData,
          id: docSnap.id,
          following: profileData.following || [],
        }); // Ensure followers and posts are included
        setIsFollowing(profileData.followers?.includes(currentUser?.uid)); // Check if current user is following
      } else {
        console.log("No such document!");
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleFollow = async () => {
    if (!currentUser) return; // Guard clause in case currentUser is null

    // Reference to the profile being viewed
    const viewedUserRef = doc(db, "users", userId);
    // Reference to the current user's document
    const currentUserRef = doc(db, "users", currentUser.uid);

    try {
      if (isFollowing) {
        // If already following, remove userId from currentUser's following list and vice versa
        await updateDoc(viewedUserRef, {
          followers: arrayRemove(currentUser.uid),
        });
        await updateDoc(currentUserRef, {
          following: arrayRemove(userId),
        });
        setIsFollowing(false);
        // Update local state to reflect change
        setUserProfile((prevState) => ({
          ...prevState,
          followers: prevState.followers.filter(
            (followerId) => followerId !== currentUser.uid
          ),
        }));
      } else {
        // If not following, add userId to currentUser's following list and vice versa
        await updateDoc(viewedUserRef, {
          followers: arrayUnion(currentUser.uid),
        });
        await updateDoc(currentUserRef, {
          following: arrayUnion(userId),
        });
        setIsFollowing(true);
        // Optimistically update local state to reflect change
        setUserProfile((prevState) => ({
          ...prevState,
          followers: [...prevState.followers, currentUser.uid],
        }));
      }
    } catch (error) {
      console.error("Error updating follow state:", error);
      // Optionally handle the error, e.g., through user feedback
    }
  };

  useEffect(() => {
    const fetchAdditionalUserData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserIsChef(data.role === "chef"); // Assuming 'role' field holds the user role
        setIsSubscribed(data.subscribers?.includes(currentUser.uid)); // Assuming 'subscribers' field holds an array of subscriber IDs
      }
    };

    fetchAdditionalUserData();
  }, [userId, currentUser.uid]);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const subscribeToUser = async () => {
    try {
      if (!currentUser) return;
      const amount = 151;
      if (amount > 150) {
        const paymentResponse = await axios.post(
          `http://172.20.5.193:8080/payments/intents`,
          {
            amount: amount * 100,
          }
        );

        console.log(paymentResponse);

        if (paymentResponse.status === 400) {
          Alert.alert("Something went wrong");
          return;
        }
        const initResponse = await initPaymentSheet({
          merchantDisplayName: "CookEase",
          paymentIntentClientSecret: paymentResponse.data.paymentIntent,
        });

        if (initResponse.error) {
          Alert.alert("Something went wrong");
          return;
        }

        const paymentSheetResponse = await presentPaymentSheet();
        if (paymentSheetResponse.error) {
          Alert.alert(
            `Error code: ${paymentSheetResponse.error.code}`,
            paymentSheetResponse.error.message
          );
          return;
        }
      } else {
        Alert.alert(
          "Price Limit",
          `Minimum total price for payment through card must be more than Rs. 150, your amount is ${amount}
          `
        );
        return;
      }
      const profileRef = doc(db, "users", userId);
      const currentUserRef = doc(db, "users", currentUser.uid);

      await updateDoc(profileRef, {
        subscribers: arrayUnion(currentUser.uid),
      });
      await updateDoc(currentUserRef, {
        subscribedTo: arrayUnion(userId),
      });
      setIsSubscribed(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  // New function to handle unsubscription
  const unsubscribeFromUser = async () => {
    if (!currentUser) return;
    const profileRef = doc(db, "users", userId);
    const currentUserRef = doc(db, "users", currentUser.uid);

    await updateDoc(profileRef, {
      subscribers: arrayRemove(currentUser.uid),
    });
    await updateDoc(currentUserRef, {
      subscribedTo: arrayRemove(userId),
    });
    setIsSubscribed(false);
  };

  const handlePlaylistPress = () => {
    if (isSubscribed) {
      // User is subscribed, navigate to the Playlist screen with the userId parameter
      navigation.navigate("otherplaylist", { userId: userId });
    } else {
      // User is not subscribed, show an alert
      Alert.alert(
        "Subscribe Required",
        "Please subscribe to access the playlist.",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    const fetchUserBlogs = async () => {
      // Assuming you have a 'blogs' collection with a 'userID' field linking to the user's UID
      const blogsRef = query(
        collection(db, "blogs"),
        where("userId", "==", userId),
        // Optionally, add orderBy to sort the blogs
      );
  
      const blogsSnap = await getDocs(blogsRef);
      const fetchedBlogs = [];
      blogsSnap.forEach((doc) => {
        fetchedBlogs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserBlogs(fetchedBlogs); // Set the user's blogs
    };
  
    fetchUserBlogs();
  }, [userId]); // Depend on userId to refetch when it changes
  

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userProfile.profilePhoto }}
          style={styles.profilePic}
        />
        <Text style={styles.userName}>{userProfile.name}</Text>

        <View style={styles.countsContainer}>
          <View style={styles.countItem}>
            <Text style={styles.countNumber}>
              {userProfile.followers.length}
            </Text>
            <Text style={styles.countLabel}>Followers</Text>
          </View>

          {userIsChef && (
            <View style={styles.countItem}>
              <Text style={styles.countNumber}>
                {userProfile.subscribers.length ?? 0}
              </Text>
              <Text style={styles.countLabel}>Subscribers</Text>
            </View>
          )}
          <View style={styles.countItem}>
            <Text style={styles.countNumber}>
              {userProfile.following.length}
            </Text>
            <Text style={styles.countLabel}>Following</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleFollow} style={styles.button}>
            <Text style={styles.buttonText}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
          {userIsChef && (
            <>
              {!isSubscribed ? (
                <TouchableOpacity
                  onPress={subscribeToUser}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Subscribe</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={unsubscribeFromUser}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>UnSub</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handlePlaylistPress}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Playlist</Text>
              </TouchableOpacity>
            </>
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
                  {/* Render additional blog details */}
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
    //alignItems: "center",
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

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginBottom: 20, // Space below the buttons
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
  buttonText: {
    color: "white",
    fontSize: 16,
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
    paddingHorizontal: 10,
  },
  postItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 2,
  },
  image: {
    flex: 1, // Make the image fill the entire space
    margin: 1, // Margin to create spacing between images
    // Remove aspectRatio here if you want the images to fill the space
  },
});

export default OtherUserProfile;
