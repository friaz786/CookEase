import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';  // Assuming you're using Ionicons
import { Ionicons } from "@expo/vector-icons";


const DailyCoMeeting = ({ navigation, route }) => {
    const { meetingUrl } = route.params;
  
    return (
      <View style={{ flex: 1 }}>
     <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "flex-end" }}></View>
      </View>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: meetingUrl }}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    header: {
      paddingTop: 10,
      paddingHorizontal: 10,
      backgroundColor: 'white', // Set a background color for the header
      zIndex: 10 // Ensure the header is above the WebView
    },
    backIcon: {
      padding: 10,
      marginTop: 20,
      marginLeft: 1,
    },
    customHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
      backgroundColor: "#4CAF50",
    },
  });
  
  export default DailyCoMeeting;
  
