/**
 * Created by Administrator on 2017/5/9.
 */
var htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var jquery = require('jquery')
var path = require('path')
var webpack = require('webpack');
var ImageminPlugin = require('imagemin-webpack-plugin').default
var CopyWebpackPlugin = require('copy-webpack-plugin')
var PreloadWebpackPlugin = require('preload-webpack-plugin')
var CompressionPlugin = require("compression-webpack-plugin");
var SpritesmithPlugin = require('webpack-spritesmith');
module.exports = {
    entry: {
        app: './src/app.js',
        anothor: './src/anothor.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js'

    },
    module: {
        rules: [
            {
                test: /\.js/,
                // enforce: "pre",
                loader: 'babel-loader',
                include: __dirname + '/src',
            },
            {
                test: /\.html$/,
                loader: 'html-loader'

            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'

            },
            {
                test: /\.styl(us)?$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: 'stylus-loader'
                        },
                    ],
                    fallback: 'style-loader',
                }),
            },
            // {
            //     test: /\.(scss|css)$/,
            //     use: ExtractTextPlugin.extract({
            //         use:[
            //             {
            //                 loader: 'css-loader',
            //                 options:{
            //                     modules:true,
            //                     importLoaders:1,
            //                     localIdentName:'[local]'
            //                 },
            //             },
            //             {
            //                 loader:'sass-loader',
            //                 options:{
            //                     plugins: function () {
            //                             return [
            //                                 require('autoprefixer')
            //                             ];
            //                         }
            //                 },
            //             },
            //         ],
            //         fallback: 'style-loader',
            //     }),
            // },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    'url-loader?limit=20&name=assets/[name].[ext]',
                    'image-webpack-loader'
                ],
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body',
            minify: false
        }),
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: false,
            allChunks: true,
        }),
        new webpack.ProvidePlugin({

            $: "jquery",

            jQuery: "jquery",

            "window.jQuery": "jquery"

        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        }),
        // new CopyWebpackPlugin([{
        //     from: 'src/assets/'
        // }]),
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== 'production', // Disable during development
            pngquant: {
                quality: '70'
            },
            test: /\.(jpe?g|png|gif|svg)$/i
        }),
        //抽取公共代码 或者引入的js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/vendor.[hash].js',
            minChunks(module) {
                return module.context &&
                    module.context.indexOf('node_modules') >= 0;
            }
        }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            as: 'script',
            include: 'all',
            fileBlacklist: [/\.(css|map)$/]
        }),
        // new webpack.optimize.ModuleConcatenationPlugin()
        //不支持gz
        // new CompressionPlugin({
        //     asset: "[path].gz[query]",
        //     algorithm: "gzip",
        //     test:/\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        //     threshold: 10240,
        //     minRatio: 0.8
        // })
        new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, './src/images/'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, './sprite.png'),
                css: path.resolve(__dirname, './sprite.css')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: './sprite.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        })

    ],
    devServer: {
        hot: true,
        inline: true,
        open: true
    }

}