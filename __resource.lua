dependency 'baseevents'
dependency 'spawnmanager'

-- Main entry point
client_script 'dist/client/Client.js'
server_script 'dist/server/Server.js'

-- NativeUI
files {
    'dist/client/ui/html/index.html',
    'dist/client/ui/js/app.js',
    'dist/client/ui/css/app.css'
}

client_script 'dist/client/ui/js/NativeUI.js'

ui_page 'dist/client/ui/html/index.html'

resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'
