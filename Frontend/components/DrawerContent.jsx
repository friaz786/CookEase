import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Title, Drawer, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

export default function DrawerContent(props) {
    const [userProfile, setUserProfile] = useState({ name: 'Loading...', photoURL: '', initials: '' });

    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    const initials = userData.name ? userData.name.match(/\b\w/g).join('') : '';
                    setUserProfile({
                        ...userProfile,
                        name: userData.name,
                        photoURL: userData.profilePhoto, // Changed to use the correct field
                        initials: initials,
                    });
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchUserProfile();
    }, [user]);

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            props.navigation.navigate('login');
        }).catch((error) => {
            // An error happened.
            console.error("Logout error: ", error);
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Avatar.Image
                                size={50}
                                source={{ uri: userProfile.photoURL || undefined }}
                                style={{ backgroundColor: userProfile.photoURL ? 'transparent' : '#00BE00' }}
                            />
                            { !userProfile.photoURL && <Text style={styles.initialsText}>{userProfile.initials}</Text> }
                            <View style={{ marginLeft: 15, flexDirection: 'column', marginTop: 6 }}>
                                <Title style={styles.title}>{userProfile.name}</Title>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                    <DrawerItemList {...props} />

                    </Drawer.Section>
                </View>
                </DrawerContentScrollView>
            <Drawer.Section>
                <DrawerItem
                    icon={() => <MaterialIcons name="logout" size={24} color="red" />}
                    label="Logout"
                    labelStyle={{ color: "red", fontWeight: "600", fontSize: 16 }}
                    onPress={handleLogout}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  initialsContainer: {
    position: "absolute",
    backgroundColor: "#00BE00", // Change the background color of the initials
    borderRadius: 50,
    padding: 5,
    width: 50,
    height: 50,
  },
  initialsText: {
    position: "absolute",
    left: "20%",
    bottom: "28%",
    color: "white", // Change the text color of the initials
    fontWeight: "bold",
    fontSize: 19,
  },
  title: {
    fontSize: 18,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 40,
    borderTopColor: "#f4f4f4",
    borderBottomColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerContent: {
    flex: 1,
},
userInfoSection: {
    paddingLeft: 20,
},
initialsText: {
    position: "absolute",
    left: 17,
    top: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
},
title: {
    fontSize: 18,
    marginTop: 3,
    fontWeight: "bold",
},
drawerSection: {
    marginTop: 15,
},
bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
},
});