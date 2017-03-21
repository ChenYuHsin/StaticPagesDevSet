# 靜態頁面開發環境（使用 Gulp ）
簡單的 Gulp 配置，可快速架設開發靜態網頁所需的環境。
## 本環境可以幫你做的事
本環境滿足之需求為以下 3 項：
1. SCSS / Sass 的編譯與完善
2. 檔案（CSS、JavaScript、HTML與圖片檔）的壓縮
3. 瀏覽器 LiveReload 即時呈現
## 專案結構
```
StaticPagesDevSet
    |
    └── src // 原始檔資料夾，在這裡編寫網頁
    |   └── img
    |   └── js
    |   └── scss
    |   └── index.html 
    |
    └── dist // 由 gulp 自動產生的發佈檔
    |   └── css
    |   └── img
    |   └── js  
    |
    └── node_modules
    |
    └── gulpfile.js
    |
    └── index.html
    |
    └── package.json
    |
    └── README.md
```
## Gulp 主要任務
詳細配置請查看 gulpfile.js 
### processSCSS
編譯  src/scss 裡的 .scss 檔案成 .css，同時加上前綴與最小化。
最後存入 dist/css 。
### processJS
利用 jshint 檢查 src/js 裡的 .js 檔案，然後進行醜化。
最後存入 dist/js 。
### proceeIMG
壓縮 src/img 裡的圖片檔。
最後存入 dist/img 。
### processHTML
壓縮 src/index.html。
最後存入根目錄。
## 使用
1. 安裝 Node.js，請參閱 [Node.js Downloads](https://nodejs.org/en/download/)
2. 安裝 Gulp，請參閱 [Gulp](http://gulpjs.com)
3. 複製下載本 Repo
```git
Clone git@github.com:ChenYuHsin/StaticPagesDevSet.git
```
4. 安裝 npm 套件
```javascript
npm install
```
5. 執行 gulp 任務
```javascript
gulp
```

