import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore"; // Import onSnapshot for real-time updates
import Icon from "react-native-vector-icons/Ionicons";
import { db } from "../firebase";

const MyGrocery = ({ navigation }) => {
  const [groceryList, setGroceryList] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);

      // Listen for real-time updates with onSnapshot
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists() && doc.data().groceryList) {
          setGroceryList(
            doc.data().groceryList.map((item, index) => ({
              ...item,
              id: item.id || index.toString(), // Ensure each item has an 'id'
            }))
          );
        } else {
          console.log("No such document or grocery list!");
        }
      });

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    }
  }, [auth.currentUser]); // Re-run useEffect if auth.currentUser changes

  const togglePurchase = async (id) => {
    const updatedList = groceryList.map((item) =>
      item.id === id ? { ...item, purchased: !item.purchased } : item
    );
    setGroceryList(updatedList);

    // Update document in Firestore is handled elsewhere, assuming in the togglePurchase or a similar function
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.groceryStoresButton}
        onPress={() => navigation.navigate('GroceryStores')}>
        <Text style={styles.groceryStoresButtonText}>Grocery Stores</Text>
      </TouchableOpacity> */}
      <FlatList
        data={groceryList}
        keyExtractor={(item) => item.id.toString()} // Ensure key is a string
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <TouchableOpacity onPress={() => togglePurchase(item.id)}>
              <Icon
                name={item.purchased ? "checkbox-outline" : "square-outline"}
                size={24}
                color="#007bff"
              />
            </TouchableOpacity>
            <Text style={[styles.itemText, item.purchased && styles.purchased]}>
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#4CAF50",
    borderWidth: 2,
    marginBottom: 10,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "#333333", // Darker text for better readability
  },
  purchased: {
    textDecorationLine: "line-through",
    color: "#777777", // A lighter grey to indicate the item has been purchased
  },
});

export default MyGrocery;
