import { getRandomItemFromArr } from "../utils/getRandomItem.js";

export const PoetryApi = {
  getRecommendation: async () =>
    await fetch("https://www.poemist.com/api/v1/randompoems")
      .then((response) => response.json())
      .then((poems) => {
        const { title, content, url, poet } = getRandomItemFromArr(poems);
        return {
          header:
            "Distract yourself with something exquisite!",
          title,
          externalLink: url,
          description: `Author: ${poet.name}`,
          description2: content,
        };
      })
      .catch((err) => {
        console.log("poetry error", err);
      }),
};
