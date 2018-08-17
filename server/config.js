const CONF = {
    port: '5757',
    
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wxb7c85a7035f2fac2',

    // 微信小程序 App Secret
    appSecret: '74ddb968b4ee72707c1d486f537842a8',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: '192.168.4.189',
        // host: 'localhost',
        port: 3306,
        user: 'root',
        // db: 'cAuth',
        db: 'indoor_db',
        // pass: 'wxb7c85a7035f2fac2',
        pass: '',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh',

    // 本地化服务的配置
    serverHost: 'localhost', 
    tunnelServerUrl: '', 
    tunnelSignatureKey: '', 
    qcloudAppId: '1257011529', 
    qcloudSecretId: 'AKIDLXXIp7V2g6KK5r8o26va1b10oTwCo2cw', 
    qcloudSecretKey: 'ECuMdhV3LN9fwznLkuoSt4zJRKyPgmcH'
}

module.exports = CONF
