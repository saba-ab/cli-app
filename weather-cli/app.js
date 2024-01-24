#! /usr/bin/env node

const axios = require("axios");
const { Command } = require("commander");
const program = new Command();

const cityInstance = axios.create({
  baseURL: `https://api.weatherapi.com/v1/current.json?key=6d210d800ff040bc960184527242301&q=`,
});

const getWeatherByCity = async (city, type) => {
  try {
    let result = {};
    const response = await cityInstance.get(city);
    const res = response.data.current;
    if (type === "temp") {
      result = `Temperature in ${city} - ${res.temp_c} C`;
    } else if (type === "hum") {
      result = `Humidity in ${city} - ${res.humidity}`;
    } else if (type === "cloud") {
      result = `Cloud in ${city} - ${res.cloud}`;
    } else {
      result = res;
    }
    return result;
  } catch (err) {
    console.log(err);
  }
};
program.version("1.0.0");
program
  .command("show <city> [type]")
  .description("get weather info by city")
  .action(async (city, type) => {
    const data = await getWeatherByCity(city, type);
    console.log(data);
  });

program.parse(process.argv);
