import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';

const GroceryStores = () => {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const requestLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow the app to use location services.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      fetchStoresNearby(currentLocation.coords.latitude, currentLocation.coords.longitude);
    };

    requestLocation();
  }, []);

  const fetchStoresNearby = async (latitude, longitude) => {
    try {
      // Simulated API call; replace with your actual backend endpoint
      const response = await fetch(`https://example.com/api/stores/nearby?latitude=${latitude}&longitude=${longitude}`);
      const stores = await response.json();
      setStores(stores);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      Alert.alert("Fetch Error", "Could not fetch the stores.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.storeItem}>
            <Text style={styles.storeName}>{item.name}</Text>
            <Text style={styles.storeAddress}>{item.address}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  storeItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  storeName: {
    fontSize: 18,
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default GroceryStores;
