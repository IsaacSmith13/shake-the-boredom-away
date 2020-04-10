import { ZIP_CODE_APP_KEY } from "../../private-keys.js";
import { getRandomItemFromArr } from "../utils/getRandomItem.js";

export const ParkApi = {
  getRecommendation: async (zipCode) => {
    const latLong = await fetch(
      `https://www.zipcodeapi.com/rest/${ZIP_CODE_APP_KEY}/info.json/${zipCode}/degrees`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        console.log("api", ZIP_CODE_APP_KEY);
        return {
          lat: data.lat,
          long: data.lng,
        };
      })
      .catch(console.log);

    console.log("lat & long", latLong);

    return await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&category=park&location=${latLong.long},${latLong.lat}&outFields=Place_addr,PlaceName&maxLocations=5`
    )
      .then((response) => response.json())
      .then(({ data }) => {
        const { park } = getRandomItemFromArr(data.candidates);
        return {
          description: park.address,
          title:
            "Nothing soothes boredom like taking a walk. Take a stroll in this park!",
        };
      })
      .catch((err) => {
        console.log("park error", err);
      });
  },
};
