import { Dimensions } from "react-native";

const smallThreshold = 350;

export const isSmall = () => Dimensions.get("window").width < smallThreshold;
