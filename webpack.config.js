const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './src/app/index.js',
  devServer: {
    contentBase: './dist'
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      title: 'ThreeJS'
    }),
    new MiniCssExtractPlugin({})
  ],
  output: {
    filename: '[name].bundle.js',
    assetModuleFilename: '[name].[ext]',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(gltf)$/i,
        use: [
          {
            loader: 'gltf-webpack-loader',
            options: {
              name: '[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.(bin)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [
          path.resolve(__dirname, 'src/models')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          }
        ],
      },
    ]
  }
}