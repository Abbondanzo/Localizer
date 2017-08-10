'use strict';

import Model from './src/model/model';
import View from './src/view/view';
import Controller from './src/controller/controller';

export default class LanguageParser {
    /**
     * 
     * @param {String} defaultLanguage 
     * @param {String} userLanguage
     * @param {Array} languages 
     * @param {HTMLElement} html 
     */
    constructor(defaultLanguage, userLanguage, languages, html) {
        this.defaultLanguage = defaultLanguage;
        this.userLanguage = userLanguage;
        this.languages = languages;
        this.html = html;
        this.init();
    }

    init() {
        let language = this.userLanguage ? this.userLanguage : this.defaultLanguage;
        let translationUrl = window.location.origin + '/translation/';
        let isDefault = language === this.defaultLanguage;
        let model = new Model(language, this.languages, null, translationUrl, this.defaultLanguage);
        let view = new View(model, this.html);
        let controller = new Controller(model, view);
    }
}