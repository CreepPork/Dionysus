const mix = require('laravel-mix');
const dotenv = require('dotenv-webpack');

mix.webpackConfig({
    target: 'node',
    plugins: [
        new dotenv(),
    ],
});

mix.options({
    processCssUrls: false
});

mix.ts('src/client/client.ts', 'dist/client/client.js')
    .ts('src/server/server.ts', 'dist/server/server.js')
    .setPublicPath('dist');
