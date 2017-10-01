const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: {
        main: './index.tsx',
        adapter: './adapter.js',
        vendor: ['react', 'react-dom']
    },
    devtool: "source-map",
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader",
                options: {
                    useBabel: true,
                },
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hivemind',
            template: './index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
        })
    ]
};