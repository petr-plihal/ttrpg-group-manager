// Author: Marek Kozumplik  
// Login: xkozum08

// uses UserList and GroupList components
// sends search query to the components so they can filter the results

import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';

import UserList from '../components/UserList';
import GroupList from '../components/GroupList';
import { RouteProp, useRoute } from '@react-navigation/native';



type SearchScreenRouteParams = {
    loggedId: number;
};

type SearchScreenRouteProp = RouteProp<{ UserScreen: SearchScreenRouteParams }, 'UserScreen'>;



const SearchScreen = () => {
    const [showUserList, setShowUserList] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const route = useRoute<SearchScreenRouteProp>();
    const loggedId = route.params.loggedId;

    return (
        <View style={styles.container}>
            <TextInput 
                onChangeText={setSearchQuery} 
                value={searchQuery} 
                placeholder="Search..." 
                style={styles.input} 
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: showUserList ? '#d3d3d3' : '#f9f9f9' }
                    ]}
                    onPress={() => setShowUserList(true)}
                >
                    <Text style={{ fontSize: 16 }}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: !showUserList ? '#d3d3d3' : '#f9f9f9' }
                    ]}
                    onPress={() => setShowUserList(false)}
                >
                    <Text style={{ fontSize: 16 }}>Groups</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                {showUserList ? <UserList loggedId={loggedId} searchQuery={searchQuery}  /> : <GroupList loggedId={loggedId} searchQuery={searchQuery} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        width: '80%',
    },
    buttonContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '75%',
    },
    button: {
        width: '45%',
        height: 40,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 20,
        paddingHorizontal: 8,
        width: '85%',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
});


export default SearchScreen;