// Author: Marek Kozumplik  
// Login: xkozum08
// shows 3 types of lists: members, applications and invitations
// uses GroupUserList, GroupApplicationsList and GroupInvitationsList components

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import GroupApplicationsList from '../components/GroupApplicationsList';
import GroupInvitationsList from '../components/GroupInvitationsList';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';


import Icon from 'react-native-vector-icons/FontAwesome';
import GroupUserList from '../components/GroupUserList';

type ManageMembersScreenRouteParams = {
    loggedId: number;
    groupId: number;
  };
  
  
  type ManageMembersScreenRouteProp = RouteProp<{ ManageMembers: ManageMembersScreenRouteParams }, 'ManageMembers'>;


const ManageMembersScreen = () => {
    const navigation = useNavigation<BottomTabNavigationProp<any>>(); 
    const [showUsers, setShowUsers] = useState(true);
    const [showApplications, setShowApplications] = useState(false);
    const [showInvitations, setShowInvitations] = useState(false);
    const route = useRoute<ManageMembersScreenRouteProp>();
    const loggedId = route.params.loggedId;
    const groupId = route.params.groupId;
  
    // set top bar button
    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                  <View style={styles.topBarButton}>
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
                <TouchableOpacity  onPress={() => {setShowUsers(true); setShowApplications(false); setShowInvitations(false)}} style={[styles.button, { backgroundColor: showUsers ? '#d3d3d3' : '#f9f9f9' }]}>
                    <Text style={{fontSize: 16}}>Members</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>  {setShowUsers(false); setShowApplications(true); setShowInvitations(false)}} style={[styles.button, { backgroundColor: showApplications ? '#d3d3d3' : '#f9f9f9' }]}>
                    <Text style={{fontSize: 16}}>Applications</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>  {setShowUsers(false); setShowApplications(false); setShowInvitations(true)}} style={[styles.button, { backgroundColor: showInvitations ? '#d3d3d3' : '#f9f9f9' }]}>
                    <Text style={{fontSize: 16}}>Invitations</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                {showUsers ? <GroupUserList groupId={groupId} loggedId={loggedId} /> : null}
                {showApplications ? <GroupApplicationsList groupId={groupId} loggedId={loggedId} /> : null}
                {showInvitations ? <GroupInvitationsList groupId={groupId} loggedId={loggedId} /> : null}
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
    topBarButton:  {
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

export default ManageMembersScreen;