import { BETTER_ZIP_KEY } from "../../private-keys.js";
import { getRandomItemFromArr } from "../utils/getRandomItem.js";

export const ParkApi = {
  getRecommendation: async (zipCode) => {
    let latLong = await fetch(
      `https://us1.locationiq.com/v1/search.php?key=${BETTER_ZIP_KEY}&postalcode=${zipCode}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        return {
          lat: data[0].lat,
          long: data[0].lon,
        };
      })
      .catch((err) => {
        console.log("Postal code to latitude and longitude API error", err);
      });

    return await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&category=park&location=${latLong.long},${latLong.lat}&outFields=Place_addr,PlaceName&maxLocations=5`
    )
      .then((response) => response.json())
      .then((data) => {
        const park = getRandomItemFromArr(data.candidates);
        return {
          description: park.address,
          header:
            "Nothing soothes boredom like taking a walk. Take a stroll in this park!",
        };
      })
      .catch((err) => {
        console.log("Park API error", err);
      });
  },
};
