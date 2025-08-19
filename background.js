const sourceSite = "https://www.icisleri.gov.tr/kurumlar/icisleri.gov.tr/IcSite/illeridaresi/Mevzuat/Kanunlar/Anayasa.pdf";   // Only trigger if download is from here
const redirectSite = "https://www.youtube.com/"; // Redirect destination

chrome.downloads.onChanged.addListener(function (downloadDelta) {
  if (downloadDelta.state && downloadDelta.state.current === "complete") {
    chrome.downloads.search({ id: downloadDelta.id }, function (results) {
      if (results.length) {
        const download = results[0];
        console.log("Download finished:", download);

        // Must be a PDF AND come from the source site
        if (
          download.filename &&
          download.filename.toLowerCase().endsWith(".pdf") &&
          download.referrer &&
          download.referrer.startsWith(sourceSite)
        ) {
          if (download.tabId && download.tabId !== -1) {
            chrome.tabs.update(download.tabId, { url: redirectSite });
          } else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, { url: redirectSite });
              }
            });
          }
        }
      }
    });
  }
});

