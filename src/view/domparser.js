'use strict';

export default class DomParser {
    /**
     * 
     * @param {HTMLElement} html 
     */
    constructor(html) {
        this.html = html;
    }

    /** DEPRECATED
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

    /** DEPRECATED
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

    /** DEPRECATED
     * Parses entire HTML document
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
        console.log(output);
        return output;
    }

    /** DEPRECATED
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
     * Handles replacing strings by parsing HTML once
     * @param {Object} json 
     */
    modElements(json) {
        let iter = document.createNodeIterator(this.html, NodeFilter.SHOW_TEXT);
        let node = iter.nextNode();

        while (node) {
            for (let key in json) {
                let ignoreable = ['html', 'script', 'noscript', 'style'];
                if (ignoreable.indexOf(node.parentElement.tagName) !== -1) {
                    continue;
                } else if (this._trimString(node.nodeValue) === key) {
                    node.nodeValue = node.nodeValue.replace(key, json[key]);
                }
            }
            node = iter.nextNode();
        }
    }

    /**
     * Parses single given HTML element, replacing all values with 
     * @param {Node} element 
     * @param {String} from 
     * @param {String} to 
     */
    _modify(element, from, to) {
        // Parse attributes
        let attributes = element.attributes;
        if (attributes && attributes.length > 0) {
            Object.keys(attributes).forEach(function(key) {
                let identifiers = ['alt', 'title', 'placeholder'];
                if (identifiers.indexOf(attributes[key].name) !== -1 && attributes[key].value === from) {
                    attributes[key].value = to;
                }
            })
        }

        // Checks HTML make-up
        if (this._trimString(element.innerHTML) === from) {
            element.innerHTML = element.innerHTML.replace(from, to);
            this._addLocalized(element);
        }

        // Checks child siblings
        if (element.firstChild) {
            let child = element.firstChild;
            while (child) {
                if (this._trimString(child.nodeValue) === from) {
                    child.nodeValue = child.nodeValue.replace(from, to);
                    this._addLocalized(element);
                }
                child = child.nextSibling;
            }
        }
    }

    /**
     * Adds 'localized' attribute if given Node is HTMLElement
     * @param {Node} element 
     */
    _addLocalized(element) {
        // Add 'localized' if set
        let addLocalized = process.env.ADD_LOCALIZED ? JSON.parse(process.env.ADD_LOCALIZED) : false;
        if (addLocalized && element instanceof HTMLElement) {
            element.setAttribute('localized', '');
        }
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