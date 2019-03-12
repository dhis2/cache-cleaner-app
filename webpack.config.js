var webpack = require('webpack');
var path = require('path');

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
            },
            {
                test: require.resolve("i18next"),
                loader: "expose?i18next"
            },
            {
                test: require.resolve("jquery"),
                loader: "expose?jQuery"
            },
            {
                test: require.resolve("jquery"),
                loader: "expose?window.jQuery"
            },
            {
                test: require.resolve("jquery"),
                loader: "expose?$"
            },
            {
                test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file-loader'
            },
        ],
    },
    plugins: [
        new webpack.EnvironmentPlugin(['REACT_APP_DHIS2_BASE_URL']),
        new webpack.optimize.DedupePlugin(),
    ],
    devtool: ['sourcemap'],
    devServer: {
        contentBase: '.',
        progress: true,
        colors: true,
        port: 3000,
        inline: true,
    },
};
