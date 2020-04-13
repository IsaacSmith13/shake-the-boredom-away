import React, { useState, useEffect } from "react";
import {
  AsyncStorage,
  Image,
  KeyboardAvoidingView,
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
import * as Font from "expo-font";
import { AppLoading } from "expo";
import NewIdea from "./src/components/new-idea.js";
import { isSmall } from "./src/models/phone-size.js";

const fetchFonts = () => {
  return Font.loadAsync({
    "bangers-regular": require("./assets/fonts/Bangers-Regular.ttf"),
    "montserrat-regular": require("./assets/fonts/Montserrat-Regular.ttf"),
  });
};

const renderContent = (activity) => {
  if (!activity) {
    return (
      <>
        <Text style={styles.header}>Bored in quarantine?</Text>
        <Text style={styles.subHeaderLanding}>
          Give me a shake (or press the button) for a bright idea to help stave
          off that inevitable boredeom
        </Text>
        <NewIdea viewBox="0 0 1100 1100" style={styles.introLogo} />
      </>
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
        style={titleLink ? styles.hyperlink : styles.subHeader}
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
      Get moving to this tune!
    </Text>,
    <Text
      style={styles.subHeader}
      onPress={() => Linking.openURL(titleLink)}
      key={"title"}
    >
      Song: <Text style={styles.headerHyperlink}>{title}</Text>
    </Text>,
    <Text style={styles.subHeader} key={"artist"}>
      Artist: <Text style={styles.subHeader}>{artist}</Text>
    </Text>,
  ];

  if (releaseDate) {
    content.push(
      <Text style={styles.subHeader} key={"releaseDate"}>
        Release Date: <Text style={styles.subHeader}>{releaseDate}</Text>
      </Text>
    );
  }

  return content;
};

export default function App() {
  const [activity, setActivity] = useState();
  const [hasSavedZipCode, setHasSavedZipCode] = useState();
  const [zipCode, setZipCode] = useState();
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleShake = async () => {
    try {
      setActivity(
        await getActivity({
          numberOfPeople: 1,
          streamingServices: [StreamingServices.netflix],
          zipCode: 43215,
        })
      );
    } catch (err) {
      console.log(err);
      handleShake();
    }
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

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
      />
    );
  }

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
      <KeyboardAvoidingView behavior={"padding"}>
        <TouchableOpacity
          disabled={disabled}
          style={disabled ? styles.disabledButton : styles.button}
          onPress={onPress}
        >
          <Text
            style={disabled ? styles.disabledButtonText : styles.buttonText}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    textAlign: "center",
  },
  container: {
    justifyContent: "center",
    flex: 1,
  },
  header: {
    fontSize: isSmall() ? 24 : 38,
    fontWeight: "700",
    color: Colors.accent,
    paddingBottom: 15,
    fontFamily: "bangers-regular",
    textAlign: "center",
  },
  subHeaderLanding: {
    fontSize: 14,
    color: Colors.text,
    paddingBottom: 15,
    fontFamily: "montserrat-regular",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    paddingBottom: 15,
    fontFamily: "montserrat-regular",
    textAlign: "center",
  },
  headerHyperlink: {
    fontSize: 22,
    paddingBottom: 15,
    textDecorationLine: "underline",
    color: Colors.hyperlink,
  },
  paragraph: {
    fontSize: 18,
    color: Colors.text,
    paddingBottom: 15,
    textAlign: "center",
  },
  hyperlink: {
    fontSize: 18,
    paddingBottom: 24,
    textDecorationLine: "underline",
    color: Colors.hyperlink,
    textAlign: "center",
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
    backgroundColor: Colors.text,
    borderRadius: 12,
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "bangers-regular",
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
    fontFamily: "bangers-regular",
  },
  introLogo: {
    marginTop: 75,
  },
});
