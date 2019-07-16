const mix = require('laravel-mix');
const dotenv = require('dotenv-webpack');
const path = require('path');

mix.webpackConfig({
    target: 'node',
    plugins: [
        new dotenv(),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [
                    path.resolve(__dirname, 'src/client/client.ts'),
                    path.resolve(__dirname, 'src/client/ui/app.ts'),
                    path.resolve(__dirname, 'src/client/ui/nativeUi.ts'),
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
                    path.resolve(__dirname, 'src/server/server.ts'),
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
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {},
                    }
                ],
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        }
    }
});

mix.options({
    processCssUrls: false
});

mix.ts('src/client/client.ts', 'dist/client/client.js')
    .ts('src/server/server.ts', 'dist/server/server.js')
    .ts('src/client/ui/ts/app.ts', 'dist/client/ui/js/app.js')
    .ts('src/client/ui/ts/nativeUi.ts', 'dist/client/ui/js/nativeUi.js')
    .sass('src/client/ui/sass/app.scss', 'dist/client/ui/css/app.css')
    .copy('src/client/ui/html', 'dist/client/ui/html', false)
    .setPublicPath('dist');
