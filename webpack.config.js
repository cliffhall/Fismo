const path = require('path');

module.exports = {
    entry: "./scripts/domain/index.js",
    output: {
        filename: "index.js",
        path: path.resolve("sdk/browser"),
        library: 'Fismo',
        libraryTarget: 'var'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader"

            }
        ]
    }

}