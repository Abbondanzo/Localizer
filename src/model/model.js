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
     * @param {String} defaultLanguage Is the current language the default language
     */
    constructor(currentLanguage, languages, translation, _translationUrl, defaultLanguage) {
        this.currentLanguage = currentLanguage;
        this.languages = languages;
        this.translation = translation;
        this._translationUrl = _translationUrl;
        this.defaultLanguage = defaultLanguage;

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
    async getTranslation() {
        if (!this.translation) {
            return this._setTranslation();
        } else {
            return this.translation;
        }
    }

    /**
     * Returns true if the current language is the default language
     */
    isDefault() {
        return this.currentLanguage === this.defaultLanguage;
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
            this._setTranslation();
        }
    }

    /**
     * Asynchronous request to get translation data
     */
    async _setTranslation() {
        let language = this.currentLanguage;
        let url = this._translationUrl + language + '.json';
        let translation = this.translation;
        let request = axios({
                method: 'get',
                url: url,
                responseType: 'json'
            })
            .then(function(response) {
                console.info('Loaded translation successfully');
                if (response.data) {
                    translation = response.data;
                }
                return response.data;
            })
            .catch(function(error) {
                throw new Error('Problem finding translation: ', error.message);
            });
        return request;
    }
}