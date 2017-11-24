const path = require('path');
const webpack = require('webpack');

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
            'socket.io$': 'socket.io-client/dist/socket.io.js',
            'mongodb$': 'socket.io-client/dist/socket.io.js',
            'vee-validate$': 'vee-validate/dist/vee-validate.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, 'sass-loader' ]
            },
            {
                test: /\.(less)$/,
                exclude: /(node_modules|bower_components|dist)/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
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
        })
    ]
};
