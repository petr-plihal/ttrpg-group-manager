// Author: Marek Kozumplik  
// Login: xkozum08
// Group screen that handles dispalying group data 
// and editting group data if isLogged is owner
// also allows to share the group on top bar

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Share} from 'react-native';
import UserListRow from '../components/UserListRow';
import TagList from '../components/TagListGroup';
import GroupSessionList from '../components/GroupSessionList';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-dialog';

interface Group {
    pk: number;
    name: string;
    description: string;
    location: string;
    languages: string;
    maxsize: number;
}

interface Tag {
    pk: number;
    name: string;
}

interface User {
    pk: number;
    nickname: string;
    isowner: boolean;
    groupId: number;
    userId: number;
}

type GroupScreenRouteParams = {
    groupId: number;
    loggedId: number;
};

type GroupScreenRouteProp = RouteProp<{ GroupScreen: GroupScreenRouteParams }, 'GroupScreen'>;

const GroupScreen = () => {
    const route = useRoute<GroupScreenRouteProp>();
    const groupId = route.params.groupId;
    const loggedId = route.params.loggedId;
    const navigation = useNavigation<BottomTabNavigationProp<any>>();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Group data
    const [group, setGroup] = useState<Group | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isMember, setIsMember] = useState<boolean>(false);
    

    // changing values dialogs
    const [descriptionVisible, setDescriptionVisible] = useState(false);
    const [groupNameVisible, setGroupNameVisible] = useState(false);
    const [locationVisible, setLocationVisible] = useState(false);
    const [languagesVisible, setLanguagesVisible] = useState(false);

    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [languages, setLanguages] = useState('');

    // changing group name
    const [newGroupName, setNewGroupName] = useState('');

    // if applied to group
    const [applied, setApplied] = useState(false);

    const fetchGroup = async () => {
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
                description: responseGroup.fields.description,
                location: responseGroup.fields.location,
                languages: responseGroup.fields.languages,
                maxsize: responseGroup.fields.maxsize,
            };
            setGroup(data_group);
            setDescription(data_group.description);
            setNewGroupName(data_group.name);
            setLocation(data_group.location);
            setLanguages(data_group.languages);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchGroup();
        }, [groupId])
    );



    // EDIT DIALOGS HANDLERS
    const handleEditDescription = () => {
        setDescriptionVisible(true);
    };

    const handleCancel = () => {
        setDescriptionVisible(false);
        setLocationVisible(false);
        setLanguagesVisible(false);
        setGroupNameVisible(false);
    };

    const handleDescriptionOK = async () => {
        setDescriptionVisible(false);
        fetch(`http://10.0.2.2:8000/group/${groupId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: description }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Group updated successfully:', data);
                    fetchGroup();
                }
            })
            .catch(error => {
                console.error('Error updating group:', error);
            });
    };

    const handleLocationOK = async () => {
        setLocationVisible(false);
        fetch(`http://10.0.2.2:8000/group/${groupId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: location }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Location updated successfully:', data);
                    fetchGroup();
                }
            })
            .catch(error => {
                console.error('Error updating location:', error);
            });
    };

    const handleLanguagesOK = async () => {
        setLanguagesVisible(false);
        fetch(`http://10.0.2.2:8000/group/${groupId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ languages: languages }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Languages updated successfully:', data);
                    fetchGroup();
                }
            })
            .catch(error => {
                console.error('Error updating languages:', error);
            });
    };

    const handleGroupNameOK = async () => {
        setGroupNameVisible(false);
        fetch(`http://10.0.2.2:8000/group/${groupId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newGroupName }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Group name updated successfully:', data);
                    fetchGroup();
                }
            })
            .catch(error => {
                console.error('Error updating group name:', error);
            });
    };


    // fetch users of group on navigation enter
    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:8000/group/${groupId}/players/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            const data_user: User[] = responseData.data.map((user: any) => ({
                pk: user.pk,
                nickname: user.fields.nickname,
                isowner: user.fields.isowner,
                userId: user.fields.userid,
                groupId: user.fields.groupid,
            }));
            setUsers(data_user);
            setIsOwner(data_user.some(user => user.isowner && user.userId === loggedId));
            setIsMember(data_user.some(user => user.userId === loggedId));

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [navigation]);


    // send application to group
    const applyToGroup = async () => {
        const requestData = {
            user_id: loggedId,
            group_id: groupId,
            description: 'Application'
        };

        fetch(`http://10.0.2.2:8000/applyToGroup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Applied to group successfully:', data);
                    setApplied(true);
                }
            })
            .catch(error => {
                console.error('Error applying group:', error);
            });
    };

    // leave group
    const leaveGroup = async () => {
        const requestData = {
            user_id: loggedId,
            group_id: groupId,
        };

        fetch(`http://10.0.2.2:8000/kickPlayer/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Left the Group successfuly:', data);
                    navigation.navigate('My Groups');
                }
            })
            .catch(error => {
                console.error('Error creating group:', error);
            });
    };


    // Top bar butotons set 
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    {!isMember && !applied && (
                        <TouchableOpacity onPress={() => applyToGroup()}>
                            <View style={styles.topBarButton}>
                                <Icon name="user-plus" size={35} color="black" />
                            </View>
                        </TouchableOpacity>
                    )}

                    {isMember && (
                        <TouchableOpacity onPress={() => leaveGroup()} >
                            <View style={styles.topBarButton}>
                                <Icon name="sign-out" size={35} color="black" />
                            </View>
                        </TouchableOpacity>
                    )}
                    
                    {isMember && (
                        <TouchableOpacity onPress={() => navigation.navigate('Chat', { loggedId: loggedId, groupId: groupId, users: users })} >
                            <View style={styles.topBarButton}>
                                <Icon name="comments" size={35} color="black" />
                            </View>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={async () => await Share.share({ message: `http://10.0.2.2:8000/group/${groupId}/id` })}>
                        <View style={styles.topBarButton}>
                            {(
                                <Icon name="share" size={30} color="black" />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [isOwner, isMember, applied, navigation]);

    if (loading) {
        return <ActivityIndicator size="large" color="8C9490" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    if (!group) {
        return <Text>No group data</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                {isOwner && (                <TouchableOpacity onPress={() => setGroupNameVisible(true)}>
                    <Text style={styles.groupName}>{group.name}</Text>
                </TouchableOpacity>)
                }

                {!isOwner && (
                    <Text style={styles.groupName}>{group.name}</Text>
                )}
            </View>
            <View style={{ alignItems: 'flex-start', width: '100%', backgroundColor: '#e0e0e0', borderRadius: 10 }}>
                {isOwner && (
                    <View>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }} onPress={() => handleEditDescription()}>
                            <View style={{width: 40}}><Icon name="info-circle" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                            <Text style={styles.groupDescription}>{group.description}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15}} onPress={() => setLocationVisible(true)}>
                            <View style={{width: 40}}><Icon name="map-marker" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                            <Text style={styles.groupDescription}>{group.location}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15}} onPress={() => setLanguagesVisible(true)}>
                            <View style={{width: 40}}>  <Icon name="language" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                            <Text style={styles.groupDescription}>{group.languages}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15}} onPress={() => setLanguagesVisible(true)}>
                            <View style={{width: 40}}> <Icon name="users" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                            <Text style={styles.groupDescription}>{group.maxsize}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {!isOwner && (
                     <View>
                     <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                         <View style={{width: 40}}><Icon name="info-circle" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                         <Text style={styles.groupDescription}>{group.description}</Text>
                     </View>
                     <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                         <View style={{width: 40}}><Icon name="map-marker" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                         <Text style={styles.groupDescription}>{group.location}</Text>
                     </View>
                     <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                         <View style={{width: 40}}>  <Icon name="language" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                         <Text style={styles.groupDescription}>{group.languages}</Text>
                     </View>
                     <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                         <View style={{width: 40}}> <Icon name="users" size={30} color="black" style={{ marginRight: 10 }} /> </View>
                         <Text style={styles.groupDescription}>{group.maxsize}</Text>
                     </View>
                 </View>
             )}
            </View>
            <TagList isOwner={isOwner} groupId={groupId} />
            <GroupSessionList isOwner={isOwner} groupId={groupId} />
            <UserListRow groupId={groupId} loggedId={loggedId} isOwner={isOwner} />


            <Dialog.Container visible={descriptionVisible}>
                <Dialog.Title>Edit Description</Dialog.Title>
                <Dialog.Input
                    placeholder="Enter new description"
                    value={description}
                    onChangeText={setDescription}
                />
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="OK" onPress={handleDescriptionOK} />
            </Dialog.Container>
            <Dialog.Container visible={locationVisible}>
                <Dialog.Title>Edit Location</Dialog.Title>
                <Dialog.Input
                    placeholder="Enter new location"
                    value={location}
                    onChangeText={setLocation}
                />
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="OK" onPress={handleLocationOK} />
            </Dialog.Container>

            <Dialog.Container visible={languagesVisible}>
                <Dialog.Title>Edit Languages</Dialog.Title>
                <Dialog.Input
                    placeholder="Enter new languages"
                    value={languages}
                    onChangeText={setLanguages}
                />
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="OK" onPress={handleLanguagesOK} />
            </Dialog.Container>

            <Dialog.Container visible={groupNameVisible}>
                <Dialog.Title>Edit Group Name</Dialog.Title>
                <Dialog.Input
                    placeholder="Enter new group name"
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                />
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="OK" onPress={handleGroupNameOK} />
            </Dialog.Container>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'baseline',
    },
    groupName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
    },
    groupDescription: {
        fontSize: 16,
        marginBottom: 10,
        margin: 10,
    },
    GroupContainer: {
        marginTop: 20,
        width: '100%',
    },
    name: {
        fontSize: 32,
    },
    topBarButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
});

export default GroupScreen;