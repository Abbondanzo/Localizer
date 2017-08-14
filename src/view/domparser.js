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
        let self = this;

        let predicate = function(element) {
            self._trimString(element.innerHTML) === text;
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
        let self = this;

        let predicate = function(element) {
            let output = false;
            // Checks for text in attributes
            let attributes = element.attributes;
            if (attributes && attributes.length > 0) {
                Object.keys(attributes).forEach(function(key) {
                    let identifiers = ['alt', 'title', 'placeholder'];
                    if (identifiers.indexOf(attributes[key].name) !== -1) {
                        output = output || text === attributes[key].value;
                    }
                })

            }

            // Checks HTML make-up
            output = output || self._trimString(element.innerHTML) === text;

            // Checks on siblings/multi-part elements
            let child = element.firstChild;
            while (child) {
                output = output || self._trimString(child.textContent) === text;
                child = child.nextSibling;
            }

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
        let self = this;
        elementsToTranslate.forEach(function(elem) {
            // Checks innerHTML
            if (self._trimString(elem.innerHTML) === from) {
                elem.innerHTML = to;
            }
            // Checks child siblings
            if (elem.firstChild) {
                let child = elem.firstChild;
                let shouldModify = false;
                while (child) {
                    if (self._trimString(child.nodeValue) === from) {
                        child.nodeValue = child.nodeValue.replace(from, to);
                    }
                    child = child.nextSibling;
                }
            }
            // Checks attributes
            if (elem.attributes && elem.attributes.length > 0) {
                let attributes = elem.attributes;
                Object.keys(attributes).forEach(function(key) {
                    let identifiers = ['alt', 'title', 'placeholder'];
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

    /**
     * Trim down strings for comparison
     * @param {String} string 
     */
    _trimString(string) {
        if (!string) {
            return '';
        }
        let text = string.replace(/(\r\n|\n|\r)/gm, '').trim();
        text = text.replace(/\s\s+/g, ' ').replace(/&nbsp;/gi, ''); // Replace longer spaces
        return text;
    }
}