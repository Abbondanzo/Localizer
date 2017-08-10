'use strict';

import axios from 'axios';
import CookieStorage from './cookie';

export default class Model {
    /**
     * @constructor
     * @param {String} currentLanguage 
     * @param {Array} languages 
     * @param {Object} translation 
     * @param {String} _translationUrl
     */
    constructor(currentLanguage, languages, translation, _translationUrl) {
        this.currentLanguage = currentLanguage;
        this.languages = languages;
        this.translation = translation;
        this._translationUrl = _translationUrl;

        if (arguments.length > 0) {
            this.init();
        }
    }

    /**
     * Initialize model with cookie
     */
    init() {
        let cookie = new CookieStorage(this.currentLanguage);
        this.currentLanguage = cookie.getCookie();
    }

    /**
     * Return the current language
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /** 
     * Get translation of website
     */
    getTranslation() {
        return this.translation;
    }

    /**
     * Set language
     * @param {String} language 
     */
    setLanguage(language) {
        if (language !== this.currentLanguage) {
            let cookie = new CookieStorage();
            cookie.setCookie(language);
            this.currentLanguage = language;
        }
    }

    _setTranslation() {
        let url = this._translationUrl;
    }
}