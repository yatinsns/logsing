var logParser = require('./log-parser');

logParser("/Users/yatin/Desktop/logsing-files/consoleCurrent-81.log", "/Users/yatin/Desktop/logsing-files/rule-sample.json", function (error, data) {
  if (error) {
    console.log("error : " + error);
  } else {
    console.log("data : " + JSON.stringify(data));
  }
});
