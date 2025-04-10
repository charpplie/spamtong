"use strict";

const fs = require('fs');
const path = require('path');

function processTSVFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');

    const lines = data.split('\n');

    const translations = {};

    const [header, ...rest] = lines;
    const languages = header.trim().split('\t').slice(1);

    languages.forEach(language => {
        translations[language] = {};
    });

    rest.forEach(line => {
        const [key, ...values] = line.trim().split('\t');

        if (!key || values.length === 0) return;

        values.forEach((translation, index) => {
            const lang = languages[index];
            const [parentKey, childKey] = key.split('.');
            if (!translations[lang][parentKey]) {
                translations[lang][parentKey] = {};
            }
            translations[lang][parentKey][childKey] = translation;
        });
    });

    return translations;
}

function writeToJSONFiles(translations) {
    Object.keys(translations).forEach(lang => {
        const filePath = path.join(__dirname, 'locales', `${lang}.json`);

        const content = JSON.stringify(translations[lang], null, 2);

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Translations for ${lang} language written to ${filePath}`);
    });
}

function processAndWriteTranslations(tsvFilePath) {
    try {
        const translations = processTSVFile(tsvFilePath);
        writeToJSONFiles(translations);
    } catch (error) {
        console.error('Error processing translations:', error);
    }
}

const tsvFilePath = 'loc.tsv';
processAndWriteTranslations(tsvFilePath);