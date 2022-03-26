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

function addFetlifeImportButton() {
    //https://www.html5rocks.com/en/tutorials/file/dndfiles//
    var blockedHeader = document.querySelector('h3.mv0.fw4.f5.lh-copy.gray-300')

    var import_container = document.createElement("div")

    var import_label = document.createElement("label")

    import_label.textContent = "Import: "

    import_container.appendChild(import_label)

    var blockImportButton = document.createElement("input")

    blockImportButton.type = "file"
    blockImportButton.name = "files[]"
    blockImportButton.id = "files"

    import_container.appendChild(blockImportButton)

    blockedHeader.appendChild(import_container)

    blockImportButton.addEventListener("change", (event) => {
        const fileList = event.target.files;
        window.localStorage.setItem("__import_list__", "[]")
        var reader = new FileReader();
        reader.onload = function() {
            let arrayOfBlocks = JSON.parse(reader.result)
            let importList = JSON.parse(window.localStorage.getItem("__import_list__"))
            importList = importList.concat(arrayOfBlocks);
            window.localStorage.setItem("__import_list__", JSON.stringify(importList))
        }

        for (let i = 0; i < fileList.length; i++) {
            let file = fileList.item(i);
            reader.readAsText(file);
        }
    })
}

function setStartExport() {
    console.log("start export set")
        //chrome.runtime.sendMessage("export_fetlife" (response))
    window.localStorage.setItem('__export_fetlife__', "true")
    setStartFetlifeExport()
}

function setStartImport() {
    console.log("start export set")
        //chrome.runtime.sendMessage("export_fetlife" (response))
    window.localStorage.setItem('__import_fetlife__', "true")
    setStartFetlifeImport()
}

function setStartFetlifeExport() {
    let list = []
    if (window.localStorage.__blocked__) {
        list = list.concat(JSON.parse(window.localStorage.__blocked__))
    }

    list = list.concat([...document.querySelectorAll('a.relative.overflow-hidden.dib.link')]
        .map(
            r => ({
                link: r.href,
                username: r.title
            })
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

function setStartFetlifeImport() {
    window.location.href = '...';
}

if (window.localStorage.__export_fetlife__) {
    setStartFetlifeExport()
} else {
    addFetlifeExportButton()
    addFetlifeImportButton()
}