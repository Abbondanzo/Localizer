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
     * @returns {String}
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * @returns {Object}
     */
    getTranslation() {
        return this.translation;
    }

    /** 
     * Get translation of website
     * @returns {Promise}
     */
    async loadTranslation() {
        return this._setTranslation();
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
     * @returns {Promise}
     */
    async _setTranslation() {
        let language = this.currentLanguage;
        let url = this._translationUrl + language + '.json';
        let translation = this.translation;
        console.info('Loading translation...');

        let axiosConfig = {
            method: 'GET',
            url: url,
            responseType: 'json'
        }

        // Include headers
        let headers = process.env.HEADERS ? JSON.parse(process.env.HEADERS) : {};
        if (headers && Object.keys(headers).length > 0) {
            axiosConfig.headers = headers;
        }

        // Success function
        let success = function(response) {
            console.info('Loaded translation successfully');
            if (response.data) {
                translation = response.data;
            }
            return response.data;
        }

        // Failure function
        let failure = function(error) {
            throw error;
        }

        // Place XML request
        let request = axios(axiosConfig).then(success).catch(failure);

        return request;
    }
}