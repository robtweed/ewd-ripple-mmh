var request = require('request');

var host = 'http://54.163.64.8:8080';

function materRequest(params, userObj) {

  // request to Mater system

  /*
    params = {
      method: 'POST' | 'GET' etc
      url: '/rest/v1/composition'
      session: {{OpenEHR Session Id}},
      queryString: 'templateId=IDCR - Adverse Reaction List.v1&ehrId=cd8abecd-9925-4313-86af-93aab4930eae&format=FLAT
      options: {
        // any specific options such as alternative qs or body
      },
      processBody: function() {...},
      callback: function(userObj) {...}
    }
  */
  var url = host + params.url;
  var options = {
    url: url,
    method: params.method || 'GET',
    json: true
  };
  if (params.session) {
    options.headers = {
      'Ehr-Session': params.session
    };
  }
  if (params.queryString) options.qs = params.queryString;
  if (params.options) {
    for (var param in params.options) {
      options[param] = params.options[param];
    }
  }
  console.log('request to ' + host + ': ' + JSON.stringify(options));
  request(options, function(error, response, body) {
    if (error) {
      console.log('error returned from ' + host + ': ' + error);
      if (params.callback) params.callback(error);
    }
    else {
      console.log('response from ' + host + ': ' + JSON.stringify(body));
      if (params.processBody) userObj = params.processBody(body);
      if (params.callback) params.callback(false, userObj);
    }
  });
}

function getPatients(callback) {
  var patients = {};
  var params = {
    url: '/ripple/getPatientSummary',
    callback: callback,
    processBody: function(body) {
      return body;
    }
  };
  materRequest(params, patients);
}

module.exports = {
  getPatients: getPatients
};
