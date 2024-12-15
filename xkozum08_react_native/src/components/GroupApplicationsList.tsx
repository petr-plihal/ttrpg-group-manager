// Author: Marek Kozumplik  
// Login: xkozum08

// For accepting and rejecting applications in a group
// Two buttons are displayed next to each application
// for ManageMembersScreen

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
  username: string;
}


const GroupApplicationsList = ({ groupId, loggedId }: { groupId: number, loggedId: number }) => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchApps = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/group/${groupId}/applications`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log('Response:', responseData);
      const app_data: Application[] = responseData.data
        .filter((group: any) => group.fields.description === "Application")
        .map((group: any) => ({
          pk: group.pk,
          groupId: group.fields.groupid,
          applicantId: group.fields.applicantid,
          description: group.fields.description,
          username: group.fields.applicant_name,
        }));
      console.log('Fetched groups:', app_data);
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


  // send POST accept application
  const handleAcceptApp = async (appId: number) => {
    try {
      const response: Response = await fetch(`http://10.0.2.2:8000/acceptApplication/${appId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);

      }
      if (responseData.status !== 'success') {
        Alert.alert('Error', 'responseData.message');
      }

      if (responseData.status === 'success') {
        Alert.alert('Success', 'User accepted');
        fetchApps();
      }

    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };


  // send POST reject application
  const handleRejectApp = async (appId: number) => {
    try {
      console.log('Rejecting application:', appId);
      const response: Response = await fetch(`http://10.0.2.2:8000/denyApplication/${appId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      console.error('Error rejecting invite:', error);
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
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('User', { userId: item.applicantId, loggedId: loggedId })}
        >
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Icon name="user" size={50} color="black" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.username}>{item.username || 'Player'}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => handleAcceptApp(item.pk)}>
                <Icon name="check" size={25} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRejectApp(item.pk)}>
                <Icon name="times" size={25} color="black" />
              </TouchableOpacity>
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
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
});


export default GroupApplicationsList;
