Для установки плагина требуется в глобальном конфиге ( обычно main.js ) подключить index файл из данной дериктории к Vue

```javascript
import AlifUi from '~/plugins/aliftech-ui/'
...
Vue.use(AlifUi)
```

Также установить необходимы зависимости
```
npm i vue-clickaway --save
npm i vue-feather-icons --save
npm i vue-the-mask --save
npm i @babel/plugin-proposal-private-methods --save

npm i vue-the-mask --save-dev
npm i node-sass sass-loader --save-dev
```

Далее настроить конфиг для babel и добавить alias <br />
####**Babel**
```javascript
module.exports = {
  ...,
  plugins: [
    ...,
    '@babel/plugin-proposal-private-methods',
    ...,
  ],
  ...,
}
```
####**Alias**
В основном в vue.config.js
```javascript
module.exports = {
  configureWebpack: {
    ...,
    resolve: {
      ...,
      alias: {
        ...,
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src'),
        '~~': path.resolve(__dirname, '.'),
        '@@': path.resolve(__dirname, '.'),
        ...,
      },
      ...,
    },
    ...,
  },
  ...,
}
```
