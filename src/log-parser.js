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

  function splitDataAsPerLogPattern(data, logPattern) {
    var lastLine = "";
    var lines = data.split('\n');
    var result = [];
    console.log("LogPattern : " + logPattern)
    for (var index in lines) {
      var line = lines[index];
      if (line.substr(0,logPattern.length) === logPattern) {
        result.push(lastLine);
	lastLine = line;
      } else {
        lastLine = lastLine + line;
      }
    }
    result.push(lastLine);
    return result;
  }

  function parse(logsData, rulesData, completionBlock) {
    var jsonData = JSON.parse(rulesData);
    var states = jsonData.rules[0].states;
    var currentState = getStateWithName("Unknown", states); 

    var datas = splitDataAsPerLogPattern(logsData, jsonData.logPattern);
    var result = [];
    for (var index in datas) {
      var data = datas[index];
      for (var pathIndex in currentState.paths) {
        var path = currentState.paths[pathIndex];
	var found = false;
	for (var patternIndex in path.pattern) {
	  if (data.indexOf(path.pattern[patternIndex]) > -1) {
	    currentState = getStateWithName(path.to, states);
	    found = true;
            break;
	  }
	}
	if (found) {
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
