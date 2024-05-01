import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { Button, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import styles from "./styles";
//import Video from 'react-native-video';
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function Add({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flesh, setFlesh] = useState(Camera.Constants.FlashMode.off);
  const [image, setImage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const startRecording = async () => {
    if (camera) {
      setIsRecording(true);
      const video = await camera.recordAsync();
      //const source = video.uri
      console.log(video.uri);
      setImage(video.uri); // Assuming you want to use the same state for image and video URIs
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (camera) {
      camera.stopRecording();
      setIsRecording(false);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
      console.log("0p" + data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      // to add videos as well just alter this line
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.2,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const OpenCam = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [3, 4],
      quality: 0.2,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (
    hasCameraPermission === false ||
    hasCameraPermission === null ||
    hasGalleryPermission === false
  ) {
    return (
      <View style={[styles.Camcontainer, { paddingHorizontal: 30 }]}>
        <Text>
          Camera access is denied. Please Go to settings and turn on the camera
          access.
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="#000" />
      </TouchableOpacity>
      {/* new */}
      <View style={styles.Camcontainer}>
        {!image ? (
          <Camera
            flashMode={flesh}
            ref={(ref) => setCamera(ref)}
            style={styles.preview}
            type={type}
            autoFocus={Camera.Constants.AutoFocus.on}
            ratio={"4:3"}
          />
        ) : image.endsWith(".mov") || image.endsWith(".mp4") ? (
          <View style={styles.containerVid}>
            <Video
              source={{ uri: image }}
              style={{ flex: 1, aspectRatio: 3 / 4 }}
              controls={true}
              resizeMode="contain"
            />
            <IconButton
              icon="close"
              color="#fff"
              onPress={() => setImage("")}
              size={30}
              style={{
                position: "absolute",
                right: 5,
                top: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 15,
              }}
            />
          </View>
        ) : (
          <View style={styles.containerImg}>
            <Image
              source={{ uri: image }}
              style={{ flex: 1, aspectRatio: 3 / 4 }}
            />
            <IconButton
              icon="close"
              color="#fff"
              onPress={() => setImage("")}
              size={30}
              style={{
                position: "absolute",
                right: 5,
                top: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 15,
              }}
            />
          </View>
        )}
      </View>
      {/* end */}
      <View style={styles.picContainer}>
        {!isRecording && !image ? (
          <TouchableOpacity onPress={takePicture}>
            <FontAwesome
              name="circle-o"
              color={"#3a3a3a"}
              size={80}
              style={styles.button1}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("save", { image });
            }}
          >
            <AntDesign
              name="checkcircle"
              color={"#000"}
              size={65}
              style={styles.button1}
            />
          </TouchableOpacity>
        )}
        {!isRecording ? (
          <TouchableOpacity onPress={startRecording}>
            <FontAwesome name="video-camera" size={50} color="red" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={stopRecording}>
            <FontAwesome name="stop-circle" size={50} color="blue" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <IconButton size={30} icon="image" onPress={pickImage} />
        <IconButton size={30} icon="camera" onPress={OpenCam} />
        <IconButton
          size={30}
          icon={flesh ? "flash" : "flash-off"}
          onPress={() => {
            setFlesh(
              flesh === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
            );
          }}
        ></IconButton>

        <TouchableOpacity
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <MaterialIcons
            name={type ? "camera-front" : "camera-rear"}
            color={"#000"}
            size={30}
            style={styles.flipcamera}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
