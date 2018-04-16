const path = require( 'path' )
const webpack = require( 'webpack' )
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const appPath = path.resolve(__dirname, 'public');
const ManifestPlugin = require('webpack-manifest-plugin');
// multiple extract instances
const extractCSS = new ExtractTextPlugin({
  filename: 'css/style.[name].[chunkhash].css',
  allChunks: true
});
const loadConfig = (options) => {

  // 定义根目录上下文，因为有的项目是用二级路径区分的
  const context = options.context;
  const entry = options.entry;
  const pathInMappingJson = options.pathInMappingJson;

  const webpackConfig = {
    devtool: 'source-map', // 生成 source-map文件 原始源码
    resolve: {
      extensions: ['.js', '.css', '.less', '.png', '.jpg', '.gif'],
      modules: [
        'client',
        'node_modules',
      ],
    },
    entry,
    output: {
      path: path.join(appPath, 'static'),
      filename: '[name].[chunkhash].js',
      publicPath: '/public/static/',
      sourceMapFilename: 'map/[file].map',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        // https://github.com/webpack/url-loader
        {
          test: /\.(png|jpg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[hash].[ext]',
              limit: 100000, // 100kb
            }
          }
        },
        {
          test: /\.css$/,
          use: extractCSS.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: false,
                localIdentName: '[local][hash:base64:5]'
              }
            }, {
              loader: 'postcss-loader',
              options: {
                pack: 'cleaner',
                sourceMap: true,
              }
            }],
            // publicPath: '/public/dist/' 这里如设置会覆盖 output 中的 publicPath
          })
        },
        {
          test: /\.less/,
          use: ['style-loader', {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          }, {
            loader: 'postcss-loader',
            options: {
              pack: 'cleaner',
              sourceMap: true,
            }
          }, {
            loader: 'less-loader',
            options: {
              outputStyle: 'expanded',
            }
          }],
        }
      ],
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
        filename: '[name].[chunkhash].js',
      }),
      extractCSS,
      new ManifestPlugin({
        fileName: 'mapping.json',
        publicPath: `${pathInMappingJson}`,
        seed: {
          title: options.title
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compressor: {
          warnings: false,
        },
        mangle: {
          except: [] // 设置不混淆变量名
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: true,
        options: {
          // eslint 配置
          eslint: {
            emitError: true, // 验证失败，终止
            configFile: '.eslintrc.js'
          },
        }
      })
    ],
  }
  return webpackConfig;
}

module.exports = loadConfig;
