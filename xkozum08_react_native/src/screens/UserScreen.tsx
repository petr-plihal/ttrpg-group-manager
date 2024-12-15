// Author: Marek Kozumplik  
// Login: xkozum08

// shows user profile with description, tags and schedule
// if shown user is the logged user, it allows to edit the description, tags and schedule
// also allows to share the profile on top bar


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { FlatList } from 'react-native-gesture-handler';
import GroupListRow from '../components/GroupListRow';
import TagList from '../components/TagListUser';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-dialog';
import UserSchedule from '../components/UserSchedule';

interface User {
    pk: number;
    username: string;
    profilepicture: string;
    description: string;
}

interface Group {
    pk: number;
    name: string;
    description?: string | null;
  }

interface Tag {
    pk: number;
    name: string;
}

type UserScreenRouteParams = {
    userId: number;
    loggedId: number;
};

type UserScreenRouteProp = RouteProp<{ UserScreen: UserScreenRouteParams }, 'UserScreen'>;

const UserScreen = () => {
    const route = useRoute<UserScreenRouteProp>();
    const userId = route.params.userId;
    const loggedId = route.params.loggedId;
    const navigation = useNavigation<BottomTabNavigationProp<any>>(); 
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoggedUser, setIsLoggedUser] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');

    const handleCancel = () => {
        setVisible(false);
    };

    const handleEditDescription = () => {
        setVisible(true);
    };

    const handleDescriptionOK = async () => {
        setVisible(false);
        fetch(`http://10.0.2.2:8000/user/${userId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: description }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('User updated successfully:', data);
                    fetchUser();
                }
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
    };

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:8000/user/${userId}/id`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            if (!responseData.data || responseData.data.length === 0) {
                console.log(userId);
                throw new Error('No user data found');
            }
            const responseUser = responseData.data[0];
            if (!responseUser || !responseUser.fields) {
                throw new Error('Invalid user data format');
            }
            const data_user: User = {
                pk: responseUser.pk,
                username: responseUser.fields.username,
                profilepicture: responseUser.fields.profilepicture,
                description: responseUser.fields.description,
            };
            setUser(data_user);
            setIsLoggedUser(userId === loggedId); 
            setDescription(data_user.description);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUser();
    }, [userId]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    {!isLoggedUser && 
                        <TouchableOpacity onPress={() => navigation.navigate('Invite Player', { invitedId: userId, loggedId: loggedId })}>
                            <View style={styles.createGroupImageContainer}>
                                <Icon name="user-plus" size={30} color="black" />
                            </View>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={async () => await Share.share({ message: `http://10.0.2.2:8000/user/${userId}/id` })}>
                        <View style={styles.createGroupImageContainer}>
                            <Icon name="share" size={30} color="black" /> 
                        </View>
                    </TouchableOpacity>
                </View>
            )
        });
    }, [isLoggedUser, navigation, userId, loggedId]); // Add dependencies to ensure the effect runs when these values change




    if (loading) {
        return <ActivityIndicator size="large" color="8C9490" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    if (!user) {
        return <Text>No user data</Text>;
    }

    return (
        <View style={styles.container}>
            <Icon name="user" size={100} color="black" style={styles.profileImage} />
            <Text style={styles.userName}>{user.username}</Text>

            <View style={{ alignItems: 'flex-start', width: '100%', backgroundColor:'#e0e0e0', borderRadius: 10, marginTop: 15 }}>
                {isLoggedUser && (
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }} onPress={() => handleEditDescription()}>
                            <View style={{width: 40}}><Icon name="info-circle" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                            <Text style={styles.userDescription}>{user.description}</Text>
                        </TouchableOpacity>)}
                {!isLoggedUser && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, justifyContent: 'center' }}>
                            <View style={{width: 40}}><Icon name="info-circle" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                            <Text style={styles.userDescription}>{user.description}</Text>
                        </View>)}
            </View>

            
            <TagList isLoggedUser={isLoggedUser} userId={userId} />

            <UserSchedule userId={userId} isLoggedUser={isLoggedUser} />
            
            <GroupListRow userId={userId} loggedId={loggedId}  />


            <Dialog.Container visible={visible}>
                <Dialog.Title>Edit Description</Dialog.Title>
                <Dialog.Input
                    placeholder="Enter new description"
                    value={description}
                    onChangeText={setDescription}
                />
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="OK" onPress={handleDescriptionOK} />
            </Dialog.Container> 


        </View>



    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'baseline',
        padding: 20,
    },
    profileImage: {
        borderRadius: 50,
        marginBottom: 20,
        alignSelf: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    userDescription: {
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
    },
    createGroupImage: {  
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginRight: 10,
        alignSelf: 'center',
    },
    createGroupImageContainer:  {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        alignSelf: 'center',
    },

});

export default UserScreen;
