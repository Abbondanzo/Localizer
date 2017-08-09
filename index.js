'use strict';

import LanguageParser from './src/model/parser';
import CookieStorage from './src/controller/cookie';

let url = window.location.href;
let language = window.navigator.userLanguage || window.navigator.language;
let cookie = new CookieStorage(url, language);

window.localizer = {};
window.localizer.locale = cookie;

export default LanguageParser;