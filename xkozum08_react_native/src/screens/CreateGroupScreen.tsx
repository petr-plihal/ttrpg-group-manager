// Author: Marek Kozumplik  
// Login: xkozum08
// Create group screen

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';


type CreateGroupScreenRouteParams = {
    loggedId: number;
};

type CreateGroupScreenRouteProp = RouteProp<{ GroupScreen: CreateGroupScreenRouteParams }, 'GroupScreen'>;


const CreateGroupScreen = () => {
    const navigation = useNavigation<BottomTabNavigationProp<any>>(); 
    const route = useRoute<CreateGroupScreenRouteProp>();
    const loggedId = route.params.loggedId;
    const [name, setGroupName] = useState('');
    const [location, setLocation] = useState('');
    const [maxsize, setMaxGroupSize] = useState(1);
    const [description, setGroupDescription] = useState('');
    const [groupId, setGroupId] = useState(null);
    const [ownerSet, setOwnerSet] = useState(false);


    // send POST request to create a group
    const handleCreateGroup = () => {
        const groupData = {
            name,
            location,
            maxsize,
            description,
            languages: 'English',
            isopen: true,
            groupchatcontent: "",
            gameid: 1,
            dmneeded: false,
        };
        console.log('Creating group:', groupData);

        fetch('http://10.0.2.2:8000/group/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                console.log('Group created successfully:', data);
                console.log('Group ID:', data['groupid']);
                setGroupId(data['groupid']);                
                }
            })
            .catch(error => {
                console.error('Error creating group:', error);
            });
        
    };


    // set the group owner after the group is created, i think this should be automatic in be but it is not
    const setGroupOwner = () => {
        const userData = {
            user_id: loggedId,
        };
        console.log('Setting group owner:', groupId, userData);

        fetch(`http://10.0.2.2:8000/group/${groupId}/setOwner/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Group owmer set successfully:', data);
                    setOwnerSet(true);
                    navigation.navigate('Group', { loggedId, groupId });
                }
            })
            .catch(error => {
                console.error('Error setting owner:', error);
            });
    };
    useEffect(() => {
        if (groupId) {
            setGroupOwner();
        }
    }
    , [groupId]);  // when group is created, the groupId is returned and the owner is set



    return (
        <View style={styles.container}>
            <Text style={styles.header}>Name of the Group</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setGroupName}
            />

            <Text style={styles.header}>Description</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setGroupDescription}
            />
            
            <Text style={styles.header}>Location</Text>
            <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
            />

            <Text style={styles.header}>Max Group Size: {maxsize}</Text>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                step={1}
                value={maxsize}
                onValueChange={setMaxGroupSize}
            />

            <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>Create Group</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
        fontWeight: 'bold'
    },
    input: {
        height: 40,
        borderColor: '#666',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    slider: {
        marginBottom: 16,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#aaa',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
    }
});

export default CreateGroupScreen;