import { BETTER_ZIP_KEY } from "../../private-keys.js";

export async function getLatLong(zipCode){
    let response = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${BETTER_ZIP_KEY}&postalcode=${zipCode}&country=United%20States&format=json`
      )
        let data = await response.json();

        return {
            lat: data[0].lat,
            long: data[0].lon
        }
}