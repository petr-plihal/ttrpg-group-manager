// Author: Marek Kozumplik  
// Login: xkozum08


// Shows the schedule in a week format
// When clicked on day, the schedule is switched to free or busy
// Needs to be the logged user to be able to switch the schedule

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';


interface Schedule {
  pk: number;
  day: string;
  starttime: Date
  endtime: Date
  userId: number;
}

interface Day {
  pk: number;
  name: string;
  isFree: boolean;
  dbName: string;
}

const UserSchedule = ({ isLoggedUser, userId }: { isLoggedUser: boolean, userId: number }) => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<Schedule[]>([]);


  const fetchSchedule = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/user/${userId}/schedule/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const data_user: Schedule[] = responseData.data.map((user: any) => ({
        pk: user.pk,
        day: user.fields.day,
        starttime: user.fields.starttime,
        endtime: user.fields.endtime,
        userId: user.fields.userid
      }));
      setSchedule(data_user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSchedule();
  }
    , []);




  const handleScheduleSwitch = (day: string, isFree: boolean) => {
    if (isLoggedUser) {
      if (isFree) {
        removeSchedule(userId, day);
      }
      else {
        addSchedule(userId, day);
      }
    }
  }

  const addSchedule = (userId: number, dayDbName: string) => {
    const scheduleData = {
      user_id: userId,
      day: dayDbName,
      start: '00:00:00', // default value, i dont use it in my fe, group members do
      end: '00:00:00', // default value, i dont use it in my fe, group members do
    };
    fetch('http://10.0.2.2:8000/createSchedule/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          console.log('Tag deleted successfully:', data);
          fetchSchedule();
        }
      })
      .catch(error => {
        console.error('Error creating tag:', error);
      });
  };

  const removeSchedule = (userId: number, dayDbName: string) => {
    const scheduleData = {
      user_id: userId,
      day: dayDbName,
    };
    fetch('http://10.0.2.2:8000/deleteSchedule/', {
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
          fetchSchedule();
        }
      })
      .catch(error => {
        console.error('Error creating tag:', error);
      });
  };




  // set free if the schedule is in the db
  // then in return View, set the background color to green if isFree is true
  const [days, setDays] = useState<Day[]>([]);
  useEffect(() => {
    const updatedDays = [
      { pk: 1, name: 'Mon', isFree: schedule.some(s => s.day === 'mo'), dbName: 'mo' },
      { pk: 2, name: 'Tue', isFree: schedule.some(s => s.day === 'tu'), dbName: 'tu' },
      { pk: 3, name: 'Wed', isFree: schedule.some(s => s.day === 'we'), dbName: 'we' },
      { pk: 4, name: 'Thu', isFree: schedule.some(s => s.day === 'th'), dbName: 'th' },
      { pk: 5, name: 'Fri', isFree: schedule.some(s => s.day === 'fr'), dbName: 'fr' },
      { pk: 6, name: 'Sat', isFree: schedule.some(s => s.day === 'sa'), dbName: 'sa' },
      { pk: 7, name: 'Sun', isFree: schedule.some(s => s.day === 'su'), dbName: 'su' }
    ];
    setDays(updatedDays);
  }, [schedule]);

  if (loading) {
    return <ActivityIndicator size="large" color="8C9490" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }



  return (
    <View style={styles.dayContainer}>
      <Text style={styles.header}>Schedule</Text>
      <FlatList
        data={days}
        keyExtractor={(item) => item.pk.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.dayItem, { backgroundColor: item.isFree ? '#90ee90' : '#e0e0e0' }]} onPress={() => handleScheduleSwitch(item.dbName, item.isFree)}>
            <Text style={styles.dayName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        horizontal={true}
        contentContainerStyle={styles.scrollContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    marginTop: 20,
    flexDirection: 'column',
    flexWrap: 'wrap',
    flex: 1,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayItem: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 5,
    margin: 5,
    width: 42,
    height: 35,
    justifyContent: 'center',
  },
  dayName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default UserSchedule;
