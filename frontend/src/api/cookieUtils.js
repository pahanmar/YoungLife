// Функция для установки cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Срок действия в днях
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; Secure; HttpOnly; SameSite=Strict`;
}

// При успешной авторизации
const userData = { id: 1, name: 'John Doe' }; // Пример данных пользователя
setCookie('user', JSON.stringify(userData), 7); // Сохраняем данные в cookie на 7 дней

// Функция для получения значения cookie по имени
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

// Извлекаем данные о пользователе
const userCookie = getCookie('user');
if (userCookie) {
  const user = JSON.parse(userCookie);
  console.log('Данные пользователя:', user);
} else {
  console.log('Пользователь не авторизован');
}

// Функция для удаления cookie
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; HttpOnly; SameSite=Strict`;
}

// При выходе из системы
deleteCookie('user');