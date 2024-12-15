// Author: Marek Kozumplik  
// Login: xkozum08

// show list of tags for user
// if user is logged user, it allows to add new tags with the button next to the header
// also when clicked on the tag, it removes the tag from the user (after Alert confirmation)
// very similar to TagListGroup, but for users

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-dialog';

interface Tag {
  pk: number;
  name: string;
}

const TagListUser = ({ isLoggedUser, userId }: { isLoggedUser: boolean , userId: number}) => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagVisible, setNewTagVisible] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]);


  // fetch group tags
  const fetchTags = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/user/${userId}/preferences/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const data_user: Tag[] = responseData.data.map((user: any) => ({
        pk: user.pk,
        name: user.fields.name,
      }));
      setTags(data_user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  // this is for creating new tag if it doesnt exist yet, this should be in assignTag function in backend
  const fetchAllTags = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/tags/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const data_user: Tag[] = responseData.data.map((user: any) => ({
        pk: user.pk,
        name: user.fields.name,
      }));
      setAllTags(data_user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTags();
  }
  , []);

  useEffect(() => {
    fetchTags();
  }, []);


  // this is for creating new tag if it doesnt exist yet, this should be in assignTag function in backend too
  const handleAddTag = async (tagName: string) => {
    const tag = allTags.find((tag) => tag.name === tagName);
    if (tag) {
      assignTag(userId, tag.pk);
    } else {
      createTag(tagName);
    }
  };

  // assign tag to user
  const assignTag = (userId: number, tagId: number) => {
    const tagData = {
        user_id: userId,
        tag_id: tagId,
        islooking: true,
    };
    fetch('http://10.0.2.2:8000/addPlayerPreference/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
            console.log('Tag assigned successfully:', data);
            fetchTags();
            }
        })
        .catch(error => {
            console.error('Error assigning tag:', error);
        });
  };


  // if tag doesnt exist yet in the db, create it
  const createTag = (tagName: string) => {
      const tagData = {
          name: tagName,
      };
    fetch('http://10.0.2.2:8000/tag/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
              console.log('Tag created successfully:', data);
              assignTag(userId, data['tagid']);
              fetchAllTags();
            }
        })
        .catch(error => {
            console.error('Error creating tag:', error);
        });
    
  };

  // dialog for removing tag
  const handleRemoveTag = (tagId: number) => {
    Alert.alert(
      'Remove Tag',
      'Are you sure you want to remove this tag?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => removeUserTag(tagId) },
      ],
      { cancelable: false },
    );
  }

  // POST request for removing tag
  const removeUserTag = (tagId: number) => {
    const tagData = {
        user_id: userId,
        tag_id: tagId,
    };
    fetch('http://10.0.2.2:8000/removePlayerPreference/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData),
    })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
            console.log('Tag deleted successfully:', data);
            fetchTags();
          }
      })
      .catch(error => {
          console.error('Error creating tag:', error);
      });

};


  if (loading) {
    return <ActivityIndicator size="large" color="8C9490" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }






  const handleCancel = () => {
    setNewTagVisible(false);
  };

  const handleNewTagOK = () => {
    if (newTag === '') {
      return;
    }
    handleAddTag(newTag);
    setNewTagVisible(false);
  };

  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Tags</Text>
        {isLoggedUser && (
          <TouchableOpacity style={styles.button} onPress={() => setNewTagVisible(true)}>
            <Icon name="plus" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
      {isLoggedUser && (
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tagItem} onPress={() => handleRemoveTag(tag.pk)}>
              <Text style={styles.tagName}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {!isLoggedUser && (
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tagItem}>
              <Text style={styles.tagName}>{tag.name}</Text>
            </View>
          ))}
        </View>
      )}
      <View>
        <Dialog.Container visible={newTagVisible}>
          <Dialog.Title>Create a new tag</Dialog.Title>
          <Dialog.Input
            placeholder="Enter new tag name"
            value={newTag}
            onChangeText={setNewTag}
          />
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="OK" onPress={() => handleNewTagOK()} />
        </Dialog.Container>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
    },
  tagItem: {
      backgroundColor: '#e0e0e0',
      borderRadius: 5,
      padding: 5,
      margin: 5,
    },
  tagName: {
  fontSize: 14,
  color: '#666',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
  },
});

export default TagListUser;
