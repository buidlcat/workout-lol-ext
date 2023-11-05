const Fuse = require("fuse.js");
const mwExercises = require("./exercises.json");

const USE_FEMALE_URL = false;

// Fuzzy search
const fuse = new Fuse(mwExercises, {
    keys: ["slug"],
});

const seenNodes = new Set();

// Add observer to watch for elements we're interested in
const observer = new MutationObserver((mutationList) =>
    mutationList
        .filter((m) => m.type === "childList")
        .forEach((m) => {
            m.addedNodes.forEach((n) => {
                var videoIcons = document.querySelectorAll(
                    "svg.tabler-icon.tabler-icon-video"
                );

                if (videoIcons.length > 0) {
                    for (var v of videoIcons) {
                        if (seenNodes.has(v)) {
                            continue;
                        } else {
                            seenNodes.add(v);
                        }

                        addExternalLinkButton(v);
                    }
                }

                var timelineHeaders = document.querySelectorAll(
                    "div.mantine-Timeline-itemContent"
                );

                if (timelineHeaders.length > 0) {
                    for (var t of timelineHeaders) {
                        if (seenNodes.has(t)) {
                            continue;
                        } else {
                            seenNodes.add(t);
                        }

                        addExternalLinkExerciseButton(t);
                    }
                }
            });
        })
);

observer.observe(document, { childList: true, subtree: true });

function transformUrl(url) {
    if (USE_FEMALE_URL) {
        return url.replace("/male/", "/female/");
    } else {
        return url;
    }
}

// Add external link button to timeline headers
function addExternalLinkExerciseButton(timelineHeader) {
    var exerciseName = timelineHeader.innerText;
    const fuzzyResult = fuse.search(exerciseName);

    const btnClass = document.querySelector(
        "button.mantine-Button-root"
    ).className;

    if (fuzzyResult.length > 0) {
        var button = document.createElement("button");
        button.className = btnClass;
        button.addEventListener("click", () => {
            const url = transformUrl(fuzzyResult[0].item.url);
            window.open(url, "_blank");
        });

        button.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-external-link" width="1rem" height="1rem" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
                            <path d="M11 13l9 -9"></path>
                            <path d="M15 4h5v5"></path>`;
        button.style.float = "right";
        timelineHeader.parentElement.prepend(button);
    } else {
        console.log("No match for " + exerciseName);
    }
}

// Add external link button to video icon
function addExternalLinkButton(iconElem) {
    var exerciseName = iconElem.parentElement.parentElement.innerText;
    var btnClass = iconElem.parentElement.className;

    var button = document.createElement("button");
    button.className = btnClass;

    const fuzzyResult = fuse.search(exerciseName);
    if (fuzzyResult.length > 0) {
        button.addEventListener("click", () => {
            const url = transformUrl(fuzzyResult[0].item.url);
            window.open(url, "_blank");
        });

        button.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-external-link" width="1rem" height="1rem" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
       <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
       <path d="M11 13l9 -9"></path>
       <path d="M15 4h5v5"></path>`;

        button.style.marginLeft = "5px";

        iconElem.parentElement.parentElement.appendChild(button);
    } else {
        console.log("No match for " + exerciseName);
    }
}
