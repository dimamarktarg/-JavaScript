"use strict";

// Выбор html элементов
const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const a = `<a href='#'>Вернуться на главную</a>`;

// Oтображать страну
const displayCountry = function (data, className = "") {
  const currencies = data.currencies;
  const currencyName = Object.values(currencies)[0].name;
  const currencySymbol = Object.values(currencies)[0].symbol;
  const languages = data.languages;
  const firstLanguage = Object.values(languages)[0];

  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.svg}"/>
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👨‍👩‍👧‍👦</span>${(
          +data.population / 1000000
        ).toFixed(1)} millions</p>
        <p class="country__row"><span>🗣️</span>${firstLanguage}</p>
        <p class="country__row"><span>💰</span>${currencySymbol} ${currencyName}</p>
      </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};

const convertToJSON = (response) => {
  console.log(response);
  if (!response.ok)
    throw new Error(
      `Ошибка № ${response.status}. Запрошенная страница не найдена`
    );
  return response.json();
};

const displayError = (message) => {
  countriesContainer.insertAdjacentText("beforeend", message);
  btn.innerHTML = a;
  countriesContainer.style.opacity = 1;
};

const getCountryData = async function (countryName) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    const [data] = await convertToJSON(response);
    displayCountry(data);
    if (!data.borders) throw new Error("Соседних стран не найдено!");
    const firstNeighbour = data.borders[0];
    const response2 = await fetch(
      `https://restcountries.com/v3.1/alpha/${firstNeighbour}`
    );
    const [data2] = await convertToJSON(response2);
    displayCountry(data2, "neighbour");
  } catch (e) {
    displayError(`Что-то пошло не так! ${e.message}`);
    // Отклоняем promisse, возвращаемое из асинхронной функции
    throw e;
  } finally {
    countriesContainer.style.opacity = 1;
  }
};

btn.addEventListener("click", function () {
  console.log("Button click");
  getCountryData("ukraine");
  navigator.geolocation.getCurrentPosition(
    (position) => console.log(position),
    (err) => console.log(err)
  );
});
