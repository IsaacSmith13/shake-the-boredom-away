import { BETTER_ZIP_KEY } from "../../private-keys.js";
import { getRandomItemFromArr } from "../utils/getRandomItem.js";
import { parkImg } from "../../assets/images/park.jpeg";

export const ParkApi = {
  getRecommendation: async (zipCode, weather) => {
    console.log("zipCode", zipCode)
    let latLong = await fetch(
      `https://us1.locationiq.com/v1/search.php?key=${BETTER_ZIP_KEY}&postalcode=${zipCode}&country=United%20States&format=json`
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
            "Take a stroll in this park!",
          image: "https://www.portlandoregon.gov/parks/finder/index.cfm?action=ViewFile&PolPhotosID=289",
          description: `Current Weather: ${weather.main}`,
          description2: `Current Temperature: ${weather.temp} ℉`

        };
      })
      .catch((err) => {
        console.log("Park API error", err);
      });
  },
};
