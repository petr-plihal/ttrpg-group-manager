// Author: Marek Kozumplik  
// Login: xkozum08


// For cancelling users group applications
// One button is displayed next to each app to cancel it
// For MyGroupsScreen



import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';


interface Application {
  pk: number;
  groupId: number;
  applicantId: number;
  description: string;
  groupName: string;
}


const MyApplicationsList = ({ loggedId }: { loggedId: number }) => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchApps = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/user/${loggedId}/applications`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const app_data: Application[] = responseData.data
        .filter((app: any) => app.fields.description === "Application")
        .map((app: any) => ({
          pk: app.pk,
          groupId: app.fields.groupid,
          applicantId: app.fields.applicantid,
          description: app.fields.description,
          username: app.fields.applicant_name,
          groupName: app.fields.group_name,
        }));
      setApps(app_data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchApps();
    }, [])
  );


  const handleCancelApp = async (groupId: number, invitedId: number) => {
    try {
      const response: Response = await fetch(`http://10.0.2.2:8000/cancelApplication/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: groupId,
          user_id: invitedId,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);

      }
      if (responseData.status !== 'success') {
        Alert.alert('Error', responseData.message);
      }

      if (responseData.status === 'success') {
        fetchApps();
      }

    } catch (error) {
      console.error('Error inviting player:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="8C9490" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }


  return (
    <FlatList
      data={apps}
      keyExtractor={(item) => item.pk.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Group', { groupId: item.groupId })}>
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Icon name="group" size={50} color="black" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.groupName}</Text>
              {item.description && <Text style={styles.description}>{item.description}</Text>}
            </View>

            <TouchableOpacity onPress={() => handleCancelApp(item.groupId, item.applicantId)}>
              <Icon name="times" size={25} color="black" style={{ marginRight: 20 }} />
            </TouchableOpacity>

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


export default MyApplicationsList;
