// Author: Marek Kozumplik  
// Login: xkozum08

// Shows users group list
// For MyGroupsScreen


import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Group {
  pk: number;
  name: string;
  description?: string | null;
  isopen?: boolean;
  location?: string | null;
}

const MyGroupsList = ({ loggedId }: { loggedId: number }) => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchGroups = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/user/${loggedId}/groups`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const data_group: Group[] = responseData.data.map((group: any) => ({
        pk: group.pk,
        name: group.fields.name,
        description: group.fields.description,
        location: group.fields.location,
        languages: group.fields.languages,
        max_size: group.fields.max_size
      }));
      console.log('Fetched groups:', data_group);
      setGroups(data_group);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchGroups();
    }, [])
  );




  if (loading) {
    return <ActivityIndicator size="large" color="8C9490" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }


  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.pk.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Group', { groupId: item.pk, loggedId: loggedId })}>
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Icon name="group" size={50} color="black" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
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
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});


export default MyGroupsList;
