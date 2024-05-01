import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import { db } from "../firebase"; // Ensure this path matches your firebase config file's location
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const UserSearch = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserCuisines, setCurrentUserCuisines] = useState([]);
  const [matchingChefs, setMatchingChefs] = useState([]);

  useEffect(() => {
    const fetchCurrentUserCuisines = async () => {
      const auth = getAuth();
      const currentUserUID = auth.currentUser?.uid; // Assuming the user is already authenticated
      if (!currentUserUID) return;

      const userDocRef = doc(db, "users", currentUserUID);
      console.log("user", currentUserUID);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data().cuisines) {
        setCurrentUserCuisines(userDocSnap.data().cuisines);
      } else {
        console.log("Cuisine data not found or user document does not exist");
      }
      console.log("Current User Cuisines: ", userDocSnap.data().cuisines);
    };

    fetchCurrentUserCuisines();
  }, []);

  useEffect(() => {
    const findMatchingChefs = async () => {
      if (currentUserCuisines.length === 0) return;

      let chefs = [];
      for (const cuisine of currentUserCuisines) {
        const chefsQuery = query(
          collection(db, "users"),
          where("role", "==", "chef"),
          where("cuisines", "array-contains", cuisine)
        );
        const querySnapshot = await getDocs(chefsQuery);
        querySnapshot.forEach((doc) => {
          const chefData = { id: doc.id, ...doc.data() };
          if (!chefs.some((chef) => chef.id === chefData.id)) {
            chefs.push(chefData);
          }
        });
      }

      console.log("Matching Chefs:", chefs);
      setMatchingChefs(chefs);
    };

    findMatchingChefs();
  }, [currentUserCuisines]);
  const searchUsers = async () => {
    if (!searchText.trim()) {
      setUsers([]);
      return;
    }
    const q = query(
      collection(db, "users"),
      where("name", ">=", searchText),
      where("name", "<=", searchText + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const searchedUsers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(searchedUsers);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={searchUsers} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
              navigation.navigate("otheruserprofile", { userId: item.id })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.containerone}>
        <Text style={styles.heading}>Some Recommended Chefs for You</Text>
        <FlatList
          data={matchingChefs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chefCard}
              onPress={() =>
                navigation.navigate("otheruserprofile", { userId: item.id })
              }
            >
              <Image
                source={{ uri: item.profilePhoto }}
                style={styles.chefPhoto}
              />
              <Text style={styles.chefName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  containerone: {
    flex: 10,
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "98%",
    margin: "1%",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 20,
    fontSize: 16,
    color: "#333",
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "white",
    shadowColor: "black",
  },
  userItem: {
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
    elevation: 4,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 11,
    alignItems: "center",
    borderRadius: 10,
    width: "30%",
    //marginLeft: "10%",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    //paddingRight: 20,
  },

  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  chefItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chefCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chefPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  chefName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UserSearch;
