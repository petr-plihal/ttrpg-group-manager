// Author: Marek Kozumplik  
// Login: xkozum08
// Main file of the application. It contains the main navigation logic and the main component of the application.
// All files are formatted using VSCode formatting tool.

import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import SearchScreen from './src/screens/SearchScreen';
import MyGroupsScreen from './src/screens/MyGroupsScreen';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import UserScreen from './src/screens/UserScreen';
import GroupScreen from './src/screens/GroupScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ChatScreen from './src/screens/ChatScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import ManageMembersScreen from './src/screens/ManageMembersScreen';
import InvitePlayerScreen from './src/screens/InvitePlayerScreen';
import CreateSession from './src/screens/CreateSessionScreen';


function App(): React.JSX.Element {
  const [loggedId, setLoggedId] = useState<number | null>(null);


  type BottomTabParamList = {
    Search: { loggedId: number }
    "My Groups": { loggedId: number }
    Calendar: { loggedId: number };
    "My Profile": { userId: number, loggedId: number };
  };

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator<BottomTabParamList>();



  // Nav stacks for each tab
  const MyGroupStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="My Groups" component={MyGroupsScreen} initialParams={{ loggedId: loggedId }} />
      <Stack.Screen name="Create Group" component={CreateGroupScreen} />
      <Stack.Screen name="Group" component={GroupScreen} />
      <Stack.Screen name="Create Session" component={CreateSession} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Manage Members" component={ManageMembersScreen} />
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="Invite Player" component={InvitePlayerScreen} />
    </Stack.Navigator>
  );

  const SearchStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} initialParams={{ loggedId: loggedId }} />
      <Stack.Screen name="Group" component={GroupScreen} />
      <Stack.Screen name="Create Session" component={CreateSession} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Manage Members" component={ManageMembersScreen} />
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="Invite Player" component={InvitePlayerScreen} />

    </Stack.Navigator>
  );

  const MyProfileStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="MyProfile"
        component={UserScreen}
        initialParams={{ userId: loggedId, loggedId: loggedId }}
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen name="Group" component={GroupScreen} />
      <Stack.Screen name="Create Session" component={CreateSession} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Manage Members" component={ManageMembersScreen} />
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="Invite Player" component={InvitePlayerScreen} />
    </Stack.Navigator>
  );

  const CalendarStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={CalendarScreen} initialParams={{ loggedId: loggedId }} />
      <Stack.Screen name="Group" component={GroupScreen} />
      <Stack.Screen name="Create Session" component={CreateSession} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Manage Members" component={ManageMembersScreen} />
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="Invite Player" component={InvitePlayerScreen} />
    </Stack.Navigator>
  );


  useEffect(() => {
    setLoggedId(1); // hardcoded username for now since login page is not implemented
  }, []);


  // the bottom navbar, my groups is the default page
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="My Groups" screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Search" component={SearchStack}
          options={{
            tabBarIcon: () => (
              <Icon name="search" size={30} color="black" />
            ),
          }} />
        <Tab.Screen name="My Groups" component={MyGroupStack}
          options={{
            tabBarIcon: () => (
              <Icon name="group" size={30} color="black" />
            ),
          }} />
        <Tab.Screen name="Calendar" component={CalendarStack}
          options={{
            tabBarIcon: () => (
              <Icon name="calendar" size={30} color="black" />
            ),
          }} />
        <Tab.Screen
          name="My Profile"
          component={MyProfileStack}
          options={{
            tabBarIcon: () => (
              <Icon name="user" size={30} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
