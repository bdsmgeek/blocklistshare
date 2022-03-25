// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

console.log("This prints to the console of the page (injected only if the page url matched)")

function addFetlifeExportButton() {
    var blockedHeader = document.querySelector('h3.mv0.fw4.f5.lh-copy.gray-300')

    var blockExportButton = document.createElement("button")

    blockExportButton.innerText = "Export"

    blockedHeader.appendChild(blockExportButton)

    blockExportButton.addEventListener("click", () => { setStartExport() })
}

function setStartExport() {
    console.log("start export set")
    //chrome.runtime.sendMessage("export_fetlife" (response))
    window.localStorage.setItem('__export_fetlife__', "true")
    setStartFetlifeExport()
}

function setStartFetlifeExport() {
    let list = []
    if (window.localStorage.__blocked__) {
        list = list.concat(JSON.parse(window.localStorage.__blocked__))
    }

    list = list.concat([...document.querySelectorAll('a.relative.overflow-hidden.dib.link')]
        .map(
            r => (
                {
                    link: r.href,
                    username: r.title
                }
            )
        )
    )

    console.log('blocklist length: ' + list.length)
    // save results in local storage
    window.localStorage.setItem('__blocked__', JSON.stringify(list))
    // programmatically click the "next page" button
    // to fetch more blocked users 
    let next = document.querySelector('.next_page')

    if (next.className.search("disabled") > 0) {
        window.localStorage.removeItem("__export_fetlife__")
        if (window.localStorage.__blocked__) {
            let content = "data:application/json;charset=utf-8," + window.localStorage.__blocked__;

            var encodedUri = encodeURI(content);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "blocklist_export_" + Date.now() + ".json");
            document.body.appendChild(link); // Required for FF

            link.click(); // This will download the data file named "my_data.csv"
        }
        window.localStorage.removeItem("__blocked__")
        
    } else {
        next.click()
    }
}

if (window.localStorage.__export_fetlife__){
    setStartFetlifeExport()
} else {
    addFetlifeExportButton()
}