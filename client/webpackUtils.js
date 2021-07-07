const path = require('path');

const ROOT_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

const ASSETS_DIR = path.resolve(__dirname, 'src', 'assets');
const COMPONENTS_DIR = path.resolve(__dirname, 'src', 'components');
const LAYOUTS_DIR = path.resolve(__dirname, 'src', 'layouts');
const MIXINS_DIR = path.resolve(__dirname, 'src', 'mixins');
const SCSS_DIR = path.resolve(__dirname, 'src', 'scss');
const STORE_DIR = path.resolve(__dirname, 'src', 'store');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const defineMode = () => ({
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production'
});

const defineFilename = (extension) => `[name].[fullhash].${extension}`;

const optimization = isProduction => {
  const config = {
    splitChunks: {
        chunks: 'all'
    }
  };

  if(isProduction) {
    config.minimizer = [
        new MiniCssExtractPlugin(),
        new TerserWebpackPlugin()
    ];
  }

  return config;
};

const getPlugins = isProduction => {
  return [
    new HTMLWebpackPlugin({
      template: 'index.html',
      favicon: './assets/imgs/favicon.ico',
      minify: {
          collapseWhitespace: isProduction
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: defineFilename('css')
    }),
    new VueLoaderPlugin()
  ];
};

const cssLoaders = isDev => ([
  (isDev) ? 'style-loader' : MiniCssExtractPlugin.loader,
  'css-loader',
  'sass-loader'
]);

const cleanCssLoader = isDev => ([
  (isDev) ? 'style-loader' : MiniCssExtractPlugin.loader,
  'css-loader'
]);

const babelOptions = preset => {
  const options = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if(preset)
    options.presets.push(preset);

  return options;
};

module.exports = {
  constants: {
    ROOT_DIR,
    DIST_DIR,
    ASSETS_DIR,
    COMPONENTS_DIR,
    LAYOUTS_DIR,
    MIXINS_DIR,
    SCSS_DIR,
    STORE_DIR
  },
  methods: {
    defineMode,
    defineFilename,
    optimization,
    getPlugins,
    cssLoaders,
    cleanCssLoader,
    babelOptions
  }
};