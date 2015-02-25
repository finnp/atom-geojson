var app = require('app')
var Menu = require('menu')
var dialog = require('dialog')

var viewGeojson = require('view-geojson')
var fs = require('fs')
var json = require('JSONStream')

var BrowserWindow = require('browser-window')

var mainWindow = null
var viewStream = null

app.on('window-all-closed', function () {
  if(process.platform != 'darwin') app.quit()
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({width: 800, height: 600, title: 'atom-geojson'})
  
  var template = [
  {
    label: 'Atom'
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'Add..',
        click: menuOpen
      },
      {
        label: 'Clear',
        click: menuClear
      }
      ]
  }
  ]

  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  
  viewStream = viewGeojson()
  
  mainWindow.loadUrl('http://localhost:9966')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
})

function menuClear() {
    mainWindow.loadUrl('http://localhost:9966')
}

function menuOpen() {
  dialog.showOpenDialog(mainWindow, {properties: ['openFile']}, onFile)
  
  function onFile(files) {
    var file = files[0]
    fs.createReadStream(file)
      .pipe(json.parse())
      .pipe(viewStream, {end: false})
  }
}