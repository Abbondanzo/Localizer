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

## Deployment
Before deploying, be sure to rename your `.env.example` file to `.env`. Otherwise, an error will be thrown when building your project.

```bash
# Compiles source files into the public/ folder
npm run build
```

Project still in progress. Documentation will be updated to reflect changes. 
