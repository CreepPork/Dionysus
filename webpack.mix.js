const mix = require('laravel-mix');

mix.options({
    processCssUrls: false
});

mix.ts('src/client/client.ts', 'dist/client/client.js')
    .ts('src/server/server.ts', 'dist/server/server.js')
    .setPublicPath('dist');
