export const NetflixApi = {
  getRecommendation: async () => {
    return await fetch(
      "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Anew7%3AUS&p=1&t=ns&st=adv",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
          "x-rapidapi-key":
            "11d530fd7amsh3a7cc4b4aa1943ep17ea9fjsn5d297be2c7d0",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((err) => {
        console.log("netflix error", err);
      });
  },
};
