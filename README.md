# 靜態頁面開發環境（使用 Gulp ）
簡單的 Gulp 配置，可快速架設開發靜態網頁所需的環境。
## 本環境可以幫你做的事
本環境滿足之需求為以下 3 項：
1. SCSS / Sass 的編譯與完善
2. 檔案（CSS、JavaScript、HTML與圖片檔）的壓縮
3. 瀏覽器 LiveReload 即時呈現
## 使用
1. 安裝 Node.js，請參閱 [Node.js Downloads](https://nodejs.org/en/download/)
2. 安裝 Gulp，請參閱 [Gulp](http://gulpjs.com)
3. 複製下載本 Repo
```git
Clone git@github.com:OverZealous/run-sequence.git
```
4. 安裝 npm 套件
```javascript
npm install
```
5. 執行 gulp 任務
```javascript
gulp
```
## 專案結構說明
- src/ ：原始檔，在這裡進行開發。
- dist/ : 由 gulp 生成的發佈檔。
