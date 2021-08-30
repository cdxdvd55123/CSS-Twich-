# Twitch 為原型練習

以 Twtich 為原型，練習運用各種技術做出簡單的頁面。

https://cdxdvd55123.github.io/CSSpractice-Twitch/twitch


8/31

這次更新花了將近一個月的時間才做到一個段落，

尚未完成的部分：

1.上方 topgames 點了拿到的資料還不夠完整所以無法顯示(還沒 Callback )。

2.load more results 會拿到重複的資料。

3.拿到資料後的排版。

因為更新間隔比較長，稍微記錄一下過程：

一開始學習串接API的相關知識，

然後慢慢看新版 Twitch API 如何拿到我們需要的資料，

到可以拿到資料、運用資料內容再去拿下一個資料，

因為新版 API 把資料拆成很多部分，

導致我花了很多時間在研究如何用拿到的資料去拿下一個資料。(先拿 streams 再用裡面的 id 拿 users)

目前是用 Callback 下去做，

未來學了 ES6 可能會改成更好的寫法，

8/7

練習使用CSS預處理器(這裡我使用less)，

把CSS拿到外部，練習使用CSS預處理器less寫，

再把 .less 轉換成 .css 。

p.s.順便修復了漸變效果。


8/6

更新CSS 

使用  transition-timing-function 做線性漸變、 
      filter 做增加亮度濾鏡、 
      box-shadow 做陰影。

8/4

1.每一個方格的寬度為 300 px，高度不限但每個方格的高度一樣，一排有三個方格。

2.背景圖片上疊一層透明度為 50% 的黑色。

3.背景圖片保持不動。

全程練習自己手刻 CSS，

沒有使用Flexbox排版，

也沒有使用框架。

