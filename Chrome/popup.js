chrome.storage.local.get('showRanks', function (obj) {
    chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        let tab = tabs[0]
        let tabUrl = tab.url
        let arg = tabUrl.split('/')
        if (arg.length > 2 && arg[2] === 'codeforces.com' && obj.showRanks) {
            $('#found').show()
            $('#notFound').hide()
        } else {
            $('#found').hide()
            $('#notFound').show()
        }
    })
})  


$('#magic-btn').click(() => {
    let newRank = $('#selectedRank').val()
    chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: "UPDATE-RANK",
            newRank: newRank
        });
    })
})
