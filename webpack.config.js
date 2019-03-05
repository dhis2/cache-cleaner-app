var webpack = require('webpack');
var path = require('path');

var proxyTarget = 'http://localhost:8080/dhis';

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
    ],
    devtool: ['sourcemap'],
    devServer: {
        contentBase: '.',
        progress: true,
        colors: true,
        port: 3000,
        inline: true,
        proxy: [
            {
                context: ['/api/**', '/dhis-web-commons/**', '/dhis-web-core-resource/**', '/icons/**', '/dhis-web-capture/**'],
                target: proxyTarget,
                secure: false,
                bypass: function(req) {
                    req.headers.Authorization = 'Basic c3lzdGVtOlN5c3RlbTEyMw==';
                },
            },
        ],
    },
};
