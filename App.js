import React, { useState, useEffect } from "react";
import {
  AsyncStorage,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import PropTypes from "prop-types";
import { Colors } from "./src/models/colors.js";

const renderContent = (activity) => {
  if (!activity) {
    return (
      <Text style={styles.header}>
        It's time to shake your quarantine boredom away! Shake your phone or
        press the button for something that will help stave off that inevitable
        boredom for a brief time
      </Text>
    );
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
      Song: <Text style={styles.headerHyperlink}>{title}</Text>
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
  const [activity, setActivity] = useState();
  const [hasSavedZipCode, setHasSavedZipCode] = useState();
  const [zipCode, setZipCode] = useState();

  const handleShake = async () => {
    setActivity(
      await getActivity({
        numberOfPeople: 1,
        streamingServices: [StreamingServices.netflix],
        zipCode: 43215,
      })
    );
  };

  const onPress = async () => {
    try {
      await AsyncStorage.setItem("zipCode", zipCode);
    } catch (error) {
      console.log("failed to save zipCode to local storage", error);
    }
  };

  useEffect(() => {
    RNShake.addEventListener("ShakeEvent", () => handleShake());

    return () => RNShake.removeEventListener("ShakeEvent");
  }, []);

  useEffect(() => {
    if (!hasSavedZipCode) {
      const getZip = async () => {
        try {
          const storageZipCode = await AsyncStorage.getItem("zipCode");
          setHasSavedZipCode(!!storageZipCode);
          !!storageZipCode && setZipCode(storageZipCode);
        } catch (error) {
          console.log("failed to read zipCode from local storage", error);
        }
      };

      getZip();
    }
  });

  return hasSavedZipCode ? (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {renderContent(activity)}
          {!!activity && !!activity.image && (
            <Image
              resizeMode={"contain"}
              source={{ uri: activity.image }}
              style={styles.image}
            />
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleShake}>
        <Text style={styles.buttonText}>Get a suggestion!</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <ZipCodeForm
      onChange={(zipCode) => {
        console.log(zipCode);
        setZipCode(zipCode);
      }}
      onPress={onPress}
      disabled={zipCode?.length !== 5}
    />
  );
}

function ZipCodeForm({ onPress, disabled, onChange }) {
  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.header}>
            Please enter your zip code so we can recommend activities in your
            area
          </Text>
          <TextInput
            autoCompleteType={"postal-code"}
            autoFocus
            label={"zip code"}
            placeholder={"12345"}
            style={styles.textInput}
            onChangeText={onChange}
            keyboardType={"numeric"}
            maxLength={5}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        disabled={disabled}
        style={disabled ? styles.disabledButton : styles.button}
        onPress={onPress}
      >
        <Text style={disabled ? styles.disabledButtonText : styles.buttonText}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
}

ZipCodeForm.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

const styles = StyleSheet.create({
  fullScreen: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingTop: 60,
  },
  container: {
    justifyContent: "center",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    paddingBottom: 15,
  },
  headerHyperlink: {
    fontSize: 28,
    fontWeight: "700",
    paddingBottom: 15,
    textDecorationLine: "underline",
    color: Colors.hyperlink,
  },
  paragraph: {
    fontSize: 18,
    color: "white",
    paddingBottom: 15,
  },
  hyperlink: {
    fontSize: 18,
    paddingBottom: 24,
    textDecorationLine: "underline",
    color: Colors.hyperlink,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: "100%",
  },
  button: {
    width: "100%",
    height: 60,
    marginVertical: 24,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
  },
  textInput: {
    backgroundColor: "white",
    height: 50,
    marginLeft: "auto",
    marginRight: "auto",
    paddingHorizontal: 10,
    width: "40%",
  },
  disabledButton: {
    width: "100%",
    height: 60,
    marginVertical: 24,
    backgroundColor: Colors.disabled,
    borderRadius: 12,
    justifyContent: "center",
  },
  disabledButtonText: {
    color: Colors.secondary,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
  },
});
