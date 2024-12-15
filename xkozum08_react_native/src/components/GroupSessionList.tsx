// Author: Marek Kozumplik  
// Login: xkozum08


// Shows group sessions
// When clicked on session, it will pop up a dialog with the option to delete the session (if user is group owner)
// If the user is the owner of the group, he can add a new session


import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Session {
  pk: number;
  num: number;
  description?: string | null;
  start_time: string;
  duration: number;
}


const GroupSessionList = ({ groupId, isOwner }: { groupId: number, isOwner: boolean }) => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchSessions = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/getGroupSessions/${groupId}/`);
      const data = await response.json();
      const data_sessions: Session[] = data.data.map((session: any) => ({
        pk: session.pk,
        num: session.fields.num,
        description: session.fields.description,
        start_time: session.fields.starttime,
        duration: session.fields.duration,
      }));
      setSessions(data_sessions);
    } catch (err) {
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      fetchSessions();
    }, [])
  );


  // Alert dialog to confirm session deletion
  const handleRemoveSession = (sessNum: number) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => removeSession(sessNum) },
      ],
      { cancelable: false }
    );
  }

  // send DELETE request to delete session
  const removeSession = (sessNum: number) => {
    const scheduleData = {
      num: sessNum,
      group_id: groupId,
    };
    fetch('http://10.0.2.2:8000/deleteSession/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          console.log('Tag deleted successfully:', data);
          fetchSessions();
        }
      })
      .catch(error => {
        console.error('Error creating tag:', error);
      });
  };


  if (loading) {
    return <ActivityIndicator size="large" color="8C9490" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.sessionsContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Sessions</Text>
        {isOwner &&
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create Session', { groupId })}>
            <Icon name="plus" size={20} color="black" />
          </TouchableOpacity>
        }
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.pk.toString()}
        renderItem={({ item }) => (
          isOwner ? (
            <TouchableOpacity onPress={() => handleRemoveSession(item.num)}>
              <View style={styles.item}>
              <Text style={styles.header}>{item.description ? item.description : `Session`}</Text>
                <Text>{new Date(item.start_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                <Text>{item.duration / 60} hours</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.item}>
              <Text style={styles.header}>{item.description ? item.description : `Session`}</Text>
              <Text>{new Date(item.start_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
              {(item.duration > 120) &&  <Text style={styles.text}>{(item.duration / 60).toFixed(2)} hours</Text>}
              {(item.duration <= 120) && <Text style={styles.text}>{item.duration} minutes</Text>}
            </View>
          )
        )}
        horizontal={true}
        contentContainerStyle={styles.scrollContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  sessionsContainer: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 20,
  },
  item: {
    padding: 10,
    width: 140,
    //height: 130,
  },
  scrollContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  },
  text: {
    padding: 5,
    
    fontSize: 16,
  },

});

export default GroupSessionList;