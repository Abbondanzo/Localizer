'use strict';

import htmlparser from 'htmlparser2';

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

    getLanguage() {
        return this.model.getLanguage();
    }

    /**
     * Returns an array of all strings found in HTML
     */
    getStrings() {
        let html = this.html.innerHTML;
        let self = this;

        let strings = []

        let handler = new htmlparser.DomHandler(function(error, dom) {
            if (error) {
                console.warn(error.message);
            } else {
                strings = self._processDOM(dom);
            }
        })
        let parser = new htmlparser.Parser(handler);
        parser.write(html);
        parser.end();

        console.info('Found ' + strings.length + ' strings:', strings);

        return strings;
    }

    /**
     * Inserts given String into a sorted array
     * @param {String} string 
     * @param {Array} array Assumes this array is sorted
     */
    _addString(string, array) {
        if (array.length === 0) {
            array.push(string);
            return array;
        }
        for (let index = 0; index < array.length; index++) {
            if (string.localeCompare(array[index]) === 0) {
                return array;
            } else if (string.localeCompare(array[index]) < 0) {
                array.splice(index, 0, string);
                return array;
            }
        }
        array.push(string)
        return array;
    }



    /**
     * Processes JSON data and returns Array of text strings
     * @param {Array} domJSON Top-level DOM elements in Array format
     */
    _processDOM(domJSON) {
        var strings = []; // "let" causes scope issue within while loop

        var queue = domJSON;

        while (queue.length > 0) {
            // Get first element of the queue
            let current = queue.shift();

            // Add any children to the queue for processing
            let moreContent = current.type !== 'script' && current.type !== 'style' && current.name !== 'noscript';
            if (moreContent && current.children) {
                queue = queue.concat(current.children);
            }

            // Parsing only text items
            if (current.type === 'text' && current.data) {
                let text = current.data.replace(/(\r\n|\n|\r)/gm, '').trim();
                let trimmed = text.replace(/&nbsp;/gi, ''); // Removing non-string queries
                if (text && trimmed) {
                    strings = this._addString(text, strings);
                }
            }
        }

        return strings;
    }

    /**
     * Replaces the body with a JSON display of all translatable strings
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

    _translateStrings() {

    }
}