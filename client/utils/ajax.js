const qcloud = require('../vendor/wafer2-client-sdk/index')
const config = require('../config')
const util = require('./util')

const getServiceUrl = url => {
    return `${config.service.service}/${url}`
}

var get = (url, options = {}, showLoading) => {
    const sUrl = getServiceUrl(url);

    return new Promise((resolve, reject) => {
        if (showLoading) {
            util.showBusy('请求中...')
        }
        
        var reqOptions = {
            url: sUrl,
            data: options.data,
            success(result) {
                if (showLoading) {
                    util.showSuccess('请求成功完成')
                    console.log('request success', result)
                }                
                
                if (result.data.code < 0) {
                    util.showModel('请求出错了', result.data.error);
                    
                    reject(result.data.error)
                } else {
                    resolve(result.data.data)
                }                
            },
            fail(error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
                
                reject(error)
            }
        }
        if (options.takeSession) { // 使用 qcloud.request 带登录态登录
            reqOptions.login = true;
            qcloud.request(reqOptions)
        } else { // 使用 wx.request 则不带登录态
            wx.request(reqOptions)
        }
    });
}

module.exports = {
    get
}
