'use strict';

export default class DomParser {
    /**
     * 
     * @param {HTMLElement} html 
     */
    constructor(html) {
        this.html = html;
    }

    /**
     * Returns array of elements that contain given string in innerHTML
     * @param {String} text 
     * @returns {Array.HTMLElement}
     */
    matchText(text) {
        let body = this.html;

        let predicate = function(element) {
            console.log(element.attributes);
            return element.innerHTML === text;
        }

        return this._parseElements(predicate, body);
    }

    /**
     * Returns array of elements that contain given string in innerHTML or attributes
     * @param {String} text 
     * @returns {Array.HTMLElement}
     */
    matchTranslate(text) {
        let body = this.html;

        let predicate = function(element) {
            let output = false;
            // Checks for text in attributes
            let attributes = element.attributes;
            if (attributes && attributes.length > 0) {
                Object.keys(attributes).forEach(function(key) {
                    let identifiers = ['alt', 'title'];
                    if (identifiers.indexOf(attributes[key].name) !== -1) {
                        output = output || text === attributes[key].value;
                    }
                })

            }
            // Checks for text in displayed text
            output = output || element.innerHTML === text;

            return output;
        }
        return this._parseElements(predicate, body);
    }

    /**
     * 
     * @param {Function} pred Predicate function
     * @param {HTMLElement} html 
     * @returns {Array.HTMLElement}
     */
    _parseElements(pred, html) {
        var queue = [];
        queue.push(html);

        // Builds a list of elements
        let output = [];

        while (queue.length > 0) {
            let currentElement = queue.shift(); // Gets first element
            let ignorable = ['script', 'noscript', 'style'].indexOf(currentElement.tag) !== -1;
            if (ignorable) {
                continue; // Skip past script, noscript, and style elements
            }
            if (pred(currentElement)) {
                output.push(currentElement);
            }
            if (currentElement.childNodes) {
                let children = Array.prototype.slice.call(currentElement.childNodes);
                queue = queue.concat(children);
            }
        }

        return output;
    }

    /**
     * Replaces attributes and innerHTML of all matching elements to given from value
     * @param {String} from 
     * @param {String} to 
     */
    replaceTranslations(from, to) {
        let elementsToTranslate = this.matchTranslate(from);
        let addLocalized = process.env.ADD_LOCALIZED ? JSON.parse(process.env.ADD_LOCALIZED) : false;
        elementsToTranslate.forEach(function(elem) {
            if (elem.innerHTML === from) {
                elem.innerHTML = to;
            } else if (elem.attributes && elem.attributes.length > 0) {
                let attributes = elem.attributes;
                Object.keys(attributes).forEach(function(key) {
                    let identifiers = ['alt', 'title'];
                    let toChange = identifiers.indexOf(attributes[key].name) !== -1 &&
                        attributes[key].value === from;
                    if (toChange) {
                        attributes[key].value = to;
                    }
                })

            }
            // Localized tag
            if (addLocalized) {
                elem.setAttribute('localized', '');
            }
        });
    }
}