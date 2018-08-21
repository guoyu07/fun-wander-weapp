const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

/**
 * 将LineString/Polygon的wkt字符串转换为小程序Map组件中的Polyline
 * @param  {String} wkt   线/多边形的几何的wkt字符串
 * @param  {Object} style 线的样式
 * @return {Array}        线数组
 */
const wkt2Polyline = function (wkt, style = {}) {
    const lines = []

    // const coord = polygon.match(/(?<=\())[^\)\(]+(?=))/);
    const coord = wkt.match(/[^\)\(]+(?=\))/) // 小程序不支持逆向预查    
    if (coord) {
        const lineStyle = {
            color: style.color || '#FF0000DD',
            width: style.width || 0.1,
            dottedLine: !!style.dottedLine
        }
        for (const c of coord) {
            const arr = c.split(',')
            const points = arr.map(it => {
                const tmp = it.split(' ');
                return {
                    longitude: parseFloat(tmp[0]),
                    latitude: parseFloat(tmp[1])
                }
            })

            lines.push({
                points: points,
                ...lineStyle
            })
        }
    }

    return lines
}

/**
 * 将点形转换微信小程序Map组件中的Marker
 * @param  {String} pointWkt   点几何的wkt字符串
 * @param  {Object} style      Marker的样式
 * @param  {Number} id         点的Id
 * @return {Object}            Marker对象
 */
const point2Marker = function (pointWkt, style = {}, id) {
    let marker

    // const coord = polygon.match(/(?<=\())[^\)\(]+(?=))/);
    const coord = pointWkt.match(/[^\)\(]+(?=\))/); // 小程序不支持逆向预查    
    if (coord) {
        marker = {
            title: style.title || '',
            iconPath: style.iconPath || '',
            alpha: style.iconPath || 1,
            rotate: style.rotate || 0,            
            width: style.width || 5,
            height: style.height || 5,
            anchor: style.anchor || '{0.5, 0.5}'
        }
        if (id) {
            marker.id = id;
        }
        
        const tmp = coord[0].split(' ')
        marker.longitude = parseFloat(tmp[0])
        marker.latitude = parseFloat(tmp[1])
    }

    return marker
}

/**
 * 将点形转换微信小程序Map组件中的Circle
 * @param  {String} pointWkt   点几何的wkt字符串
 * @param  {Object} style      Circle的样式
 * @return {Object}            Circle对象
 */
const point2Circle = function (pointWkt, style = {}) {
    let circle

    // const coord = polygon.match(/(?<=\())[^\)\(]+(?=))/);
    const coord = pointWkt.match(/[^\)\(]+(?=\))/); // 小程序不支持逆向预查    
    if (coord) {
        circle = {
            color: style.color || '#000000',
            fillColor: style.fillColor || '#000000',
            radius: style.radius || 0.1,
            strokeWidth: style.strokeWidth || 0
        }

        const tmp = coord[0].split(' ')
        circle.longitude = parseFloat(tmp[0])
        circle.latitude = parseFloat(tmp[1])
    }

    return circle
}

/**
 * 以特定字符将将字符串分割后进行反转
 * @param  {String} str   待反转的字符串
 * @param  {String} delim 分隔符
 * @return {String}       反转后的字符串
 */
const reverseStr = function (str, delim = '') {
    return str.split(delim).reverse().join(delim)
}

module.exports = {
    formatTime,
    showBusy,
    showSuccess,
    showModel,
    wkt2Polyline,
    point2Marker,
    point2Circle,
    reverseStr
}
