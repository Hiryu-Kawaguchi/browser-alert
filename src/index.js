// import Bulma
import bulma from "./mystyles.scss";
import dateFormat from "dateformat";

const DB_NAME = "notify";
let alert = {};

const checkNotification = () => {
  // Notification対応しているかどうか
  if (window.Notification) {
    if (Notification.permission === "granted") {
      // 許可されている場合はNotificationで通知
      alert("通知許可されています");
      var n = new Notification("Hello World");
    } else if (Notification.permission === "denied") {
      alert("通知拒否されているので許可してリロードしてください");
    } else if (Notification.permission === "default") {
      // 許可が取れていない場合はNotificationの許可を取る
      Notification.requestPermission(function(result) {
        if (result === "denied") {
          console.log("拒否されました");
        } else if (result === "default") {
          console.log("保留されています");
        } else if (result === "granted") {
          var n = new Notification("Hello World");
        }
      });
    }
  } else {
    alert("あなたのブラウザでは通知機能を使うことができません");
  }
};
const timeUpdate = () => {
  setInterval(() => {
    let now = new Date();
    document.getElementById("nowTime").innerHTML = dateFormat(now, "HH:MM:ss");
  }, 1000);
};
const initDB = () => {
  const openReq = indexedDB.open(DB_NAME);
  openReq.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("notice", { keyPath: "id", autoIncrement: true });
    console.log("db upgrade");
  };
  openReq.onsuccess = function(event) {
    const db = event.target.result;
    db.close();
  };
  openReq.onerror = function() {
    console.log("db open error");
  };
};
const insertDB = () => {
  const openReq = indexedDB.open(DB_NAME);
  openReq.onsuccess = function(event) {
    var data = { time: "12:10:10", details: "ご飯食べたい" };
    var db = event.target.result;
    var trans = db.transaction("notice", "readwrite");
    var store = trans.objectStore("notice");
    var putReq = store.put(data);
    putReq.onsuccess = function() {
      console.log("put data success");
    };
    trans.oncomplete = function() {
      console.log("transaction complete");
      db.close();
    };
  };
  openReq.onerror = function(event) {
    console.log("db open error");
  };
};
timeUpdate();
initDB();
insertDB();
