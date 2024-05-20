"use strict";

const fs = require('fs');
const path = require('path');

// Функция для чтения .tsv файла и обработки его содержимого
function processTSVFile(filePath) {
  // Считываем содержимое .tsv файла
  const data = fs.readFileSync(filePath, 'utf8');

  // Разделяем содержимое на строки
  const lines = data.split('\n');

  // Создаем объект, в котором будем хранить переводы по языкам
  const translations = {};

  // Получаем заголовок файла (названия языков)
  const [header, ...rest] = lines;
  const languages = header.trim().split('\t').slice(1);

  // Проходимся по каждому языку и создаем пустой объект переводов
  languages.forEach(language => {
    translations[language] = {};
  });

  // Проходимся по каждой строке, начиная со второй строки
  rest.forEach(line => {
    // Разделяем строку по табуляции
    const [key, ...values] = line.trim().split('\t');

    // Пропускаем строки, если нет ключа или значений
    if (!key || values.length === 0) return;

    // Проходимся по каждому языку и сохраняем перевод
    values.forEach((translation, index) => {
      const lang = languages[index]; // Получаем язык из заголовка
      const [parentKey, childKey] = key.split('.');
      if (!translations[lang][parentKey]) {
        translations[lang][parentKey] = {};
      }
      translations[lang][parentKey][childKey] = translation;
    });
  });

  return translations;
}

// Функция для записи переводов в JSON файлы
function writeToJSONFiles(translations) {
  // Проходимся по каждому языку
  Object.keys(translations).forEach(lang => {
    // Формируем путь к файлу для текущего языка
    const filePath = path.join(__dirname, 'locales', `${lang}.json`);
    // Содержимое для записи в файл
    const content = JSON.stringify(translations[lang], null, 2);
    // Записываем содержимое в файл
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Translations for ${lang} language written to ${filePath}`);
  });
}

// Основная функция для обработки .tsv файла и записи переводов в JSON файлы
function processAndWriteTranslations(tsvFilePath) {
  try {
    const translations = processTSVFile(tsvFilePath);
    writeToJSONFiles(translations);
  } catch (error) {
    console.error('Error processing translations:', error);
  }
}

// Пример использования:
const tsvFilePath = 'loc.tsv'; // Путь к .tsv файлу
processAndWriteTranslations(tsvFilePath);