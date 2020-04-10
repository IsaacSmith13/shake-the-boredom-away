import { EDAMAM_APP_KEY, EDAMAM_APP_ID } from "../../private-keys.js";
import { getRandomItemFromArr } from "../utils/getRandomItem.js";

export const CookingApi = {
  getRecommendation: async () => {
    const commonLetters = "abcdefghijklmnoprstuy";
    const searchTerm = commonLetters.charAt(
      Math.floor(Math.random() * commonLetters.length)
    );

    return await fetch(
      `https://api.edamam.com/search?q=${searchTerm}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&from=0&to=100`
    )
      .then((response) => response.json())
      .then(({ hits }) => {
        const { recipe } = getRandomItemFromArr(hits);
        return {
          description: recipe.label,
          descriptionLink: recipe.url,
          image: recipe.image,
          title:
            "Nothing soothes boredom like food. Try making the following recipe!",
        };
      })
      .catch((err) => {
        console.log("edamam error", err);
      });
  },
};
