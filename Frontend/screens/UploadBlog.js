import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView
} from "react-native";
import { db } from "../firebase"; // Assuming you've set up firebase correctly
import { doc, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const UploadBlog = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const saveBlog = async () => {
    if (!title || !text) {
      // You can show an alert or a Toast for better user experience
      console.log("Title and text are required");
      return;
    }

    try {
      await addDoc(collection(db, "blogs"), {
        title: title,
        text: text,
        userId: user.uid,
        createdAt: new Date(),
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>
      {/* Header */}
      <Text style={styles.header}>Write a New Blog!</Text>
      <TextInput
        style={styles.input}
        placeholder="Blog Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
      style={styles.inputblog}
        placeholder="Enter blog text here..."
        value={text}
        onChangeText={setText}
        multiline={true}
      />
      <TouchableOpacity style={styles.button} onPress={saveBlog}>
        <Text style={styles.buttonText}>Upload Blog</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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
    color: "#333",
    marginBottom: 30,
    marginTop: "10%",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: "center",
  },
  inputblog: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    //backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "40%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "7%",
    marginTop: "7%",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
  },
  textInput: {
    height: 150,
    textAlignVertical: "top", // This makes the text input multi-line
  },
});

export default UploadBlog;
