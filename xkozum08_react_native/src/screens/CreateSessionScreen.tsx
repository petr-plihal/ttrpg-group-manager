// Author: Marek Kozumplik  
// Login: xkozum08

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker'; this is bugged in the current version of react-native
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type CreateSessionScreenRouteParams = {
    loggedId: number;
    groupId: number;
};

type CreateGroupScreenRouteProp = RouteProp<{ GroupScreen: CreateSessionScreenRouteParams }, 'GroupScreen'>;


const CreateSessionScreen = () => {
    const navigation = useNavigation<BottomTabNavigationProp<any>>(); 
    const route = useRoute<CreateGroupScreenRouteProp>();
    const loggedId = route.params.loggedId;
    const groupId = route.params.groupId;
    const [showDatePicker, setShowDatePicker] = useState(false);

    // form values
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [duration, setDuration] = useState(1);


    // date picker 
    const handleConfirm = (date: Date) => {
        setStartTime(date);
        setShowDatePicker(false);
    };

    const hideDatePicker = () => {
        setShowDatePicker(false);
    }


    const createSession = () => {
        const sessionData = {
            group_id: groupId,
            description: description,
            starttime: startTime,
            duration: duration*60, // minutes
        };
        fetch(`http://10.0.2.2:8000/createSession/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Session created successfully:', data);
                    navigation.goBack();
                }
            })
            .catch(error => {
                console.error('Error setting owner:', error);
            });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Description</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
            />

            <Text style={styles.header}>Start Time</Text>
            <TouchableOpacity style={styles.datePickButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.date}>{startTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={showDatePicker}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <Text style={styles.header}>Duration: {duration} hours</Text>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={24}
                step={1}
                value={duration}
                onValueChange={setDuration}
            />

            <TouchableOpacity style={styles.button} onPress={createSession}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>Create Session</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#aaa',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
    },
    datePickButton: {
        backgroundColor: '#aaa',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    date: {
        fontSize: 18,
    }
});

export default CreateSessionScreen;