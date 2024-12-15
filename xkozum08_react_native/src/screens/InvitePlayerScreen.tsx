// Author: Marek Kozumplik  
// Login: xkozum08
// This show the list of groups that the user owns, when clicked on a group it will invite the player to the group
// Uses OwnedGroupsList component for inviting


import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import OwnedGroupsList from '../components/OwnedGroupsList';

type InvitePlayerScreenRouteParams = {
    loggedId: number;
    invitedId: number;
};

type InvitePlayerScreenRouteProp = RouteProp<{ InvitePlayerScreen: InvitePlayerScreenRouteParams }, 'InvitePlayerScreen'>;

const InvitePlayerScreen = () => {
    const route = useRoute<InvitePlayerScreenRouteProp>();
    const loggedId = route.params.loggedId;
    const invitedId = route.params.invitedId;
    const navigation = useNavigation<BottomTabNavigationProp<any>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(false);
            } catch (e) {
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    
    if (loading) {
        return <ActivityIndicator size="large" color="8C9490" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }


    return (
        <View style={styles.listContainer}>
            <OwnedGroupsList loggedId={loggedId} invitedId={invitedId} />
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        width: '100%',
        padding: 20,
    },
});

export default InvitePlayerScreen;