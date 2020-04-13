import {
  Categories,
  InsideCategories,
  OutsideCategories,
} from "./models/categories.js";
import { determineGoodWeather } from "./models/weather.js";
import { StreamingServices } from "./models/streaming-services.js";
import { CookingApi } from "./apis/cooking.js";
import { ParkApi } from "./apis/park.js";
import {
  getRandomKeyFromObj,
  getRandomItemFromArr,
} from "./utils/getRandomItem.js";
import { MusicApi } from "./apis/music.js";
import { PoetryApi } from "./apis/poetry.js";
import { DogPictureApi } from "./apis/dog-picture.js";
import { CatPictureApi } from "./apis/cat-picture.js";
import { BookApi } from "./apis/book.js";

const animalPictureApis = [DogPictureApi, CatPictureApi];

let DisneyPlusApi = (AmazonPrimeApi = NetflixApi = HuluApi = {
  getRecommendation: () => {
    return {
      title: "Watch Mulan on Disney Plus!",
      description: "yada yada",
      externalLink: "https://disneyplus.com/watch/mulan",
    };
  },
});

export async function getActivity({
  streamingServices,
  zipCode,
  numberOfPeople,
}) {
  return await getActivityForCategory({
    category: await getCategory(zipCode, numberOfPeople),
    numberOfPeople,
    streamingServices,
    zipCode,
  });
}

let weather;

async function getCategory(zipCode, numberOfPeople) {
  weather = await determineGoodWeather({ zipCode });
  if (weather.main === "Rain") {
    return getRandomKeyFromObj(InsideCategories);
  }
  return getRandomKeyFromObj(Categories);
}

async function getActivityForCategory({
  category,
  numberOfPeople,
  streamingServices,
  zipCode,
}) {
  if (OutsideCategories.hasOwnProperty(category)) {
    switch (category) {
      case OutsideCategories.park:
        return await ParkApi.getRecommendation(zipCode, weather);
      default:
        return {};
    }
  }

  switch (category) {
    case InsideCategories.streaming:
      return await streamingServices.map(
        async (streamingService) =>
          await getRecommendationForStreamingService(streamingService)
      );
    case InsideCategories.cooking:
      return await CookingApi.getRecommendation();
    case InsideCategories.reading:
      return await BookApi.getRecommendation();
    case InsideCategories.music:
      return await MusicApi.getRecommendation();
    case InsideCategories.poetry:
      return await PoetryApi.getRecommendation();
    case InsideCategories.cuteAnimal:
      return await getRandomItemFromArr(animalPictureApis).getRecommendation();
    case InsideCategories.reading:
      return await BookApi.getRecommendation();
    default:
      return {};
  }
}

async function getRecommendationForStreamingService(streamingService) {
  switch (streamingService) {
    // make real API calls
    case StreamingServices.netflix:
      return await NetflixApi.getRecommendation();
    case StreamingServices.hulu:
      return await HuluApi.getRecommendation();
    case StreamingServices.amazonPrime:
      return await AmazonPrimeApi.getRecommendation();
    case StreamingServices.disneyPlus:
      return await DisneyPlusApi.getRecommendation();
    default:
      return {};
  }
}
