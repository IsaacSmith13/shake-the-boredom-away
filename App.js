import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App () {
  const [name, setName] = useState('World');

    return (
      <View style={styles.container}>
        <Text style={styles.nameText}>
          {`Hello, ${name}!`}
        </Text>
        <Button color='#4169E1'
          onPress={() => setName('Katie')}
          title='Click me'>
        </Button>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 50,
    padding: 15,
  }
});
