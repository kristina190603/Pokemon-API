// Асинхронность, промисы и HTTP.  Домашняя работа

// Задание №1
// Создать программу - список покемонов.

// Пример:
// Bulbasaur
// Ivysaur
// Venusaur
// Charmander
// Charmeleon
// Charizard
// Squirtle
// … и т.п.

// При клике на имя покемона, показать рядом (в соседнем div-е) или во всплывающем
// окне информацию об этом покемоне, например:

// Имя: Charmeleon
// Тип: fire
// Рост: 11
// Вес: 190
// Изображение покемона (дополнительно)

// Указания:
// Список покемонов (первые 20 штук) получить через запрос к API:
// https://pokeapi.co/api/v2/pokemon/
// Информацию о каждом покемоне получать через запрос к API:
// https://pokeapi.co/api/v2/pokemon/{id}/
// где {id} - номер покемона
// Подсказка об используемых ключах результата
// (предположим что полученный объект у вас лежит в переменной result)
// Изображение: result.sprites.front_default
// Имя: result.name
// Тип: массив result.types. Из каждого элемента массива можно взять только type.name
// Рост: result.height
// Вес: result.weight

// Дополнительно:
// Используя ссылку на следующую страницу в результате (ссылку на API следующих
// результатов) реализовать пагинацию (постраничный вывод) в программе, т.е.:
// На клик по ссылке “Next” делать запрос на следующие 20 штук, заменять текущий список.
// Реализовать “Previous” и “Next” - возможность возвращаться на страницу ранее

// ПОКЕМОНЧИКИ

let app = document.querySelector('#app');
let modal = document.createElement('div');
let overlay = document.createElement('div');
modal.classList.add('modal');
overlay.classList.add('overlay');

let btnNextPage = document.createElement('button');
let btnPreviousPage = document.createElement('button');
btnNextPage.innerHTML = 'Next';
btnPreviousPage.innerHTML = 'Prev';
btnPreviousPage.style.visibility = 'hidden';
app.append(btnNextPage);
app.append(btnPreviousPage);

let pag = 0;
btnNextPage.addEventListener('click', () => {
  pag += 20;
  resaltPokemons(pag);
});
btnPreviousPage.addEventListener('click', () => {
  pag -= 20;
  if (pag < 0) {
    pag = 0;
  }
  resaltPokemons(pag);
});

let API = `https://pokeapi.co/api/v2/pokemon/?offset=${pag}&limit=20`;

fetch(API).then((data) =>
  data.json().then((info) => {
    info.results.forEach((pokemon) => {
      let div = document.createElement('div');
      div.classList.add('pokemon');
      div.innerHTML = pokemon.name;
      app.append(div);
      div.addEventListener('click', () => {
        fetch(pokemon.url).then((data) =>
          data.json().then((pokeinfo) => {
            modal.innerHTML = popupCard(pokeinfo);
          })
        );
        document.body.append(overlay);
        document.body.append(modal);
        overlay.addEventListener('click', () => {
          overlay.remove();
          modal.remove();
        });
      });
    });
  })
);

function popupCard(item) {
  return `
    <h2>${item.name}</h2>
    <ul>
      <li>Type: ${item.types[0].type.name}</li>
      <li>Height: ${item.height}</li>
      <li>Weight: ${item.weight}</li>
    </ul>
    <img src="${item.sprites.front_default}">
  `;
}

function resaltPokemons(pag) {
  let API = `https://pokeapi.co/api/v2/pokemon/?offset=${pag}&limit=20`;
  fetch(API).then((data) =>
    data.json().then((info) => {
      if (pag > info.count) {
        btnNextPage.style.visibility = 'hidden';
      } else btnNextPage.style.visibility = 'visible';
      if (pag == 0) {
        btnPreviousPage.style.visibility = 'hidden';
      } else btnPreviousPage.style.visibility = 'visible';
      let divs = document.querySelectorAll('.pokemon');
      divs.forEach((el) => {
        el.remove();
      });
      info.results.forEach((pokemon) => {
        let div = document.createElement('div');
        div.classList.add('pokemon');
        div.innerHTML = pokemon.name;
        app.append(div);
        div.addEventListener('click', () => {
          fetch(pokemon.url).then((data) =>
            data.json().then((pokeinfo) => {
              modal.innerHTML = popupCard(pokeinfo);
            })
          );
          document.body.append(overlay);
          document.body.append(modal);
          overlay.addEventListener('click', () => {
            overlay.remove();
            modal.remove();
          });
        });
      });
    })
  );
}

