"use strict";

{
  class Panel {
    constructor(game) {
      this.game = game;
      this.el = document.createElement("li");
      this.el.classList.add("pressed");
      this.el.addEventListener("click", () => {
        this.check();
      });
    }

    getEl() {
      return this.el;
    }

    activate(num) {
      this.el.classList.remove("pressed");
      this.el.textContent = num;
    }

    check() {
      // parseIntは文字列の引数を解析し、指定された基数の整数値を返します。
      if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
        this.el.classList.add("pressed");
        this.game.addCurrentNum();

        // clearTimeoutでsetTimeoutを止める
        if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
          clearTimeout(this.game.getTimeoutId());
        }
      }
    }
  }

  class Board {
    constructor(game) {
      this.game = game;
      this.panels = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        this.panels.push(new Panel(this.game));
      }
      this.setup();
    }

    setup() {
      const board = document.getElementById("board");
      this.panels.forEach(panel => {
        // オブジェクト指向のカプセル化、他のクラスのメソッドに直接アクセスしないようにする
        board.appendChild(panel.getEl());
      });
    }

    activate() {
      const nums = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        nums.push(i);
      }
      this.panels.forEach(panel => {
        // splice() メソッドは、既存の要素を取り除いたり、置き換えたり、新しい要素を追加したりすることで、配列の内容を変更します。
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
        console.log(nums);
        console.log(num);
        panel.activate(num);
      });
    }
  }

  class Game {
    constructor(level) {
      this.level = level;
      this.board = new Board(this);

      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined;

      const btn = document.getElementById("btn");
      btn.addEventListener("click", () => {
        // ボタンを押すたびにタイマーが走る処理のバグ修正
        this.start();
      });
      this.setup();
    }

    runTimer() {
      const timer = document.getElementById("timer");
      // toFixedは小数点以下表示の固定を引数で指定
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);

      // cleartimeoutを使うのでtimeoutIdにsetTimeoutを代入する
      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }

    addCurrentNum() {
      this.currentNum++;
    }

    getCurrentNum() {
      return this.currentNum;
    }

    getTimeoutId() {
      return this.timeoutId;
    }

    getLevel() {
      return this.level;
    }

    setup() {
      const container = document.getElementById("container");
      const PANEL_WIDTH = 50;
      const BOARD_PADDING = 10;
      container.style.width =
        PANEL_WIDTH * this.level + BOARD_PADDING * 2 + "px";
    }

    start() {
      if (typeof this.timeoutId !== "undefined") {
        clearTimeout(this.timeoutId);
      }

      this.currentNum = 0;
      this.board.activate();

      this.startTime = Date.now();
      this.runTimer();
    }
  }

  new Game(5);
}
