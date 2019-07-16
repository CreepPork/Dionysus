-- Main entry point
client_script 'dist/client/client.js'
server_script 'dist/server/server.js'

-- NativeUI
files {
    'dist/client/ui/html/index.html',
    'dist/client/ui/js/app.js',
    'dist/client/ui/css/app.css'
}

client_script 'dist/client/ui/js/nativeUi.js'

ui_page 'dist/client/ui/html/index.html'

resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'
