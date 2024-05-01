import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { Video } from "expo-av";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Home = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState(posts.comments || []);
  const [comment, setComment] = useState("");
  const [isFollowingAnyone, setIsFollowingAnyone] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Sugary ingredients array
  const sugaryIngredients = [
    "sugar",
    "syrup",
    "honey",
    "molasses",
    "corn syrup",
    "high-fructose corn syrup",
    "dextrose",
    "fructose",
  ];
  const bpConcerningIngredients = ["salt", "sodium", "caffeine", "sugar"];

  useEffect(() => {
    const fetchRecipes = async () => {
      const trimmedQuery = searchQuery.trim().toLowerCase(); // Convert search query to lowercase

      if (trimmedQuery === "") {
        setRecipes([]);
        return;
      }

      try {
        // Query against the lowercase name
        const q = query(
          //collection(db, "recipes"),
          collection(db, "recipe"),
          where("name_lower", ">=", trimmedQuery),
          where("name_lower", "<=", trimmedQuery + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);
        const fetchedRecipes = [];
        querySnapshot.forEach((doc) => {
          fetchedRecipes.push({ id: doc.id, ...doc.data() });
        });
        setRecipes(fetchedRecipes);
        //console.log(date);
      } catch (error) {
        console.log("Error getting documents: ", error);
      }
    };

    const timer = setTimeout(() => {
      fetchRecipes();
    }, 500); // Debounce the search to reduce database queries

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const checkHealthConcernsAndNavigate = async (recipe) => {
    // Assuming healthData is structured with hasDiabetes and hasBloodPressure
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    try {
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data().healthData) {
        const healthData = userDocSnap.data().healthData;
        let alertMessage = "";

        if (healthData.hasDiabetes) {
          // Check for sugary ingredients
          const hasSugaryIngredient = recipe.ingredients.some((ingredient) =>
            sugaryIngredients.includes(ingredient.toLowerCase())
          );

          if (hasSugaryIngredient) {
            alertMessage +=
              "This recipe contains ingredients that could be harmful for your health due to diabetes, so adjust sugar accordingly.\n\n";
          }
        }

        if (healthData.hasBloodPressure) {
          // Check for BP concerning ingredients
          const hasBPConcerningIngredient = recipe.ingredients.some(
            (ingredient) =>
              bpConcerningIngredients.includes(ingredient.toLowerCase())
          );

          if (hasBPConcerningIngredient) {
            alertMessage +=
              "This recipe contains ingredients that could be harmful for high blood pressure patients, so adjust ingredients accordingly.\n\n";
          }
        }

        if (alertMessage) {
          // Show combined alert if any health concerns are detected
          Alert.alert("Health Alert", alertMessage.trim(), [
            { text: "Cancel", style: "cancel" },
            {
              text: "Proceed Anyway",
              onPress: () =>
                navigation.navigate("RecipeHome", {
                  recipe,
                }),
            },
          ]);
        } else {
          // Safe to proceed if no alerts
          navigation.navigate("RecipeHome", { recipe });
        }
      } else {
        // No healthData found, proceed
        navigation.navigate("RecipeHome", { recipe });
      }
    } catch (error) {
      console.error("Error checking health data: ");
      // Handle error or proceed with navigation as needed
    }
  };

  // useEffect(() => {
  //   // Assuming 'users' collection has a 'following' field as an array of userIds the current user follows
  //   const userRef = doc(db, 'users', currentUser.uid);
  //   getDoc(userRef).then((docSnap) => {
  //     if (docSnap.exists()) {
  //       const following = docSnap.data().following;
  //       // Now, fetch posts from those users
  //       const postsRef = query(collection(db, 'posts'), where('userID', 'in', following));
  //       onSnapshot(postsRef, (snapshot) => {
  //         const postsData = snapshot.docs.map(doc => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));
  //         setPosts(postsData);
  //       });
  //     }
  //   });
  // }, [posts]);

  // const likePost = async (postId) => {
  //   const postRef = doc(db, 'posts', postId);
  //   await updateDoc(postRef, {
  //     likes: arrayUnion(currentUser.uid),
  //   });
  // };

  // const unlikePost = async (postId) => {
  //   const postRef = doc(db, 'posts', postId);
  //   await updateDoc(postRef, {
  //     likes: arrayRemove(currentUser.uid),
  //   });
  // };

  // useEffect(() => {
  //   const fetchComments = async (postId) => {
  //     const postRef = doc(db, 'posts', postId);
  //     const docSnap = await getDoc(postRef);

  //     if (docSnap.exists()) {
  //       const postData = docSnap.data();
  //       if (postData.comments) {
  //         setComments(postData.comments); // Assuming 'comments' is an array field in your post document
  //       }
  //     } else {
  //       console.log("No such document!");
  //     }
  //   };

  //   fetchComments();
  // }, [posts.id]); // Dependency on post.id to refetch if the post changes

  // useEffect(() => {
  //   const userRef = doc(db, 'users', currentUser.uid);
  //   getDoc(userRef).then((docSnap) => {
  //     if (docSnap.exists()) {
  //       const following = docSnap.data().following;
  //       setIsFollowingAnyone(following.length > 0); // Update based on the length of the following array
  //       if (following.length > 0) {
  //         const postsRef = query(collection(db, 'posts'), where('userID', 'in', following));
  //         onSnapshot(postsRef, (snapshot) => {
  //           const postsData = snapshot.docs.map(doc => ({
  //             id: doc.id,
  //             ...doc.data(),
  //           }));
  //           setPosts(postsData);
  //         });
  //       }
  //     }
  //   });
  // }, [posts, isFollowingAnyone]);

  // const renderPost = ({ item }) => {
  //   const postLikes = item.likes || [];
  //   const isLiked = postLikes.includes(currentUser.uid);
  //   //const isLiked = item.likes.includes(currentUser.uid);
  //   return (
  //     <View style={{ margin: 10 }}>
  //       <Text>{item.caption}</Text>
  //       {
  //         item.image && (item.image.endsWith('.mp4') || item.image.endsWith('.mov')) ? (
  //           <Video
  //             source={{ uri: item.image }}
  //             style={{ width: '100%', height: 300 }}
  //             useNativeControls
  //             resizeMode="contain"
  //           />
  //         ) : (
  //           <Image source={{ uri: item.image }} style={{ width: '100%', height: 300 }} />
  //         )
  //       }
  //       <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
  //         <TouchableOpacity onPress={() => isLiked ? unlikePost(item.id) : likePost(item.id)}>
  //           <Icon name={isLiked ? 'heart' : 'heart-outline'} size={25} color="red" />
  //         </TouchableOpacity>
  //         <Text>{item.likes.length} likes</Text>
  //         {/* Add Comment Icon and functionality here */}
  //       </View>
  {
    /* Render Comments */
  }

  //      </View>
  //   );
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Simplify Your Cooking Journey...</Text>

      <TextInput
        style={styles.input}
        placeholder="Search recipe by name"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => checkHealthConcernsAndNavigate(item)}
          >
            <Text style={styles.recipeItem}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {/* <View style={{ flex: 12, width: '100%', }}>
        {isFollowingAnyone ? (
          posts.length > 0 ? (
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
            />
          ) : (
            // User is following others, but there are no posts
            <View style={styles.center}>
              <Text style={{ color: 'grey', marginTop: 10 }}>
                No posts available
              </Text>
            </View>
          )
        ) : (
          // User is not following anyone
          <View style={styles.center}>
            <MaterialCommunityIcons name="home-outline" size={50} color="grey" />
            <Text style={{ color: 'grey', marginTop: 10 }}>
              Follow users to see their posts
            </Text>
          </View>
        )}
      </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Use a light background for the whole screen
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    position: "absolute",
    top: 45, // Adjust top and left as per the design requirements
    left: 10,
    zIndex: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: "5%",
    marginTop: "10%",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recipeItem: {
    padding: 15, // Increased padding for more space inside the boxes
    marginTop: 10, // Add more space between items
    backgroundColor: "#ffe6e6",
    borderWidth: 1, // Removing border as the background color is enough contrast
    borderRadius: 20,
    borderColor: "#ffe6e6", // More pronounced rounded corners
    color: "black",
    fontSize: 18,

    shadowColor: "#000", // Shadow for iOS
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.6,
    elevation: 4, // Elevation for Android
  },
  recipe: {
    borderRadius: 20, // More pronounced rounded corners
  },
});

export default Home;