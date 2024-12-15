// Author: Marek Kozumplik  
// Login: xkozum08

// Display a list of groups that the user is a member of
// For the UserScreen 


import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Group {
    pk: number;
    name: string;
    description?: string | null;
}

const GroupListRow = ({ userId, loggedId }: { userId: number, loggedId: number }) => {
    const navigation = useNavigation<BottomTabNavigationProp<any>>();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:8000/user/${userId}/groups/`);
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
                max_size: group.fields.max_size
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
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="8C9490" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.groupContainer}>
            <Text style={styles.header}>Groups:</Text>
            <FlatList
                data={groups}
                keyExtractor={(item) => item.pk.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Group', { groupId: item.pk, loggedId: loggedId })}>
                        <View style={styles.item}>
                            <View style={styles.imageContainer}>
                                {(
                                    <Icon name="group" size={30} color="black" />
                                )}
                            </View>
                            <Text style={styles.name}>{item.name}</Text>
                            {item.description && <Text style={styles.description}>{item.description}</Text>}
                        </View>
                    </TouchableOpacity>
                )}
                horizontal={true}
                contentContainerStyle={styles.scrollContainer} />
        </View>
    );
};

const styles = StyleSheet.create({
    groupContainer: {
        flexDirection: 'column',
        flex: 1,
        marginBottom: 20,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '8C9490',
        width: 200,
        height: 200,
    },
    scrollContainer: {
        flexDirection: 'row',
    },
    tag: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },

});

export default GroupListRow;
