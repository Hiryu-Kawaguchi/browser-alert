// import Bulma
import bulma from "./mystyles.scss";
import dateFormat from "dateformat";

const timeUpdate = () => {
  setInterval(() => {
    let now = new Date();
    document.getElementById("nowTime").innerHTML = dateFormat(now, "HH:MM:ss");
  }, 1000);
};
timeUpdate();

// // Notification対応しているかどうか
// if (window.Notification) {
//   alert("Notificationは有効です");

//   // Permissionの確認
//   if (Notification.permission === "granted") {
//     // 許可されている場合はNotificationで通知
//     alert("通知許可されています");
//     var n = new Notification("Hello World");
//   } else if (Notification.permission === "denied") {
//     alert("通知拒否されています");
//   } else if (Notification.permission === "default") {
//     alert("通知可能か不明です");

//     // 許可が取れていない場合はNotificationの許可を取る
//     Notification.requestPermission(function(result) {
//       if (result === "denied") {
//         alert("リクエスト結果：通知許可されませんでした");
//       } else if (result === "default") {
//         alert("リクエスト結果：通知可能か不明です");
//       } else if (result === "granted") {
//         alert("リクエスト結果：通知許可されました！！");
//         var n = new Notification("Hello World");
//       }
//     });
//   }
// } else {
//   alert("あなたのブラウザでは通知機能を使うことができません");
// }
