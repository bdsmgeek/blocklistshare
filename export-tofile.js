if (window.localStorage.__blocked__) {
    let content = "data:application/json;charset=utf-8," + window.localStorage.__blocked__;

    var encodedUri = encodeURI(content);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "blocklist_export_" + Date.now() + ".json");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv"
}