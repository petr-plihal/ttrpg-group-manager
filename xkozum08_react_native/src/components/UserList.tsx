// Author: Marek Kozumplik  
// Login: xkozum08

// For search screen
// Displays all users based on the search query
// Similar to GroupList


import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

interface User {
  pk: number;
  username: string;
  profilepicture?: string | null;
  description?: string | null;
}


const UserList = ({ loggedId, searchQuery }: { loggedId: number, searchQuery: string }) => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/users/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const data_user: User[] = responseData.data.map((user: any) => ({
        pk: user.pk,
        username: user.fields.username,
        profilepicture: user.fields.profilepicture,
        description: user.fields.description,
      }));
      setUsers(data_user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="8C9490" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FlatList
      data={filteredUsers}
      keyExtractor={(item) => item.pk.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('User', { userId: item.pk, loggedId: loggedId })}>
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Icon name="user" size={50} color="black" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.username}>{item.username}</Text>
              {item.description && <Text style={styles.description}>{item.description}</Text>}
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '8C9490',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});

export default UserList;
