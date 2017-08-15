'use strict';

export default class DomParser {
    /**
     * @constructor
     * @param {HTMLElement} html 
     */
    constructor(html) {
        this.html = html;
    }

    /**
     * Adds 'localized' attribute if given Node is HTMLElement
     * @param {Node} element 
     * @returns {void} Adds 'localized' attribute to given element if set to true in .env
     */
    _addLocalized(element) {
        // Add 'localized' if set
        let addLocalized = process.env.ADD_LOCALIZED ? JSON.parse(process.env.ADD_LOCALIZED) : false;
        if (addLocalized && element instanceof HTMLElement) {
            element.setAttribute('localized', '');
        }
    }

    /**
     * Inserts given String into a sorted array
     * @param {String} string 
     * @param {Array.String} array Assumes this array is sorted
     * @returns {Array.String}
     */
    _addOrderedString(string, array) {
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
     * Iterates over text nodes for this HTML, uses given callback
     * @param {Function} callback
     * @returns {void} Mutations handled by given callback
     */
    _nodeIterator(callback) {
        let iter = document.createNodeIterator(this.html, NodeFilter.SHOW_TEXT);
        let node = iter.nextNode();

        while (node) {
            let ignoreable = ['html', 'script', 'noscript', 'style'];
            if (ignoreable.indexOf(node.parentElement.tagName.toLowerCase()) === -1) {
                callback(node);
            }
            node = iter.nextNode();
        }
    }

    /**
     * Trim down strings for comparison
     * @param {String} string 
     * @returns {String} Returns string stripped of extra spaces and lines
     */
    _trimString(string) {
        if (!string) {
            return '';
        }
        let text = string.replace(/(\r\n|\n|\r)/gm, '').trim();
        text = text.replace(/\s\s+/g, ' ').replace(/&nbsp;/gi, ''); // Replace longer spaces
        return text;
    }

    /**
     * Returns an array of text strings on HTML
     * @returns {Array.String}
     */
    getStrings() {
        let output = [];

        let self = this;
        let callback = function(node) {
            let string = self._trimString(node.nodeValue);
            if (string) {
                output = self._addOrderedString(string, output);
            }
        }
        this._nodeIterator(callback);

        console.log(output);
        return output;
    }

    /**
     * Handles replacing strings by parsing HTML once
     * @param {Object} json
     * @returns {void} Mutates text nodes and input objects
     */
    translateStrings(json) {
        // All text elements
        let self = this;
        let callback = function(node) {
            let trimmedNode = self._trimString(node.nodeValue);
            for (let key in json) {
                if (trimmedNode === key) {
                    self._addLocalized(node.parentElement);
                    node.nodeValue = node.nodeValue.replace(key, json[key]);
                }
            }
        }
        this._nodeIterator(callback);

        // Placeholders
        let placeholders = this.html.querySelectorAll('input, textarea');
        placeholders.forEach(function(placeholder) {
            for (let key in json) {
                placeholder.placeholder = placeholder.placeholder.replace(key, json[key]);
            }
        })
    }
}