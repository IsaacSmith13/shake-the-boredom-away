import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import RNShake from "react-native-shake";
import { getActivity } from "./src/getActivity.js";
import { StreamingServices } from "./src/models/streaming-services.js";
import { Categories } from "./src/models/categories.js";

const renderContent = (activity) => {
  if (!activity) {
    return null;
  }

  switch (activity.category) {
    case Categories.music:
      return renderSong(activity);
    default:
      return renderDefault(activity);
  }
};

const renderDefault = (activity) => {
  const descriptionHasOnPress =
    !!activity.externalLink && !activity.description2;

  const content = [];

  if (activity.title) {
    content.push(<Text style={styles.header}>{activity.title}</Text>);
  }

  if (activity.description) {
    content.push(
      <Text
        style={descriptionHasOnPress ? styles.hyperlink : styles.description}
        onPress={
          descriptionHasOnPress
            ? () => Linking.openURL(activity.externalLink)
            : undefined
        }
      >
        {activity.description}
      </Text>
    );
  }

  if (activity.description2) {
    content.push(
      <Text
        style={!!activity.externalLink ? styles.hyperlink : styles.description}
        onPress={
          !!activity.externalLink
            ? () => Linking.openURL(activity.externalLink)
            : undefined
        }
      >
        {activity.description2}
      </Text>
    );
  }

  return content;
};

const renderSong = (song) => {
  const content = [
    <Text style={styles.header} key={"header"}>
      Here's a song recommendation to get you off your seat and start moving!
    </Text>,
    <Text
      style={styles.header}
      onPress={() => Linking.openURL(song.externalLink)}
      key={"title"}
    >
      Song: <Text style={[styles.hyperlink, styles.header]}>{song.title}</Text>
    </Text>,
    <Text style={styles.header} key={"artist"}>
      Artist: <Text style={styles.header}>{song.artist}</Text>
    </Text>,
  ];

  if (song.releaseDate) {
    content.push(
      <Text style={styles.header} key={"releaseDate"}>
        Release Date: <Text style={styles.header}>{song.releaseDate}</Text>
      </Text>
    );
  }

  return content;
};

export default function App() {
  const [activity, setActivity] = useState("World");

  const handleShake = async () => {
    setActivity(
      await getActivity({
        numberOfPeople: 1,
        streamingServices: [StreamingServices.netflix],
        zipCode: 43040,
      })
    );
  };

  useEffect(() => {
    RNShake.addEventListener("ShakeEvent", () => handleShake());

    return () => RNShake.removeEventListener("ShakeEvent");
  }, []);

  return (
    <View style={styles.container}>
      {renderContent(activity)}
      {!!activity && !!activity.image && (
        <Image
          resizeMode={"contain"}
          source={{ uri: activity.image }}
          style={styles.image}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleShake}>
        <Text style={styles.buttonText}>Get a suggestion!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d0d0d0",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    paddingBottom: 15,
  },
  description: {
    fontSize: 16,
    paddingBottom: 15,
  },
  hyperlink: {
    fontSize: 16,
    paddingBottom: 24,
    color: "blue",
  },
  image: {
    width: "100%",
    height: "40%",
  },
  button: {
    width: "100%",
    height: 60,
    marginTop: 24,
    backgroundColor: "blue",
    borderRadius: 12,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});
