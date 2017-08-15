'use strict';

import domparser from './domparser';

export default class View {
    /**
     * @constructor
     * @param {Model} model 
     * @param {HTMLElement} html 
     */
    constructor(model, html) {
        this.model = model;
        this.html = html;
    }

    /**
     * Returns the language to be used by the browser
     * @returns {String} language code
     */
    getLanguage() {
        return this.model.getLanguage();
    }

    /**
     * Returns an array of all strings found in HTML
     * @returns {Array.String}
     */
    getStrings() {
        let parser = new domparser(this.html);
        return parser.getStrings();
    }

    /**
     * Replaces the body with a JSON display of all translatable strings
     * @returns {void} Replaces HTML body with text Node strings found on page
     */
    showJson() {
        let body = this.html;
        let strings = this.getStrings();
        let jsonObject = {}
        strings.forEach(function(string) {
            jsonObject[string] = string;
        })
        body.innerHTML = '<pre>' + JSON.stringify(jsonObject, null, '\t') + '</pre>';
    }

    /**
     * Translates strings, measures time to completion
     * @param {Object} json 
     * @returns {void} Translates all strings found in given JSON, outputs time to completion in console
     */
    translateStrings(json) {
        let start = performance.now();
        let parser = new domparser(this.html);

        // domparser at work
        parser.translateStrings(json);

        let end = performance.now();
        let time = end && start ? ' in ' + (Math.round(100 * (end - start)) / 100).toString() + ' ms' : '';
        console.info('Translated from ' + Object.keys(json).length + ' strings' + time); // Log time and string count
    }
}