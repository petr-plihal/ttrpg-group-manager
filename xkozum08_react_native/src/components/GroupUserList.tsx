// Author: Marek Kozumplik  
// Login: xkozum08


// Shows all users in the list 
// When tapped on user, the user screen is shown
// Button to kick user on the right of each user row
// For the ManageMembersScreen


import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

interface User {
  pk: number;
  userId: number;
  nickname: string;
  isowner: boolean;
}


const GroupUserList = ({groupId, loggedId}: {groupId: number, loggedId: number})  => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>(); 
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/group/${groupId}/players/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const data_user: User[] = responseData.data.map((user: any) => ({
        pk: user.pk,
        userId: user.fields.userid,
        nickname: user.fields.nickname,
        isowner: user.fields.isowner,
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
  }, [navigation]);


    // POST request to kick user from the group
    const handleKickUser = async (userId: number) => {
      const requestData = {
          user_id: userId,
          group_id: groupId,
      };

      fetch(`http://10.0.2.2:8000/kickPlayer/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
      })
          .then(response => response.json())
          .then(data => {
              if (data.status === 'success') {
                  console.log('User kicked');
                  fetchUsers();
              }
          })
          .catch(error => {
              console.error('Error creating group:', error);
          });
  };


  if (loading) {
    return <ActivityIndicator size="large" color="8C9490" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.pk.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('User', { userId: item.userId, loggedId: loggedId })}
          onLongPress={() => console.log(`Long pressed on ${item.nickname}`)}
        >
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Icon name="user" size={50} color="black" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.username}>{item.nickname || 'Player'}</Text>
              <Text style={styles.description}>{item.isowner ? 'Owner' : 'Member'}</Text>
            </View>

            {item.userId !== loggedId && 
            <TouchableOpacity onPress={() => handleKickUser(item.userId)}>
                <Icon name="times" size={25} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
              }
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

export default GroupUserList;
