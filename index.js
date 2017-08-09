'use strict';

import LanguageParser from './src/model/parser';
import CookieStorage from './src/controller/cookie';

// Initialize cookie support
let url = window.location.href;
let language = window.navigator.userLanguage || window.navigator.language;
let cookie = new CookieStorage(url, language);

// Initialize "localizer" object
window.localizer = {};
window.localizer.locale = cookie;

export default LanguageParser;