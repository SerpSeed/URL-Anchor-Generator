var clearURLS = document.getElementById("clear-urls");
var loadURLS = document.getElementById("load-urls");
var urlsTextArea = document.getElementById("urls-textarea");
var clearAnchors = document.getElementById("clear-anchors");
var loadAnchors = document.getElementById("load-anchors");
var anchorsTextArea = document.getElementById("anchors-textarea");
var genericKeywords = document.getElementById("generic-keywords");
var resultTextArea = document.getElementById("result-textarea");
var joinURLS = document.getElementById("join-urls");
var saveFile = document.getElementById("save-file");
var loadFile = document.getElementById("load-file");
var whichFile;


// Clear TextAreas
clearURLS.addEventListener("click", function () {
    urlsTextArea.value = "";
});

clearAnchors.addEventListener("click", function () {
    anchorsTextArea.value = "";
});

// File Loading
loadURLS.addEventListener("click", function () {
    whichFile = "urls";
    loadFile.click();
});

loadAnchors.addEventListener("click", function () {
    whichFile = "anchors";
    loadFile.click();
});

loadFile.onchange = function () {
    var file = loadFile.files[0];

    if (file.type.match(/text.*/)) {
        var reader = new FileReader();
        reader.readAsText(file);
        
        reader.onload = function () {
            if (whichFile == "urls") {
                urlsTextArea.value = reader.result;
            } else {
                anchorsTextArea.value = reader.result;
            }
        }
    } else {
        readerResult = "File Not Support! Please use a TXT file.";
    }
};

// Load List of Generic Keywords
genericKeywords.addEventListener("click", function () {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "/tools/files/generic-keywords.txt");
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            anchorsTextArea.value = xhr.responseText;
        } else {
            anchorsTextArea.value = "Loading Generic Keywords Failed!";
        }
    };
    xhr.send();
});

// Generate URL + Anchor Combination
joinURLS.addEventListener("click", function () {
    var noFollow = document.getElementById("no-follow").checked;
    var hrefTarget = document.getElementById("href-target").checked;
    var hrefTitle = document.getElementById("href-title").value;
    var hrefLang = document.getElementById("href-lang");
    var noFollowStr = "";
    var hrefTargetStr = "";
    var hrefTitleStr = "";
    var hrefLangStr = "";
    var urls = urlsTextArea.value.split(/\r?\n/);
    var anchors = anchorsTextArea.value.split(/\r?\n/);
    var urlsCleaned = urls.filter(n => n);
    var anchorsCleaned = anchors.filter(n => n);
    var urlsLength = urlsCleaned.length;
    var anchorsLength = anchorsCleaned.length;
    var result = [];
    var rkey = 0;

    // Check if any options have been set
    if (noFollow) {
        noFollowStr = " rel=\"nofollow\"";
    };

    if (hrefTarget) {
        hrefTargetStr = " target=\"_blank\"";
    };

    if (hrefTitle.trim()) {
        hrefTitleStr = " title=\"" + hrefTitle + "\"";
    };

    if (hrefLang.value.trim()) {    // This is lazy validation
        if (hrefLang.value.length <= 5) {
            hrefLangStr = " hreflang=\"" + hrefLang.value + "\"";
        } else {
            hrefLang.setAttribute("placeholder", "Invalid Language Code");
            hrefLang.value = "";
        };
    };

    // Generate URLs and Anchors
    var u;
    var a;
    for (u = 0; u < urlsLength; u++) {
        for (a = 0; a < anchorsLength; a++) {
            result[rkey++] = "<a href=\"" + urls[u] + "\"" + hrefTitleStr + hrefLangStr + noFollowStr + hrefTargetStr + ">" + anchors[a] + "</a>"
        };
    };

    // Write Results
    resultTextArea.value = result.join("\n");
});

// Save Results
saveFile.addEventListener("click", function () {
    var textToSaveAsBlob = new Blob([resultTextArea.value], { type: "text/plain" });
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("save-filename").value + ".txt";
    var downloadLink = document.createElement("a");
    
    downloadLink.download = fileNameToSaveAs;
    downloadLink.href = textToSaveAsURL;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});
