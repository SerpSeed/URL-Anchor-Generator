jQuery(document).ready(function() {

  // Execute on button click
  jQuery('button').click(function(e) {

    // Check which button has been clicked - match each case
    var idClicked = e.target.id;

    switch (idClicked) {

      case "joinURLs": // Join URLs and Anchors w/ options

        // Read and clean URLs/Anchors from empty lines and whitespace, set variables
        var urls = jQuery('#urls').val().split(/\r?\n/);
        var anchors = jQuery('#anchors').val().split(/\r?\n/);
        var urlsCleaned = urls.filter(n => n);
        var anchorsCleaned = anchors.filter(n => n);
        var urlsLength = urlsCleaned.length;
        var anchorsLength = anchorsCleaned.length;
        var result = [];
        var rkey = 0;

        // Set optional variables
        var noFollow = jQuery('#noFollow').prop("checked");
        var hrefTarget = jQuery('#hrefTarget').prop("checked");
        var hrefTitle = jQuery('#hrefTitle').val();
        var hrefLang = jQuery('#hrefLang').val();
        var noFollowStr = "";
        var hrefTargetStr = "";
        var hrefTitleStr = "";
        var hrefLangStr = "";

        // Check if any options have been enabled/set
        if (noFollow) {
          noFollowStr = " rel=\"nofollow\"";
        }

        if (hrefTarget) {
          hrefTargetStr = " target=\"_blank\"";
        }

        if (hrefTitle.trim()) {
          hrefTitleStr = " title=\"" + hrefTitle + "\"";
        }

        if (hrefLang.trim()) {
          if (hrefLang.length === 2) {
            hrefLangStr = " hreflang=\"" + hrefLang + "\"";
          } else {
            jQuery('#hrefLang').val("");
            jQuery('#hrefLang').attr("placeholder", "Invalid Language Code")
          }
        }

        // Generate URLs and Anchors
        for (var u = 0; u < urlsLength; u++) {
          for (var a = 0; a < anchorsLength; a++) {
            result[rkey++] = "<a href=\"" + urls[u] + "\"" + noFollowStr + hrefTargetStr + hrefTitleStr + hrefLangStr + ">" + anchors[a] + "</a>"
          }
        }

        // Print Result and break
        jQuery('#result').val(result.join('\n'));
        break;

      case "clearURLs":	// Clear URL Textarea
        e.preventDefault();
        jQuery('#urls').val('');
        break;

      case "clearAnchors":	// Clear Anchor Textarea
        e.preventDefault();
        jQuery('#anchors').val('');
        break;

      case "loadURLs":	// Load URLs from file - Requires HTML input type="file"
        jQuery('#loadURLFile').trigger('click');
        break;

      case "loadAnchors":	// Load Anchors from file - Requires HTML input type="file"
        jQuery('#loadAnchorFile').trigger('click');
        break;

      case "genericKeywords":	// Load list of generic keywords from server source - Needs to be on same domain as script
        jQuery.ajax({
          url: "https://serpseed.com/wp-content/themes/serpseed/seo-tools/files/generic-keywords.txt",
          dataType: "text",
          success: function(data) {
            jQuery('#anchors').val(data);
          }
        });
        break;

      case "saveFile":	// Save contents of results textarea to .TXT file
        var textToSave = jQuery('#result').val();
        var textToSaveAsBlob = new Blob([textToSave], {
          type: "text/plain"
        });
        var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
        var fileNameToSaveAs = jQuery('#saveFilename').val() + ".txt"

        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        downloadLink.href = textToSaveAsURL;
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);

        downloadLink.click();
        break;

    } // End Switch Satement

  });

  // Handlers could be improved, need way to combine both into one.
  // Handler for loading URL Files
  jQuery('#loadURLFile').click(function() {
    var fileInput = jQuery('#loadURLFile');
    var fileDisplayArea = jQuery('#urls');

    jQuery(fileInput).change(function() {
      var file = jQuery(fileInput).prop('files')[0];
      var textType = /text.*/;

      if (file.type.match(textType)) {
        var reader = new FileReader();
        reader.onload = function() {

          jQuery(fileDisplayArea).val(reader.result);

        }
        reader.readAsText(file);
      } else {
        jQuery(fileDisplayArea).val("File not supported!");
      }
    });
  });

  // Handler for loading Anchor Files
  jQuery('#loadAnchorFile').click(function() {
    var fileInput = jQuery('#loadAnchorFile');
    var fileDisplayArea = jQuery('#anchors');

    jQuery(fileInput).change(function() {
      var file = jQuery(fileInput).prop('files')[0];
      var textType = /text.*/;

      if (file.type.match(textType)) {
        var reader = new FileReader();
        reader.onload = function() {

          jQuery(fileDisplayArea).val(reader.result);

        }
        reader.readAsText(file);
      } else {
        jQuery(fileDisplayArea).val("File not supported!");
      }
    });
  });

  function destroyClickedElement(event) {
    document.body.removeChild(event.target);
  }

});
