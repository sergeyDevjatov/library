const path = require('path');
const webpack = require('webpack');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        modules: [
            "node_modules"
        ],
        extensions: [
            '.js',
            '.jsx',
            '.css'
        ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'vue-router$': 'vue-router/dist/vue-router.esm.js',
            'socket.io$': 'socket.io/socket.io.js',
            'mongodb$': 'socket.io-client/dist/socket.io.js',
            'vee-validate$': 'vee-validate/dist/vee-validate.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles SASS to CSS
                }]
            },
            {
                test: /\.(less)$/,
                exclude: /(node_modules|bower_components|dist)/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.css$/,
                loaders: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|dist)/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            },
            {
                test: /\.js$/,
                loader: "source-map-loader",
                enforce: "pre"
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'underscore',
            underscore: 'underscore',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
        }),
        new MinifyPlugin()
    ]
};
