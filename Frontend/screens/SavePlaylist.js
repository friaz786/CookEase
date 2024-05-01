import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, Button, StyleSheet, Alert,   SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback, Text, TouchableOpacity} from 'react-native';
import { db } from '../firebase'; // Import your Firebase config
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function Save({ route, navigation }) {
  const { image } = route.params;
  const [caption, setCaption] = useState('');
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUserID(user.uid);
      } else {
        // User is signed out
        // Handle user being signed out if necessary
      }
    });
    return unsubscribe; // Make sure we unsubscribe on component unmount
  }, []);

  async function handleCreatePost(userID, image, caption) {
    try {
      await addDoc(collection(db, 'playlist'), {
        userID,
        image,
        caption,
        likes: [], // Default likes count
        comments: [], // Default comments array
        createdAt: new Date(), // Add a timestamp if you need to sort or filter by creation date
      });
      console.log('playlist saved to Firebase');
    } catch (error) {
      console.error('Error saving post to Firebase:', error);
      throw new Error('Failed to save post to Firebase');
    }
  }

  const handleSavePost = async () => {
    if (!userID) {
      Alert.alert('Error', 'You must be signed in to save a post.');
      return;
    }

    try {
      await handleCreatePost(userID, image, caption);
      Alert.alert('Success', 'Video added to playlist successfully!');
      navigation.navigate("Home");
      //navigation.popToTop(); // Navigate back to the top of the stack
    } catch (error) {
      console.error('Failed to save post:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <>
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>New Video for Playlist</Text>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={30} color="#000" />
            </TouchableOpacity>
            {image && (image.endsWith(".mp4") || image.endsWith(".mov")) ? (
              <View style={styles.containerImg}>
                <Video
                  source={{ uri: image }}
                  style={styles.image} // Adjust the style as needed
                  useNativeControls
                  resizeMode="contain"
                />
                {/* Optional: Add a close or back button here */}
              </View>
            ) : (
              <Image source={{ uri: image }} style={styles.image} />
            )}

            <TextInput
              style={[styles.input, { height: "auto", maxHeight: 200 }]} // Adjust maxHeight as needed
              placeholder="Write a caption..."
              value={caption}
              onChangeText={setCaption}
              multiline={true}
              // Optional: If you want to control the behavior on pressing enter, you can use the below prop
              // onKeyPress={({ nativeEvent }) => {
              //   if (nativeEvent.key === 'Enter') {
              //     // Handle the enter press if needed
              //   }
              // }}
            />
            <TouchableOpacity onPress={handleSavePost} disabled={!userID}>
              <View style={styles.uploadButton}>
                <Text style={styles.uploadText}>Upload Video</Text>
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    headerTransparent: false,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  backIcon: {
    position: "absolute",
    top: 45,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    marginTop: "7",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "7%",
    marginTop: "1%",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadText: {
    color: "white",
    fontWeight: "bold",
  },
});
