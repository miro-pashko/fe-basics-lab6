// Лабораторна робота №6, варіант 11
// Порядок виведення (рядки таблиці 2: 1, 4, 5, 2, 6):
// picture, city, country, name, postcode

const API_URL = "https://randomuser.me/api/?results=5";

const button = document.getElementById("download-btn");
const statusEl = document.getElementById("status");
const usersEl = document.getElementById("users");

// Повний набір полів варіанту 11 у потрібному порядку
const fields = [
    { key: "picture", render: renderPicture },
    { key: "city", label: "City", get: function (u) { return u.location.city; } },
    { key: "country", label: "Country", get: function (u) { return u.location.country; } },
    { key: "name", label: "Name", get: function (u) {
        return u.name.title + " " + u.name.first + " " + u.name.last;
    } },
    { key: "postcode", label: "Postcode", get: function (u) { return u.location.postcode; } }
];

function renderPicture(user, card) {
    const img = document.createElement("img");
    img.src = user.picture.large;
    img.alt = "Фото: " + user.name.first + " " + user.name.last;
    card.appendChild(img);
}

function renderText(field, user, card) {
    const p = document.createElement("p");
    // textContent — дані з API ніколи не вставляються як HTML
    p.textContent = field.label + ": " + field.get(user);
    card.appendChild(p);
}

// Створює картку одного користувача
function createCard(user) {
    const card = document.createElement("article");
    card.className = "user-card";

    fields.forEach(function (field) {
        if (field.render) {
            field.render(user, card);
        } else {
            renderText(field, user, card);
        }
    });

    return card;
}

function setStatus(text, isError) {
    statusEl.textContent = text;
    statusEl.classList.toggle("error", Boolean(isError));
}

// Завантаження даних: fetch повертає Promise, далі ланцюжок .then()
function loadUsers() {
    button.disabled = true;
    setStatus("Завантаження...", false);

    fetch(API_URL)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Сервер відповів зі статусом " + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            usersEl.replaceChildren();
            data.results.forEach(function (user) {
                usersEl.appendChild(createCard(user));
            });
            setStatus("Успішно!", false);
        })
        .catch(function (error) {
            setStatus("Не вдалося отримати дані: " + error.message, true);
        })
        .finally(function () {
            button.disabled = false;
        });
}

button.addEventListener("click", loadUsers);
