import { AIRTABLE_API_KEY } from "../../private-keys.js";
import { getRandomItemFromArr } from "../utils/getRandomItem.js";
import { InsideCategories } from "../models/categories.js";

export const BookApi = {
  getRecommendation: async () =>
    await fetch(
      `https://api.airtable.com/v0/appybL1OJaEEIvAdS/Books?api_key=${AIRTABLE_API_KEY}`
    )
      .then((response) => response.json())
      .then(({ records }) => {
        const book = getRandomItemFromArr(records);

        return {
          author: book.fields.Author,
          category: InsideCategories.reading,
          title: book.fields.Title,
          titleLink: book.fields.Amazon_Link,
        };
      })
      .catch((err) => {
        console.log("airtable error", err);
      }),
};
