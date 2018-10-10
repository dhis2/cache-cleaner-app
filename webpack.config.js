var webpack = require('webpack');
var path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const isDevBuild = process.argv[1].indexOf('webpack-dev-server') !== -1;
const dhisUrlPrefix =  isDevBuild ? '..' : '../../..';
var proxyTarget = 'http://localhost:8085';
const baseApiUrl = dhisUrlPrefix+"/api";

function makeLinkTags(stylesheets) {
    return function (hash) {
        return stylesheets
            .map(([url, attributes]) => {
                const attributeMap = Object.assign({ media: 'screen' }, attributes);

                const attributesString = Object
                    .keys(attributeMap)
                    .map(key => `${key}="${attributeMap[key]}"`)
                    .join(' ');

                return `<link type="text/css" rel="stylesheet" href="${url}?_=${hash}" ${attributesString} />`;
            })
            .join(`\n`);
    };
}

module.exports = {
    context: __dirname,
    entry: './scripts/index.js',
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/(node_modules)/],
                loader: 'babel',
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            }
        ],
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new HTMLWebpackPlugin({
            template: './index.ejs',
            BASEURL: `${dhisUrlPrefix}`,
            BASEAPIURL: `${baseApiUrl}`,
            stylesheets: makeLinkTags([
                [`${dhisUrlPrefix}/dhis-web-core-resource/bootstrap/3.0.2/css/bootstrap.min.css`],
                [`${dhisUrlPrefix}/dhis-web-core-resource//fonts/roboto.css`],
                [`${dhisUrlPrefix}/his-web-core-resource/fontawesome/4.7.0/css/font-awesome.min.css`],
                [`${dhisUrlPrefix}/dhis-web-core-resource/dhis/css/widgets-2318061e45.css`],
            ]),
            vendorScripts: [
                `${dhisUrlPrefix}/dhis-web-core-resource/jquery/1.8.2/jquery.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/jquery.ui/1.11.4/jquery-ui.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/jquery-plugin/jquery-719d66b53f.plugin.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/bootstrap/3.0.2/js/bootstrap.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/angularjs/1.3.15/angular.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/angularjs/1.3.15/angular-resource.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/angularjs/1.3.15/angular-route.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/angularjs/1.3.15/angular-cookies.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/angularjs/1.3.15/angular-sanitize.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/angularjs/1.3.15/angular-animate.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/angular.bootstrap/0.13.0/ui-bootstrap.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/angular.bootstrap/0.13.0/ui-bootstrap-tpls.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/angular-plugins/angularLocalStorage-12a21d2dab.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/i18next/10.0.7/i18next.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/ng-i18next/1.0.5/dist/ng-i18next.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/dhis/dhis2-util-1554e6a5ab.js`,
                'app.js',
                `${dhisUrlPrefix}/dhis-web-core-resource/react-15/react-15.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/rxjs/4.1.0/rx.lite.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/lodash/4.15.0/lodash.min.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/lodash-functional/lodash-functional.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/babel-polyfill/6.20.0/dist/polyfill.js`,
                `${dhisUrlPrefix}/dhis-web-core-resource/d2-ui/25.5.4/dist/header-bar.js`,
            ].map(script => {
                console.log(script);
                if (Array.isArray(script)) {
                    return (`<script ${script[1]} src="${script[0]}"></script>`);
                }
                return (`<script src="${script}"></script>`);
            })
            .join("\n")
        }),
    ],
    devtool: ['sourcemap'],
    devServer: {
        contentBase: '.',
        progress: true,
        colors: true,
        port: 8082,
        inline: true,
        proxy: [
            {
                context: ['/api/**', '/dhis-web-commons/**', '/dhis-web-core-resource/**', '/icons/**'],
                target: proxyTarget,
                secure: false,
                bypass: function(req) {
                    req.headers.Authorization = 'Basic YWRtaW46ZGlzdHJpY3Q=';
                },
            },
        ],
    },
};
