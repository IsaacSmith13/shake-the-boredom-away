import React, { useState, useEffect } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNShake from "react-native-shake";
import { getActivity } from "./src/getActivity.js";
import { StreamingServices } from "./src/models/streaming-services.js";
import {
  InsideCategories,
  OutsideCategories,
} from "./src/models/categories.js";

const renderContent = (activity) => {
  if (!activity) {
    return null;
  }

  switch (activity.category) {
    case InsideCategories.music:
      return renderSong(activity);
    default:
      return renderDefault(activity);
  }
};

const renderDefault = ({
  description,
  description2,
  description2Link,
  descriptionLink,
  header,
  title,
  titleLink,
}) => {
  const content = [];

  if (header) {
    content.push(
      <Text style={styles.header} key={"header"}>
        {header}
      </Text>
    );
  }

  if (title) {
    content.push(
      <Text
        style={titleLink ? styles.hyperlink : styles.paragraph}
        onPress={titleLink ? () => Linking.openURL(titleLink) : undefined}
        key={"title"}
      >
        {title}
      </Text>
    );
  }

  if (description) {
    content.push(
      <Text
        key={"description"}
        style={descriptionLink ? styles.hyperlink : styles.paragraph}
        onPress={
          descriptionLink ? () => Linking.openURL(descriptionLink) : undefined
        }
      >
        {description}
      </Text>
    );
  }

  if (description2) {
    content.push(
      <Text
        key={"description2"}
        style={description2Link ? styles.hyperlink : styles.paragraph}
        onPress={
          description2Link ? () => Linking.openURL(description2Link) : undefined
        }
      >
        {description2}
      </Text>
    );
  }

  return content;
};

const renderSong = ({ titleLink, title, releaseDate, artist }) => {
  const content = [
    <Text style={styles.header} key={"header"}>
      Here's a song recommendation to get you off your seat and start moving!
    </Text>,
    <Text
      style={styles.header}
      onPress={() => Linking.openURL(titleLink)}
      key={"title"}
    >
      Song: <Text style={[styles.hyperlink, styles.header]}>{title}</Text>
    </Text>,
    <Text style={styles.header} key={"artist"}>
      Artist: <Text style={styles.header}>{artist}</Text>
    </Text>,
  ];

  if (releaseDate) {
    content.push(
      <Text style={styles.header} key={"releaseDate"}>
        Release Date: <Text style={styles.header}>{releaseDate}</Text>
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
  paragraph: {
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
