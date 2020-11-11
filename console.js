// node 重写console
const oldConsole = console;
const isLog = true; //是否显示console 打印
console = (function(conf) {
    return {
      log: function(){
        isLog && conf.log(...arguments);
      },
      info : function(){
        isLog && conf.info(...arguments);
      },
      warn : function(){
        isLog && conf.warn(...arguments);
      },
      error : function(){
        isLog && conf.error(...arguments);
      },
      time : function(){
        isLog && conf.time(...arguments);
      },
      timeEnd : function(){
        conf.timeEnd(...arguments);
      }
    }
})(oldConsole);