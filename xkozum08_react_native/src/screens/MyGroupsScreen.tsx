// Author: Marek Kozumplik  
// Login: xkozum08

// MyGroups screen, displays all groups of the user
// also displays applications and invitations
// uses MyGroupsList, MyApplicationsList and MyInvitationsList components
// when clicked on the plus icon, it navigates to the CreateGroupScreen
// When clicked on buttons, it shows the specific list


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';

import MyGroupsList from '../components/MyGroupsList';
import MyApplicationsList from '../components/MyApplicationsList';
import MyInvitationsList from '../components/MyInvitationsList';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';


import Icon from 'react-native-vector-icons/FontAwesome';

type CalendarScreenRouteParams = {
    loggedId: number;
};


type CalendarScreenRouteProp = RouteProp<{ CalendarScreen: CalendarScreenRouteParams }, 'CalendarScreen'>;


const MyGroupsScreen = () => {
    const navigation = useNavigation<BottomTabNavigationProp<any>>();
    const [showGroups, setShowGroups] = useState(true);
    const [showApplications, setShowApplications] = useState(false);
    const [showInvitations, setShowInvitations] = useState(false);
    const route = useRoute<CalendarScreenRouteProp>();
    const loggedId = route.params.loggedId;


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Create Group', { loggedId })}>
                    <View style={styles.createGroupImageContainer}>
                        {(
                            <Icon name="plus" size={30} color="black" />
                        )}
                    </View>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => { setShowGroups(true); setShowApplications(false); setShowInvitations(false) }} style={[styles.button, { backgroundColor: showGroups ? '#d3d3d3' : '#f9f9f9' }]}>
                    <Text style={{ fontSize: 16 }}>Groups</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowGroups(false); setShowApplications(true); setShowInvitations(false) }} style={[styles.button, { backgroundColor: showApplications ? '#d3d3d3' : '#f9f9f9' }]}>
                    <Text style={{ fontSize: 16 }}>Applications</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowGroups(false); setShowApplications(false); setShowInvitations(true) }} style={[styles.button, { backgroundColor: showInvitations ? '#d3d3d3' : '#f9f9f9' }]}>
                    <Text style={{ fontSize: 16 }}>Invitations</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                {showGroups ? <MyGroupsList loggedId={loggedId} /> : null}
                {showApplications ? <MyApplicationsList loggedId={loggedId} /> : null}
                {showInvitations ? <MyInvitationsList loggedId={loggedId} /> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 39,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createGroupImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginRight: 10,
    },
    createGroupImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    listContainer: {
        flex: 1,
        width: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '90%',
    },
    button: {
        width: '30%',
        height: 40,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
    },
});

export default MyGroupsScreen;