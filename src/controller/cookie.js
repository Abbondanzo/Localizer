'use strict';

import Cookies from 'js-cookie';

/**
 * Class for storing/maintaining locale cookies
 */
export default class CookieStorage {
    /**
     * @constructor
     * @param {String} url 
     * @param {String} browserLanguage 
     */
    constructor(url, browserLanguage) {
        this.url = url;
        this.browserLanguage = browserLanguage;
        this.init();
    }

    /**
     * Initialize cookie object
     */
    init() {
        // Check for existing cookie
        let existingCookie = this.getCookie();
        if (!existingCookie && this.browserLanguage) {
            this.setCookie(this.browserLanguage);
        }

        // Check URL for language parameters
        let parameters = this.url.split('?')[1];
        if (parameters) {
            let language = parameters.split('language=')[1];
            language = language ? language.split('#')[0].split('&')[0] : ''
            if (language && this.getCookie() !== language) {
                this.setCookie(language);
            }
        }
    }

    /**
     * Returns cookie locale (if it exists)
     */
    getCookie() {
        let cookie = Cookies.get('locale');
        if (cookie) {
            return cookie;
        }
    }

    /**
     * Set the language locale via Cookies
     * @param {String} language 
     */
    setCookie(language) {
        Cookies.set('locale', language);
    }

    /**
     * Remove the existing language cookie
     */
    deleteCookie() {
        let cookie = Cookies.get('locale');
        if (cookie) {
            Cookies.remove('locale');
        }
    }
}