
// Author: Marek Kozumplik  
// Login: xkozum08

// For inviting a player to a group, need to select a group the user owns
// For InvitePlayerScreen component
// Navigated to this screen after clicking on the invite player button in UserScreen

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Group {
    pk: number;
    name: string;
    description?: string | null;
    location?: string | null;
    languages?: string[];
    max_size?: number;
}

const OwnedGroupsList = ({ loggedId, invitedId }: { loggedId: number, invitedId: number }) => {
    const navigation = useNavigation<BottomTabNavigationProp<any>>();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = async () => {
        try {
            console.log('Fetching groups');
            const response = await fetch(`http://10.0.2.2:8000/user/${loggedId}/ownedGroups`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            const data_group: Group[] = responseData.data.map((group: any) => ({
                pk: group.pk,
                name: group.fields.name,
                description: group.fields.description,
                location: group.fields.location,
                languages: group.fields.languages,
                max_size: group.fields.maxsize
            }));
            console.log('Fetched groups:', data_group);
            setGroups(data_group);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [loggedId]);


    // Function to invite a player to a group based on the group id of the row
    const handleInvitePlayer = async (groupId: number, invitedId: number) => {
        try {
            console.log('Inviting player:', invitedId);
            console.log('To group:', groupId);
            const response: Response = await fetch(`http://10.0.2.2:8000/invitePlayer/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: groupId,
                    user_id: invitedId,
                    description: 'Invitation',
                }),
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
            }
            if (responseData.status !== 'success') {
                Alert.alert('Error', responseData.message); // dialog if error
            }

            if (responseData.status === 'success') {
                navigation.goBack();
            }

        } catch (error) {
            console.error('Error inviting player:', error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="8C9490" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <FlatList
            data={groups}
            keyExtractor={(item) => item.pk.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleInvitePlayer(item.pk, invitedId)}>
                    <View style={styles.row}>
                        <View style={styles.imageContainer}>
                            <Icon name="user" size={50} color="black" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            {item.description && <Text style={styles.description}>{item.description}</Text>}
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '8C9490',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        marginRight: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
});

export default OwnedGroupsList;
