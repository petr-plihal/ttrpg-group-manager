// Author: Marek Kozumplik  
// Login: xkozum08
// Calendar screen, displays all sessions of the user

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

interface Session {
  pk: number;
  num: number;
  startTime: Date;
  duration: number;
  groupId: number;
  description?: string | null;
}


type CalendarScreenRouteParams = {
  loggedId: number;
};



interface Group {
  pk: number;
  name: string;
};

type CalendarScreenRouteProp = RouteProp<{ CalendarScreen: CalendarScreenRouteParams }, 'CalendarScreen'>;

const CalendarScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<CalendarScreenRouteProp>();
  const loggedId = route.params.loggedId;
  const [groups, setGroups] = useState<Group[]>([]);


  // Fetches all sessions of the user with id == loggedId
  const fetchSessions = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/user/${loggedId}/sessions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const data_sessions: Session[] = responseData.data.map((session: any) => ({
        pk: session.pk,
        num: session.fields.num,
        startTime: new Date(session.fields.starttime),
        duration: session.fields.duration,
        groupId: session.fields.groupid,
        description: session.fields.description,
      }));
      setSessions(data_sessions);
      for (let i = 0; i < data_sessions.length; i++) {
        fetchGroup(data_sessions[i].groupId);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [navigation]); // fetched when navigated to the screen


  const fetchGroup = async (groupId: number) => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/group/${groupId}/id/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const responseGroup = responseData.data[0];
      const data_group: Group = {
        pk: responseGroup.pk,
        name: responseGroup.fields.name,
      };
      setGroups((prevGroups) => [...prevGroups, data_group]); // add group to the list of groups
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.pk.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.sessionEntry} onPress={() => navigation.navigate('Group', { groupId: item.groupId })}>
            <Text style={styles.header}>{groups.find(group => group.pk === item.groupId)?.name || 'Unknown Group'}: {item.description ? item.description : `Session`}</Text>
            <Text>{new Date(item.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </Text>
            {(item.duration > 120) && <Text style={styles.text}>{(item.duration / 60).toFixed(2)} hours</Text>}
            {(item.duration <= 120) && <Text style={styles.text}>{item.duration} minutes</Text>}

          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sessionEntry: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '8C9490',
  },
  text: {
    fontSize: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;

