var fs = require('fs');

var logParser = function (logsPath, rulesPath, completionBlock) {
  console.log("logs at : " + logsPath);
  console.log("rules at : " + rulesPath);

  function getStateWithName(name, states) {
    for (var index in states) {
      if (states[index].name === name) {
        return states[index];
      }
    }
    return null;
  }

  function parse(logsData, rulesData, completionBlock) {
    var jsonData = JSON.parse(rulesData);
    var states = jsonData.rules[0].states;
    var currentState = getStateWithName("Unknown", states); 

    var datas = logsData.split('\n');
    var result = [];
    for (var index in datas) {
      var data = datas[index];
      for (var pathIndex in currentState.paths) {
        var path = currentState.paths[pathIndex];
	if (data.indexOf(path.pattern) > -1) {
	  currentState = getStateWithName(path.to, states);
          break;
	}
      }
      var result_data = {
        "data" : data,
	"state" : currentState.name,
	"bgColor": currentState.bgColor
      };
      result.push(result_data);
    }
    completionBlock(null, result);  
  }

  function readFile(path, completionBlock) {
    fs.readFile(path, 'utf8', function (err, data) {
      completionBlock(err, data);
    });
  }

  function readFiles() {
    readFile(logsPath, function (err, logsData) {
      if (err) {
        completionBlock(err);
      } else {
	readFile(rulesPath, function (err, rulesData) {
	  if (err) {
            completionBlock(err);
	  } else {
            parse(logsData, rulesData, function (err, result) {
              if (err) {
                completionBlock(err);
	      } else {
                completionBlock(null, result);  
	      }
	    });
	  }
	});
      }
    });
  }

  readFiles();
};

module.exports = logParser;