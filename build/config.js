'use strict'
const path = require('path');
module.exports = {
    // 运行配置
    dev: {
        // 资源文件放 static 里面
        assetsSubDirectory: '',
        assetsPublicPath: '/',

        // 运行端口，主机命
        host: 'localhost', 
        port: 6666, 

        // bug 工具
        cacheBusting: true,
        // 运行的时候， 看控制台可以显示 css 文件的路径
        cssSourceMap: true
    },

    // 构建配置
    bulid: {
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: '/assets/',
        assetsPublicPath: './',
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html')
    }
}