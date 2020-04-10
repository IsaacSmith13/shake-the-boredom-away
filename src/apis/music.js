import { GENIUS_API_KEY } from "../../private-keys.js";
import { Categories } from "../models/categories.js";
const maxNumberOfTries = 10;
const maxSong = 2471960;
const getSongId = () => Math.floor(Math.random() * maxSong);

export const MusicApi = {
  getRecommendation: async (numberOfTries = 0) =>
    await fetch(
      `https://api.genius.com/songs/${getSongId()}?access_token=${GENIUS_API_KEY}`
    )
      .then((response) => response.json())
      .then(({ meta, response }) => {
        if (numberOfTries === maxNumberOfTries) {
          return {
            title: "Hmm... something went wrong",
            description: "Try again",
          };
        }

        if (!meta || meta.status !== 200) {
          return MusicApi.getRecommendation(++numberOfTries);
        }

        const { song } = response;

        return {
          image: song["song_art_image_url"].includes("default_cover_image")
            ? undefined
            : song["song_art_image_url"],
          title: song["title"],
          artist: song["primary_artist"]["name"],
          releaseDate: song["release_date"],
          titleLink: song["url"],
          category: Categories.music,
        };
      })
      .catch((err) => {
        console.log("edamam error", err);
      }),
};
