// Author: Marek Kozumplik  
// Login: xkozum08
// Chat screen 

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';


type chatScreenRouteParams = {
    groupId: number;
    loggedId: number;
    users: User[];
};


interface Chat {
    pk: number;
    groupId: number;
}

interface Message {
    pk: number;
    chatId: string;
    userId: number;
    content: string;
    timestamp: string;
    username: string;
    nickname: string;
}


interface User {
    pk: number;
    nickname: string;
    isowner: boolean;
    groupId: number;
    userId: number;
}

type ChatScreenRouteParams = {
    groupId: number;
    loggedId: number;
    users: User[];
};


type ChatScreenRouteProp = RouteProp<{ UserScreen: chatScreenRouteParams }, 'UserScreen'>;

const ChatScreen = () => {
    const route = useRoute<ChatScreenRouteProp>();
    const groupId = route.params.groupId;
    const loggedId = route.params.loggedId;
    const users = route.params.users;
    const [showGrid, setShowGrid] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<BottomTabNavigationProp<any>>();
    const [chatId, setChatId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageContent, setMessageContent] = useState<string>('');



    // fetched when navigated to this screen
    const fetchChat = async () => {
        try {
            if (groupId === null) {
                return;
            }
            const response = await fetch(`http://10.0.2.2:8000/group/${groupId}/chat/`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            const responseUser = responseData.data[0];
            const data_user: Chat = {
                pk: responseUser.pk,
                groupId: responseUser.fields.groupid,
            };
            setChatId(data_user.pk);
            console.log('Fetched chat:', data_user);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchChat();
    }, [groupId]); // fetched when navigated to the screen

    // fetched when navigated to this screen, but after the chat is fetched
    const fetchMessages = async () => {
        try { 
            if (chatId === null) { // chat not fetched yet
                return;
            }
            console.log('Fetching messages for chat:', chatId);
            const response = await fetch(`http://10.0.2.2:8000/chat/${chatId}/`);
            if (!response.ok) {
                console.log('Response:', response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const messages = await response.json();
            const data_message: Message[] = messages.data.map((message: any) => ({
                pk: message.pk,
                timestamp: message.fields.timestamp,
                content: message.fields.content,
                userId: message.fields.userid,
                chatId: message.fields.chatid,
            }));

            console.log('users: ', users)
            data_message.forEach((message) => {
                const user = users.find((user) => user.userId === message.userId);
                if (user) {
                    message.nickname = user.nickname;
                }
            });

            setMessages(data_message);
            console.log('Fetched messages:', data_message);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMessages();
    }, [chatId]); // fetched after the chat is fetched



    // send message using POST
    const handleSendMessage = async (content: string) => {
        try {
            console.log('Sending message:', content);
            console.log('To chat:', chatId);
            const response: Response = await fetch(`http://10.0.2.2:8000/chatmessage/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatid: chatId,
                    userid: loggedId,
                    content: content,
                }),
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
            }
            if (responseData.status !== 'success') {
                console.log('Error:', responseData.message);
            }
            if (responseData.status === 'success') {
                fetchMessages();
                setMessageContent(''); // clear input
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    

    return (
        <View style={styles.container}>
            <View style={styles.messagesContainer}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.pk.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.message}>
                            <Text style={styles.nickname}>{item.nickname}</Text>
                            <Text style={styles.text}>{item.content}</Text>
                            <Text style={styles.date}>{new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={styles.messageContainer}>
                <View style={styles.textContainer}>
                    <TextInput
                        style={styles.text}
                        placeholder="Type a message"
                        onChangeText={(text) => setMessageContent(text)}
                        value={messageContent}
                    />
                </View>
                <TouchableOpacity onPress={() => handleSendMessage(messageContent)}
                    style={styles.buttonContainer}>
                    <Icon name="send" size={20} color="black" />
                </TouchableOpacity>
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
    text: {
        fontSize: 20,
        color: '#000',
    },
    message: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#666',
        borderRadius: 5,
        width: 60,
        
    },
    messageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#666',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        width: '90%',
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    nickname: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    messagesContainer: {
        marginTop: 20,
        flex: 1,
        width: '90%',
    },
    date: {
        fontSize: 16,
        color: '#666',
    },
});

export default ChatScreen;
