const path = require("path");
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        //app: ["webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server", "./src/main.js"]
        app: ["./src/main.js"]
    },
    output: {
        path: path.resolve(__dirname, "build/"),
        publicPath: "/",
        filename: "js/bundle.js"
    },

    // The setup may be problematic on certain versions of Windows, Ubuntu, and Vagrant.
    // We can solve this through polling:
    watchOptions: {
        // Delay the rebuild after the first change
        aggregateTimeout: 300,
        // Poll using interval (in ms, accepts boolean too)
        poll: 1000
    },

    devServer: {
        contentBase: "build/",
        publicPath: "/",

        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        //historyApiFallback: true,

        // Unlike the cli flag, this doesn't set
        // HotModuleReplacementPlugin!
        hot: true,
        inline: true,

        /*proxy: {
            '/ajax/*': 'http://your.backend/'
        },*/

        stats: { colors: true }
    },

    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /.jsx?$/,
                //loader: 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react,plugins[]=transform-decorators-legacy',
                loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react,plugins[]=transform-decorators-legacy'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader', ExtractTextPlugin.extract('css!sass')],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        root: __dirname,
        extensions: ["", ".js", ".jsx", ".css", ".scss"]
    },
    plugins: [
        // Enable multi-pass compilation for enhanced performance
        // in larger projects. Good default.
        new webpack.HotModuleReplacementPlugin({
            multiStep: true
        }),

        new webpack.NoErrorsPlugin(),

        new ExtractTextPlugin('css/main.css', {
            allChunks: true
        })
    ]
};
