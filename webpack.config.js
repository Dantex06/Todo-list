const config = {
    mode: 'production',
    entry: {
        todo: './src/js/todo.js',
    },
    output: {
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    }
}

module.exports = config;