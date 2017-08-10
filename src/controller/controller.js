'use strict';

export default class Controller {
    /**
     * @constructor
     * @param {Model} model 
     * @param {View} view 
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.setLanguage();
        this.getJSON();
    }

    /**
     * If there is a language set by URL, update the model
     */
    setLanguage() {
        let url = window.location.href || '';
        // Check URL for language parameters
        let parameters = url.split('?')[1];
        if (parameters) {
            let language = parameters.split('language=')[1];
            language = language ? language.split('#')[0].split('&')[0] : ''
            if (language) {
                this.model.setLanguage(language)
            }
        }
    }

    /**
     * Check for format paramter in url
     */
    getJSON() {
        let url = window.location.href || '';
        if (url.indexOf('?format=strings') !== -1) {
            this.view.showJson();
        }
    }
}