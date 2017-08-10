'use strict';

import Cookies from 'js-cookie';

/**
 * Class for storing/maintaining locale cookies
 */
export default class CookieStorage {
    /**
     * @constructor
     * @param {String} defaultLanguage 
     */
    constructor(defaultLanguage) {
        let cookie = Cookies.get('locale');
        if (!cookie && arguments.length > 0) {
            this.setCookie(defaultLanguage);
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