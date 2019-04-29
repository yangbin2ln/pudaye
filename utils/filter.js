var util = require('/util.js');
var app = getApp();

function initFilter(callBack) {
  util.request(
    app.data.apiurl + 'api/Common/GetFilter', {},
    function(res) {
      if (typeof callBack == "function") {
        callBack(res);
      }
    }, "get", true
  );
}
module.exports = {
  initFilter: initFilter,
}