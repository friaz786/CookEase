import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';
import { db } from '../firebase'; // Import your Firebase config
import { collection, getDocs } from 'firebase/firestore';

const Fetch = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const fetchedPosts = [];
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        fetchedPosts.push({
          id: doc.id,
          ...postData,
        });
      });
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.caption}>{item.caption}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No posts found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  postContainer: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  caption: {
    marginTop: 5,
  },
});

export default Fetch;
