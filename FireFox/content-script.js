const getUserName = () => {
    let headerElement = document.getElementById("header");
    if (!headerElement) {
        browser.storage.local.set({ showRanks: false })
        return "";
    }
    let headerContent = headerElement.outerHTML;
    let index = headerContent.match("/profile/")
    if (index === null) {
        // No logged in user
        browser.storage.local.set({ showRanks: false })
        return "";
    }
    let userName = "";
    for (let i = index.index + 9; ; i++) {
        if (headerContent[i] == "\"") break;
        userName += headerContent[i];
    }
    browser.storage.local.set({ showRanks: true })
    return userName;
}

let userName = getUserName();
let storageRank = "";

const updatePage = () => {
    if (!storageRank) return;
    const getNewClassName = (rank) => {
        if (rank == "Unrated") return "user-black";
        if (rank == "Newbie") return "user-gray";
        if (rank == "Pupil") return "user-green";
        if (rank == "Specialist") return "user-cyan";
        if (rank == "Expert") return "user-blue";
        if (rank == "Candidate Master") return "user-violet";
        if (rank == "Master") return "user-orange";
        if (rank == "International Master") return "user-orange";
        if (rank == "Grandmaster") return "user-red";
        if (rank == "International Grandmaster") return "user-red";
        if (rank == "Legendary Grandmaster") return "user-legendary";
        if (rank == "Headquarters") return "user-admin";
    }

    const getCurrentUserClassName = (userName, element) => {
        if (element.querySelector(`[title="Unrated, ${userName}"]`)) return "user-black";
        if (element.querySelector(`[title="Newbie ${userName}"]`)) return "user-gray";
        if (element.querySelector(`[title="Pupil ${userName}"]`)) return "user-green";
        if (element.querySelector(`[title="Specialist ${userName}"]`)) return "user-cyan";
        if (element.querySelector(`[title="Expert ${userName}"]`)) return "user-blue";
        if (element.querySelector(`[title="Candidate Master ${userName}"]`)) return "user-violet";
        if (element.querySelector(`[title="Master ${userName}"]`)) return "user-orange";
        if (element.querySelector(`[title="International Master ${userName}"]`)) return "user-orange";
        if (element.querySelector(`[title="Grandmaster ${userName}"]`)) return "user-red";
        if (element.querySelector(`[title="International Grandmaster ${userName}"]`)) return "user-red";
        if (element.querySelector(`[title="Legendary Grandmaster ${userName}"]`)) return "user-legendary";
        if (element.querySelector(`[title="Headquarters, ${userName}"]`)) return "user-admin";
        return "";
    }
    let personalSideBar = document.getElementsByClassName('personal-sidebar');
    let currentRankClassName = "";
    if (personalSideBar.length == 1) {
        currentRankClassName = getCurrentUserClassName(userName, personalSideBar[0]);
    }
    else {
        currentRankClassName = getCurrentUserClassName(userName, document);
    }
    if (currentRankClassName == "") {
        return;
    }
    let newRankClassName = getNewClassName(storageRank);
    let elements = document.getElementsByClassName(currentRankClassName);
    for (let i = 0; i < elements.length;) {
        let user = elements.item(i);
        let title = user.getAttribute("title");
        if (title) {
            if (!title.endsWith(userName)) {
                i++;
                continue;
            }
            let newTitle = storageRank;
            if ((storageRank == 'Unrated' || storageRank == 'Headquarters')) newTitle += ',';
            newTitle += " " + userName;
            user.setAttribute('title', newTitle);
        }
        if (user.parentElement.classList == "smaller") {
            i++;
            continue;
        }
        user.classList = [newRankClassName];
        if(currentRankClassName == newRankClassName) {
            i++;
        }
        if (user.textContent == userName) {
            user.classList.add("rated-user");
        }
    }
    let userRankElement = document.getElementsByClassName('user-rank');
    if (userRankElement.length == 1) {
        userRankElement[0].getElementsByClassName(newRankClassName)[0].textContent = storageRank;
    }
}
storageRank = localStorage.getItem('storageRank');
if (storageRank) updatePage();
browser.runtime.onMessage.addListener((message) => {
    if (message.command == "UPDATE-RANK") {
        localStorage.setItem('storageRank', message.newRank);
        storageRank = message.newRank
        updatePage();
    }
});
