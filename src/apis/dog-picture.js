import { getRandomItemFromArr } from "../utils/getRandomItem.js";

export const DogPictureApi = {
  getRecommendation: async () =>
    await fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then(({ message }) => {
        return {
          header: "Just look at this cute li'l guy",
          image: message,
        };
      })
      .catch((err) => {
        console.log("dog.ceo error", err);
      }),
};
