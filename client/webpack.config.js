const { constants: { ROOT_DIR, DIST_DIR, ASSETS_DIR, COMPONENTS_DIR, LAYOUTS_DIR, MIXINS_DIR, SCSS_DIR, STORE_DIR } } = require('./webpackUtils');
const { methods: { defineMode, defineFilename, optimization, getPlugins, cssLoaders, babelOptions, cleanCssLoader } } = require('./webpackUtils');

const { isDev, isProd } = defineMode();

module.exports = {
  target: 'web',
  context: ROOT_DIR,
  entry: {
    main: ['@babel/polyfill', './index.js']
  },
  output: {
    filename: defineFilename('js'),
    path: DIST_DIR,
    publicPath: (isProd) ? './' : '/',
  },
  resolve: {
    extensions: ['.js', '.png', '.jpg', '.jpeg', '.sass', '.scss', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm-bundler.js',
      '@': ROOT_DIR,
      '@assets': ASSETS_DIR,
      '@components': COMPONENTS_DIR,
      '@layouts': LAYOUTS_DIR,
      '@mixins': MIXINS_DIR,
      '@styles': SCSS_DIR,
      '@store': STORE_DIR
    }
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    historyApiFallback: true,
    host: 'localhost',
    port: 3002,
    hot: isDev,
    liveReload: isDev,
    open: isDev,
    static: isDev
  },
  optimization: optimization(isProd),
  plugins: getPlugins(isProd),
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders(isDev)
      },
      {
        test: /\.css$/,
        use: cleanCssLoader(isDev)
      },
      {
        test: /\.(png|jpg|svg|gif|ttf|woff|woff2|eot|ico)$/,
        use: ['file-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: babelOptions()
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            hotReload: true
        }
      }
    ]
  }
};