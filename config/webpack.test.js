const helpers = require('./helpers');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const {CheckerPlugin} = require('awesome-typescript-loader');

const getConfig = (hasCoverage, isTddMode) => {

    let extraRules = [];
    if (hasCoverage) {
        extraRules.push(
            {
                enforce: 'post',
                test: /\.(js|ts)$/,
                loader: 'istanbul-instrumenter-loader',
                include: helpers.root('src'),
                exclude: [
                    /\.(e2e|spec)\.ts$/,
                    /node_modules/
                ]
            }
        );
    }

    let extraPlugins = [];
    if (isTddMode) {
        extraPlugins.push(new CheckerPlugin());// to speed up compilation during TDD
    }

    return {
        devtool: 'inline-source-map',
        resolve: {
            extensions: ['.ts', '.js'],
            modules: [helpers.root('src'), 'node_modules']
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'source-map-loader',
                    exclude: [
                        // these packages have problems with their sourcemaps
                        helpers.root('node_modules/rxjs'),
                        helpers.root('node_modules/@angular')
                    ]
                },
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: helpers.root('src','tsconfig.spec.json'),
                                // use inline sourcemaps for "karma-remap-coverage" reporter (if coverage is activated)
                                sourceMap: !hasCoverage,
                                inlineSourceMap: hasCoverage,
                                compilerOptions: {

                                    // Remove TypeScript helpers to be injected
                                    // below by DefinePlugin
                                    removeComments: true
                                }
                            },
                        },
                        'angular2-template-loader'
                    ],
                    exclude: [/\.e2e\.ts$/]
                },
                {
                    test: /\.css$/,
                    loader: ['to-string-loader', 'css-loader']
                },
                {
                  test: /\.(scss|sass)$/,
                  use: ['to-string-loader', 'css-loader', 'sass-loader'],
                  exclude: [helpers.root('src', 'scss')]
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
                }
            ].concat(extraRules)
        },

        plugins: [

            new LoaderOptionsPlugin({
                debug: false,
                options: {
                    // legacy options go here
                }
            }),
            // Fixes linker warnings (see https://github.com/angular/angular/issues/11580)
            new ContextReplacementPlugin(
                // fixes WARNING Critical dependency: the request of a dependency is an expression
                /(.+)?angular(\\|\/)core(.+)?/,
                helpers.root('src'), // location of your src
                {} // a map of your routes
              ),
        ].concat(extraPlugins),

        performance: {
            hints: false
        },
        node: {
            global: true,
            process: false,
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };
}

module.exports.getConfig = getConfig;
