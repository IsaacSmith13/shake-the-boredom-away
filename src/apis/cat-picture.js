export const CatPictureApi = {
  getRecommendation: async () =>
    await fetch("https://api.thecatapi.com/v1/images/search")
      .then((response) => response.json())
      .then((response) => {
        return {
          header: "Just look at this cute li'l gal",
          image: response[0].url,
        };
      })
      .catch((err) => {
        console.log("thecatapi error", err);
      }),
};
