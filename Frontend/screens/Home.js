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
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { Video } from "expo-av";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Home = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [recipesH, setRecipesH] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchInitialRecipes();
  }, []);

  const fetchInitialRecipes = async () => {
    setLoading(true);
    const q = query(collection(db, "recipe"), orderBy("name_lower"), limit(4));
    const querySnapshot = await getDocs(q);
    const fetchedRecipes = [];
    querySnapshot.forEach(doc => {
      fetchedRecipes.push({ id: doc.id, ...doc.data() });
    });
    setRecipesH(fetchedRecipes);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);
  };

  const fetchMoreRecipes = async () => {
    if (loading || !lastVisible) return;

    setLoading(true);
    const q = query(
      //collection(db, "recipes"),
      collection(db, "recipe"),
      orderBy("name_lower"),
      startAfter(lastVisible),
      limit(4)
    );
    const querySnapshot = await getDocs(q);
    const fetchedRecipes = [];
    querySnapshot.forEach(doc => {
      fetchedRecipes.push({ id: doc.id, ...doc.data() });
    });
    setRecipesH([...recipesH, ...fetchedRecipes]);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);
  };

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
                navigation.navigate("Recipe", {
                  recipe,
                }),
            },
          ]);
        } else {
          // Safe to proceed if no alerts
          navigation.navigate("Recipe", { recipe });
        }
      } else {
        // No healthData found, proceed
        navigation.navigate("Recipe", { recipe });
      }
    } catch (error) {
      console.error("Error checking health data: ");
      // Handle error or proceed with navigation as needed
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Simplify Your Cooking Journey...</Text>

      <TextInput
        style={styles.input}
        placeholder="Search recipe by name"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
    {recipes.length > 0 && (
      <View style={styles.searchOverlay}>
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
      </View>
      )}
      <FlatList
        data={recipesH}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("Recipe", { recipe: item })}>
            <View style={styles.recipeItemH}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <Text style={styles.recipeName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={fetchMoreRecipes}
        onEndReachedThreshold={0.5}
      />

    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Use a light background for the whole screen
    //padding: 20,
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
    width: "95%",
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
    alignSelf: "center",
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  recipeName: {
    flex: 1,
    alignSelf: "left",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    paddingTop: 10,
  },

  recipeItemH: {
    paddingBottom: 15, // Increased padding for more space inside the boxes
    marginTop: 10, // Add more space between items
    backgroundColor: "#f9f9f9",
    borderWidth: 1, // Removing border as the background color is enough contrast
    borderRadius: 10,
    borderColor: "#f9f9f9", // More pronounced rounded corners
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
  searchOverlay: {
    position: 'absolute',
    top: 210,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 1000,
    opacity: 0.9,
  },

});

export default Home;