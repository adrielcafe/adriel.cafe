var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', 
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/api',
  liveQuery: {
    classNames: []
  }
});

var app = express();

app.use('/', express.static(path.join(__dirname, '/public')));

var mountPath = process.env.PARSE_MOUNT || '/api';
app.use(mountPath, api);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('adriel.cafe running on port ' + port + '.');
});

ParseServer.createLiveQueryServer(httpServer);
