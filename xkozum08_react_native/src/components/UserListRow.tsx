// Author: Marek Kozumplik  
// Login: xkozum08


// Shows all users in the list in scrollable row
// When tapped on user, the user screen is shown
// For the GroupScreen


import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

interface User {
  pk: number;
  nickname: string;
  isowner: boolean;
  userId: number;
  groupId: number;
}

const UserListRow = ({ groupId, loggedId, isOwner }: { groupId: number, loggedId: number, isOwner: boolean }) => {
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
        nickname: user.fields.nickname,
        isowner: user.fields.isowner,
        userId: user.fields.userid,
        groupId: user.fields.groupid,
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

  return (
    <View style={styles.userContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Members</Text>
        {isOwner && <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Manage Members', { groupId, loggedId })}>
          <Icon name="cog" size={20} color="black" />
        </TouchableOpacity>}

      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.pk.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('User', { userId: item.userId, loggedId: loggedId })}>
            <View style={styles.item}>
              <View style={styles.imageContainer}>
                {(
                  <Icon name="user" size={30} color="black" />
                )}
              </View>
              <Text style={styles.name}>{item.nickname === "" ? "Player" : item.nickname}</Text>
              {item.isowner && (
                <View>
                  <Text>Owner</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        horizontal={true}
        contentContainerStyle={styles.scrollContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '8C9490',
    width: 150,
    height: 175,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  }
});

export default UserListRow;
