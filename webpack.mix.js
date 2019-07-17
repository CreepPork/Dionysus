const mix = require('laravel-mix');
const dotenv = require('dotenv-webpack');
const path = require('path');
const _ = require('lodash');

mix.webpackConfig({
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [
                    path.resolve(__dirname, 'src/client/Client.ts'),
                    path.resolve(__dirname, 'src/client/ui/App.ts'),
                    path.resolve(__dirname, 'src/client/ui/NativeUI.ts'),
                ],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            instance: 'client-instance',
                            configFile: 'src/client/tsconfig.json'
                        }
                    },
                ]
            },
            {
                test: /\.tsx?$/,
                include: [
                    path.resolve(__dirname, 'src/server/Server.ts'),
                ],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            instance: 'server-instance',
                            configFile: 'src/server/tsconfig.json'
                        }
                    },
                ]
            },
        ]
    },
    plugins: [
        new dotenv(),
    ],
});

mix.options({
    processCssUrls: false
});

mix.ts('src/client/Client.ts', 'dist/client/Client.js')
    .ts('src/server/Server.ts', 'dist/server/Server.js')
    .ts('src/client/ui/ts/App.ts', 'dist/client/ui/js/App.js')
    .ts('src/client/ui/ts/NativeUI.ts', 'dist/client/ui/js/NativeUI.js')
    .sass('src/client/ui/sass/app.scss', 'dist/client/ui/css/app.css')
    .copy('src/client/ui/html', 'dist/client/ui/html', false)
    .setPublicPath('dist');

mix.override(config => {
    const vueConf = _.find(config.module.rules, rule => String(rule.test) === String(/\.vue$/));

    vueConf.use[0].options.optimizeSSR = false;
});
