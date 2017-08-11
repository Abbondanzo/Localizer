'use strict';

import Model from './src/model/model';
import View from './src/view/view';
import Controller from './src/controller/controller';

export default class LanguageParser {
    /**
     * @constructor
     * @param {String} userLanguage
     * @param {HTMLElement} html 
     */
    constructor(userLanguage, html) {
        this.userLanguage = userLanguage;
        this.html = html;
        this.init();
    }

    init() {
        let config = {
            defaultLanguage: process.env.DEFAULT_LANGUAGE,
            languages: process.env.LANGUAGES,
            translationUrl: process.env.TRANSLATION_URL
        }

        // Throw an error if the configuration file is not set up properly
        Object.keys(config).forEach(function(key) {
            if (!config[key]) {
                throw new Error('Issue with your configuration file');
            }
        });

        let language = this.userLanguage ? this.userLanguage : config.defaultLanguage;
        let isDefault = language === config.defaultLanguage;
        let model = new Model(language, config.languages, null, config.translationUrl, config.defaultLanguage);
        let view = new View(model, this.html);
        let controller = new Controller(model, view);
    }
}