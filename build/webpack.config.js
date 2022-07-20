const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require("path")
const allConfig = require('./config')

const isProd = process.env.NODE_ENV === "production" // 是否生产环境
// 根据环境切换配置
const config = isProd ? allConfig.bulid : allConfig.dev;

module.exports = {
    mode: isProd ? "production" : "development",
    entry: {
        app: "./src/index.ts"
    },

    output: {
        path: config.assetsRoot,
        publicPath:  config.assetsPublicPath,
        filename: "main.js"
    },

    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.css'],
        alias: {
            '@': path.join(__dirname, '..')
        }
       
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx|tgl)?$/,
                use: "ts-loader",
            },
            { 
                test: /\.css$/, 
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 当前的css所在的文件相对于打包后的根路径dist的相对路径
                            publicPath: '../'
                        }
                    }, 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: '10000',
                    name: '[name].[ext]',
                    // 指定打包后文件存放目录
                    outputPath: config.assetsSubDirectory
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader'
            }
        ]
    },

    plugins: [
        // 创建 html
        new HtmlWebpackPlugin({template: "index.html" }),

        // 分离css
        new MiniCssExtractPlugin({ filename: 'css/[name].css' })
    ],

    // devtool: "cheap-module-source-map",

    devServer: {
        host: allConfig.dev.host, // 主机名
        port: allConfig.dev.port,
        open: true
    }

}