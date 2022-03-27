const path = require('path');

module.exports = {
    entry: "./scripts/domain/index.js",
    output: {
        filename: "fismo.js",
        path: path.resolve("dist"),
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