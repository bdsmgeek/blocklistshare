const export_btn = document.getElementById('export_button')
const import_btn = document.getElementById('import_button')

export_btn.addEventListener('click', exportBlocklist())
import_btn.addEventListener('click', importBlocklist())

function exportBlocklist(){
    console.log("Export button clicked.")
    chrome.runtime.sendMessage("export", function (response) {} )
}

function importBlocklist(){
    chrome.runtime.sendMessage("export", function (response) {} )
}