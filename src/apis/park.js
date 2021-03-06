import { BETTER_ZIP_KEY } from "../../private-keys.js";
import { getRandomItemFromArr } from "../utils/getRandomItem.js";

export const ParkApi = {
  getRecommendation: async (weather, latLong) => {
    return await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&category=park&location=${latLong.long},${latLong.lat}&outFields=Place_addr,PlaceName&maxLocations=50`
    )
      .then((response) => response.json())
      .then((data) => {
        const park = getRandomItemFromArr(data.candidates);

        return {
          title: park.address,
          titleLink: `https://www.google.com/maps/@${latLong.lat},${latLong.long},13z`,
          header: "Take a stroll in this park!",
          image:
            "https://www.portlandoregon.gov/parks/finder/index.cfm?action=ViewFile&PolPhotosID=289",
          description: `Current Weather: ${weather.main}`,
          description2: `Current Temperature: ${weather.temp} ℉`,
        };
      })
      .catch((err) => {
        console.log("Park API error", err);
      });
  },
};
