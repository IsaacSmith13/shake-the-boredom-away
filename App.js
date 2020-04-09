import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import RNShake from "react-native-shake";

export default function App() {
  const [name, setName] = useState("World");

  const handleShake = () => {
    setName("Isaac sucks!");
  };

  useEffect(() => {
    RNShake.addEventListener("ShakeEvent", () => handleShake());

    return () => RNShake.removeEventListener("ShakeEvent");
  }, []);

  console.log("test");
  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>{`Hello, ${name}!`}</Text>
      <Button color="#4169E1" onPress={handleShake} title="Click me" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: {
    fontSize: 50,
    padding: 15,
  },
});
