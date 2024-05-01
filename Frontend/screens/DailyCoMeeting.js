import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';  // Assuming you're using Ionicons


const DailyCoMeeting = ({ navigation, route }) => {
    const { meetingUrl } = route.params;
  
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#000" style={styles.backIcon} />
          </TouchableOpacity>
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
      // Additional styling if needed
    }
  });
  
  export default DailyCoMeeting;
  
