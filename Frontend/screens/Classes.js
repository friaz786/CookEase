import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

const Classes = ({navigation, route}) => {
  const [classes, setClasses] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser.uid;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const fetchClasses = async () => {
      const userDocRef = doc(db, "users", currentUser);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const { following, subscribedTo } = userDocSnap.data();
        const uniqueUserIds = [...new Set([...(following || []), ...(subscribedTo || [])])];

        let tempClasses = [];
        for (const userId of uniqueUserIds) {
          if (userId === currentUser) continue; // Skip the current user's meetings

          const meetingsColRef = collection(db, "meeting", userId, "meetings");
          const querySnapshot = await getDocs(meetingsColRef);

          querySnapshot.forEach(doc => {
            const classData = doc.data();
            const isPayee = classData.payee?.includes(currentUser);
            tempClasses.push({
              ...classData,
              id: doc.id,
              hostId: userId,
              canAccessLink: subscribedTo?.includes(userId) || isPayee,
              canPay: following?.includes(userId) && !subscribedTo?.includes(userId) && !isPayee,
              status: classData.status 
            });
          });
        }

        setClasses(tempClasses.sort((a, b) => (a.meetingDate.seconds > b.meetingDate.seconds) ? 1 : -1));
      }
    };

    fetchClasses();
}, [classes]);



  const handlePayment = async (classItem) => {
    try {
        const amount = 151; // Set the amount for payment
        // Replace the URL with your actual backend endpoint
        const paymentResponse = await axios.post(`http://192.168.1.65:8080/payments/intents`, { amount: amount * 100 });
  
        if (paymentResponse.status === 400) {
          Alert.alert("Payment Error", "Something went wrong with your payment");
          return;
        }
  
        const { paymentIntent } = paymentResponse.data;
        const initResponse = await initPaymentSheet({
          merchantDisplayName: "CookEase",
          paymentIntentClientSecret: paymentResponse.data.paymentIntent,
        });
  
        if (initResponse.error) {
          Alert.alert("Initialization Error", initResponse.error.message);
          return;
        }
  
        const paymentSheetResponse = await presentPaymentSheet();
        if (paymentSheetResponse.error) {
          Alert.alert("Payment Sheet Error", paymentSheetResponse.error.message);
          return;
        }
  
        // Update Firestore to include the current user in the payee array for the class
        const meetingDocRef = doc(db, "meeting", classItem.hostId, "meetings", classItem.id);
        await updateDoc(meetingDocRef, {
          payee: arrayUnion(currentUser),
        });
  
        // Update local state to reflect payment success
        setClasses(prevClasses => prevClasses.map(item => item.id === classItem.id ? { ...item, canAccessLink: true } : item));
  
        Alert.alert("Payment Successful", "You can now access the class link.");
  
      } catch (error) {
        console.error("Payment Error: ", error);
        Alert.alert("Error", "There was a problem processing your payment.");
      }
    };

    const handleMeetingLinkPress = (item) => {
      // Check if the meeting has started
      if (item.status === "not_started") {
        Alert.alert("Meeting Not Started", "This meeting has not started yet.");
      } else {
        // Proceed to join the meeting if it has started
        navigation.navigate('DailyCoMeeting', { meetingUrl: item.meetingLink });
      }
    };
    

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.meetingName} - {new Date(item.meetingDate.seconds * 1000).toLocaleDateString()} - {item.meetingTime}</Text>
      {item.canAccessLink ? (
        <TouchableOpacity onPress={() => handleMeetingLinkPress(item)}>
        <Text style={styles.link}>Join Meeting</Text>
        </TouchableOpacity>
      ) : item.canPay ? (
        <TouchableOpacity onPress={() => handlePayment(item)}>
          <Text style={styles.pay}>Pay to access link</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.noAccess}>Subscribe to access link</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
  },
  link: {
    color: 'blue',
    marginTop: 5,
  },
  pay: {
    color: 'green',
    marginTop: 5,
  },
  noAccess: {
    color: 'red',
    marginTop: 5,
  },
});

export default Classes;
