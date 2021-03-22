// eslint-disable-next-line no-undef
module.exports = {
    packagerConfig: {
        name: 'MongoDb Code Generator',
        executableName: 'MongoDb Code Generator',
        icon: "./assets/icon.icns"
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                "name": "MongoDb Code Generator",
                "productName": "MongoDb Code Generator",
                "executableName": "MongoDb Code Generator",
                "icon": "./assets/icon.icns"
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        }
    ]
}

