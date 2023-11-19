# 咖啡廳訂位系統 Cafe Reservation API
- 這是一個提供咖啡廳訂位系統後端 API 的應用程式。使用者經身份驗證後，可探索並收藏喜愛的咖啡廳。系統支援根據特定日期、時段和人數的條件篩選並預訂座位。店家則可瀏覽和管理顧客訂位資料，實現顧客與店家雙向交流。
- 本專案採用前後分離的開發模式，並透過 RESTful 風格進行設計
  - [前端 repo](https://github.com/James-Lee-01/reserve)
## Website - 網站展示
- [咖啡廳訂位網站 Cafe Reservation](https://james-lee-01.github.io/reserve)
- [正向流程 Demo](https://youtu.be/DrG0Fo3U5aQ)
- 共用帳號：
  - 使用者1：
    ```
    Account: user1@example.com
    Password: 12345678
    ```
  - 使用者2：
    ```
    Account: user2@example.com
    Password: 12345678
    ```
  - 管理者：
    ```
    Account: root@example.com
    Password: 12345678
    ```

![image](https://github.com/boxunw/cafe-reservation-api/blob/main/image/main.png)

## Features - 產品功能
- 使用者可以註冊/登入/編輯帳號
- 使用者可以瀏覽所有咖啡廳
- 使用者可以查看單一咖啡廳詳細資訊
- 使用者可以收藏/取消收藏喜愛的咖啡廳
- 使用者可以依日期時段及人數搜尋尚有空桌可訂位的咖啡廳
- 使用者可以增加城市別作為篩選指標
- 使用者可以經由篩選結果或是收藏清單中選取咖啡廳進行訂位
- 訂位頁面系統提供該咖啡廳 7 日內有空桌可訂位的日期和時段
- 使用者可以瀏覽自己的訂位資料
- 使用者可以新增咖啡廳成為店家
- 店家可以編輯咖啡廳詳細資訊，包含時段、座位桌數等
- 店家可以查看及刪除該咖啡廳的顧客訂位資料
- 後台管理者可以瀏覽所有咖啡廳列表
- 後台管理者可以下架任何一家咖啡廳
- 後台管理者可以一鍵清除今日之前舊的訂位資料
## API Document - API 文件
該應用程式目前佈署至 Heroku，總共 33 支 API
[API List](https://documenter.getpostman.com/view/29236995/2s9YRCWB94)
## Environment SetUp - 環境建置
1. [Node.js](https://nodejs.org/en)
2. [MySQL](https://dev.mysql.com/downloads/mysql/)
3. [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
4. [POSTMAN](https://www.getpostman.com/downloads/)
5. [Imgur](https://api.imgur.com/oauth2/addclient)
## Installing - 本地端伺服器安裝流程
1. 請先確認已安裝 Node.js，若無，至環境建置第 1 項點擊安裝
2. 請先確認已安裝 MySQL 及 MySQL Workbench，若無，至環境建置第 2、3 項點擊安裝
3. 開啟終端機 (Terminal)，Clone 此專案至本機電腦
```
git clone https://github.com/boxunw/cafe-reservation-api.git
```
4. 打開專案資料夾
```
cd cafe-reservation-api
```
5. 安裝 npm 套件
```
npm install
```
6. 參考資料夾內 .env.example，建立 .env 檔案以設定環境變數
  - IMGUR_CLIENT_ID 的取得請至環境建置第五項連結申請
7. 打開 /config/config.json 檔案，修改為個人資料庫使用的帳號密碼
```
"development": {
  "username": "xxxxxx",   // 修改此處
  "password": "xxxxxx",   // 修改此處
  "database": "cafe_reservation",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```
8. 建立資料庫，可在 MyAQL Workbench 輸入以下指令
```
create database cafe_reservation;
```
9. 建立資料表，在終端機 (terminal) 輸入以下指令
```
npx sequelize db:migrate
```
10. 建立種子資料
```
npx sequelize db:seed:all
```
11. 啟動伺服器
```
npm run dev
```
12. 當終端機出現以下字樣，表示伺服器已成功啟動
```
App is listening on port 3000!
```
13. 接著便可搭配 POSTMAN 做本地端 API 存取，Base URL 為
```
http://localhost:3000
```
