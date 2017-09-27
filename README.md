# Localizer
Open-source project made to accelerate your web localization process. Simple tooling to help you get started.

## Installation
This project uses [Node/NPM](https://nodejs.org/en/) and relies heavily on [Babel](https://babeljs.io/) and [Webpack](https://webpack.github.io/) for compiling. 
```bash
# Installs all dependencies
npm install
```

## Configuration
Global variables are stored in the `.env` file to follow [The Twelve-Factor App](http://12factor.net/config) methodology. An example `.env.example` file is included with the required and optional variables separated. When you are ready to compile your code, rename this file to `.env` and you can deploy. Your application will throw errors if this file is not loaded correctly. 
<!--- table -->
|Variable|Type|Description|
|-|-|-|
|DEFAULT_LANGUAGE|String|The default language of your site. Languages are based on the [ISO 639-1 standard](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for language codes.|
|LANGUAGES|Array.String|An array of all supported languages (in String format). Use the ISO 639-1 standard mentioned above.|
|TRANSLATION_URL|String|The default URL to use when querying for translations.|
|HEADERS|Object|Specify your own header details for sending a request to receive translations. **WARNING:** These details are not secured.|
|ADD_LOCALIZED|Boolean|If true, adds "localized" attribute to every HTML element that is translated.

### Changing Languages
A language is set or changed using the `?language=` parameter in browser. On any page that loads this script, a cookie will also be stored (called `locale`) that stores the user's preferred language up to 24 hours from their last visit. If no language is set using the `language` parameter, the user's default locale will be used instead. 

For example: If my locale was `en-US` and I want a German `de` translation on my site `http://www.example.com/`, I will go to `http://www.example.com/?language=de` and my site will be translated into German until I close out of my browser and wait 24 hours from my last visit.

If no translation is given for a particular string on a page, it will be left as-is. If a particular string exists in more than place, it will be given the same translation from your translation file. There is no need to translate the same string twice, but strings are case-sensitive.

The `title` and `alt` attributes will also be translated by default (TODO: ...and can be turned off using env variable...)

### Getting Page as JSON Data
For fast and easy translation, you can grab all text on a particular page by appending `?format=string` anywhere in the URL (e.g. `http://example.com/?format=string` will show JSON data of all translatable strings on `http://example.com`). Note that this will not output strings contained inside `<script>`, `<noscript>`, and `<style>` tags.

This will display page data in a `"key": "value"` format, where the key is the text that defaults on the page and the value is the key that a user may wish to translate to.

### Translation Files
Every translation file you wish to source should be contained within the same folder and in a `language-code.json` format (e.g. `es.json` for Spanish). When a particular language is requested using the `language?=` parameter, the value given must match that of the filename that contains a translation. 

If you wish to use custom naming conventions, you may do so. This means that `?language=apple-pie` will attempt translate the page using a file called `apple-pie.json` from your specified directory.

A translation file is a simple JSON data format, where the key represents the text on the page to be translated, and the value represents the custom translation for that string. The translation file does not need to have full coverage of text elements on a page.

For example, if I wanted to use the following:
```json
{
    "random text": "super awesome text"
} 
```
This translation JSON data will simply replace every instance of the text `random text` with `super awesome text` and nothing else. JSON keys are also case-sensitive, which means that `Random text` will not be translated to `Super awesome text` unless explicitly specified.

### Cross-Origin Resource Sharing
JSON file access must abide by the [CORS standard](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS), which means that your translation files must follow same-origin policy unless your server is configured otherwise. Files are requested via `XMLHttpRequest`.

## Deployment
Before deploying, be sure to rename your `.env.example` file to `.env`. Otherwise, an error will be thrown when building your project.

```bash
# Compiles source files into the public/ folder
npm run build
```

## Usage
After you compile your app to `public/app.js`, you then need to build a new `LanguageParser` object in your page. It takes an ISO 639-1 code and the HTMLElement you wish to translate (Note: this code should be placed at the end of your page, just before the closing `</body>` tag). Most modern browsers will store the user's preferred ISO code in the `window.navigator.userLanguage` or `window.navigator.language`. You should use the following as a reference:

```html
<script type="text/javascript" src="public/app.js"></script>
<script type="text/javascript">
    var html = document.querySelector('html');
    var LanguageParser = LanguageParser.default;
    var userLocale = window.navigator.userLanguage || window.navigator.language || 'en-US'; // 'en-US' is a fallback in case no language is specified
    window.LanguageParser = new LanguageParser(userLocale, html);
</script>
```

See [index.html](/index.html) as a reference.

Project still in progress. Documentation will be updated to reflect changes. If you run into any issues, please submit an issue [here](../../issues).
