// import Bulma
import bulma from "./mystyles.scss";
import dateFormat from "dateformat";
import { htmlToElement } from "./conv";

const DB_NAME = "notify";
const STORE_NAME = "notice";
let alert = {};

const checkNotification = () => {
  // Notification対応しているかどうか
  if (window.Notification) {
    if (Notification.permission === "granted") {
      // 許可されている場合はNotificationで通知
      //window.alert("通知許可されています");
      // var n = new Notification("Hello World");
    } else if (Notification.permission === "denied") {
      window.alert("通知拒否されているので許可してリロードしてください");
    } else if (Notification.permission === "default") {
      // 許可が取れていない場合はNotificationの許可を取る
      Notification.requestPermission(function(result) {
        if (result === "denied") {
          console.log("拒否されました");
        } else if (result === "default") {
          console.log("保留されています");
        } else if (result === "granted") {
          // var n = new Notification("Hello World");
        }
      });
    }
  } else {
    alert("あなたのブラウザでは通知機能を使うことができません");
  }
};
const timeUpdate = () => {
  setInterval(() => {
    const now = new Date();
    const nowFormate = dateFormat(now, "HH:MM:ss");
    document.getElementById("nowTime").innerHTML = nowFormate;
    alert.forEach(a => {
      if (a.time === nowFormate) {
        var n = new Notification(a.details);
        removeDB(a.id);
      }
    });
  }, 1000);
};
const initDB = () => {
  const openReq = indexedDB.open(DB_NAME);
  openReq.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
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
const insertDB = data => {
  const openReq = indexedDB.open(DB_NAME);
  openReq.onsuccess = function(event) {
    // var data = { time: "22:36:36", details: "ご飯食べたい" };
    var db = event.target.result;
    var trans = db.transaction(STORE_NAME, "readwrite");
    var store = trans.objectStore(STORE_NAME);
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
const removeDB = id => {
  const openReq = indexedDB.open(DB_NAME);
  openReq.onsuccess = function(event) {
    var db = event.target.result;
    var trans = db.transaction(STORE_NAME, "readwrite");
    var store = trans.objectStore(STORE_NAME);
    var request = store.delete(id);
    request.onsuccess = event => {
      console.log("delete success");
      getAlert();
    };
    request.onerror = event => {
      console.log("error delete:" + event.message);
    };
  };
};
function getAlert() {
  const openReq = indexedDB.open(DB_NAME);
  openReq.onsuccess = function(event) {
    var db = event.target.result;
    var trans = db.transaction(STORE_NAME, "readonly");
    var store = trans.objectStore(STORE_NAME);
    var getReq = store.getAll();

    getReq.onsuccess = function(event) {
      // 毎回DB問い合わせするのしんどいのでobjectにしとく
      alert = event.target.result;
      console.log(alert);
      // 画面更新
      displayAlert();
    };
  };
}
function displayAlert() {
  const displayAlert = document.getElementById("displayAlert");
  let addHtml = ``;
  for (let i = 0; i < alert.length; i++) {
    const time = alert[i].time;
    const detail = alert[i].details;
    const id = alert[i].id;
    let html =
      `<div class="column is-one-third">
      <article class="message is-info">
        <div class="message-header">
          <p class="titleTime">` +
      time +
      `</p>
          <button class="delete" data-id=` +
      id +
      ` aria-label="delete"></button>
        </div>
        <div class="message-body">` +
      detail +
      `</div>
      </article>
    </div>`;
    if (i % 3 === 0) {
      html = `<div class="columns">` + html;
    } else if (i % 3 === 2 || i === alert.length - 1) {
      html = html + `</div>`;
    }
    addHtml = addHtml + html;
  }
  if (addHtml !== ``) {
    addHtml = `<div>` + addHtml + `</div>`;
    // 一度childを空にする。もっと楽な方法あるんちゃう？
    while (displayAlert.firstChild) {
      displayAlert.removeChild(displayAlert.firstChild);
    }
    displayAlert.appendChild(htmlToElement(addHtml));
    deleteClick();
  }
}
function deleteClick() {
  const hoge = document.getElementsByClassName("delete");
  for (var i = 0; i < hoge.length; i++) {
    hoge[i].addEventListener("click", e => {
      const deleteId = parseInt(e.target.attributes["data-id"].value, 10);
      removeDB(deleteId);
    });
  }
}
function init() {
  checkNotification();
  timeUpdate();
  initDB();
  getAlert();
  document.getElementById("AddNotification").addEventListener("click", () => {
    const addTime = document.getElementById("addTime").value;
    const detail = document.getElementById("detail").value;
    const timeUnit = document.getElementById("timeUnit").value;
    if (addTime === "") {
      window.alert("時間を入力してください");
    } else {
      let alertDate = new Date();
      switch (timeUnit) {
        case "sec":
          alertDate.setSeconds(alertDate.getSeconds() + parseInt(addTime, 10));
          break;
        case "min":
          alertDate.setMinutes(alertDate.getMinutes() + parseInt(addTime, 10));
          break;
        case "hr":
          alertDate.setHours(alertDate.getHours() + parseInt(addTime, 10));
          break;
      }
      const alertFormate = dateFormat(alertDate, "HH:MM:ss");
      const data = {
        time: alertFormate,
        details: detail === "" ? "時間になりました！" : detail
      };
      // add indexdb
      insertDB(data);
      // fetch data
      getAlert();
    }
  });
}
init();
