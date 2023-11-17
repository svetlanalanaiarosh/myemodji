(function() {
    var body = document.body;
    var menuTrigger = body.getElementsByClassName("menu-trigger")[0];

    if (menuTrigger !== undefined) {
        menuTrigger.addEventListener("click", function() {
            body.className = body.className === "menu-active" ? "" : "menu-active";
        });
    }
}).call(this);

let logFromMain = [];

function myLog(e) {
    console.log(e);
    logFromMain.push(e);
}

let itmHome = document.querySelector(".home"),
    itmShow = document.querySelector(".show"),
    itmApi = document.querySelector(".api"),
    itmContact = document.querySelector(".contact");

let cur = null,
    content = document.querySelector("#cont");

function createHandle(e) {
    return (t) => {
        t.preventDefault();
        t.stopPropagation();
        document.body.className = "";
        content.className = "";
        cur && cur.classList.toggle("CURRENT-ITEM");
        (cur = t.target).classList.toggle("CURRENT-ITEM");

        fetch(`resources/${e}`).then((t) => {
            if (!t.ok) throw new Error(`${e}: ${t.status}`);
            t.text().then((e) => {
                content.innerHTML = e;
            });
        }).catch((e) => console.log(`${e.name} | ${e.message}`));
    };
}

itmHome.addEventListener("click", createHandle("home.html"));
itmContact.addEventListener("click", createHandle("contacts.html"));
itmShow.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.className = "";
    content.className = "";
    content.innerHTML = "";

    for (let i = 0; i < logFromMain.length; i++) {
        let t = document.createElement("p");
        t.className = "logstr";
        t.textContent = logFromMain[i];
        content.append(t);
    }

    fetch("log.html").then((e) => {
        return e.ok ? e.text() : Promise.reject(`log.html: ${e.status}`);
    }).then((e) => {
        let t = JSON.parse(e);
        for (let i = 0; i < t.length; i++) {
            let n = document.createElement("p");
            n.className = "logswstr";
            n.textContent = t[i];
            content.append(n);
        }
    }).catch((e) => myLog(e)).finally(() => {
        itmShow.disabled = false;
    });
});

itmApi.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.className = "";
    content.className = "emojis";
    cur && cur.classList.toggle("CURRENT-ITEM");
    (cur = e.target).classList.toggle("CURRENT-ITEM");

    let url = "https://api.github.com/emojis";
    fetch(url).then((e) => {
        if (e.ok) return e.json();
        throw new Error(`${url}: ${e.status}`);
    }).then((e) => {
        showEmojis(content, e);
    }).catch((e) => console.error(e));
});

let event = null;

function showEmojis(content, emojis) {
    const template = "<article>\n<img src='resources/placeholder.png' data-src='emojisUrl' alt='NAME'>\n<h3>NM</h3>\n</article>";
    let html = "";

    for (let emoji in emojis) {
        html += template.replace(/NM/gi, emoji).replace(/emojisUrl/gi, emojis[emoji]);
    }

    content.innerHTML = html;
    progressiveLoadingImages();
}

function progressiveLoadingImages() {
    const images = document.querySelectorAll("img[data-src]");

    const loadImage = (img) => {
        img.setAttribute("src", img.getAttribute("data-src"));
        img.onload = () => {
            img.removeAttribute("data-src");
        };
    };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        images.forEach((img) => observer.observe(img));
    } else {
        images.forEach((img) => loadImage(img));
    }
}

document.createEvent ?
    ((event = document.createEvent("HTMLEvents")).initEvent("click", true, true),
        event.eventName = "click", itmHome.dispatchEvent(event)) :
    ((event = document.createEventObject()).eventName = "click",
        event.eventType = "click", itmHome.fireEvent("on" + event.eventType, event));

"serviceWorker" in navigator ?
    (myLog("'serviceWorker' in navigator"),
        navigator.serviceWorker.register("sw.js").then((reg) => {
            myLog("ServiceWorker registered!");
            navigator.serviceWorker.ready.then((reg) => {
                myLog("ServiceWorker ready!");
            });
        }).catch((err) => {
            console.error(err);
        })) :
    myLog("No 'serviceWorker' in navigator");

let installBtn = document.querySelector("#install-btn"),
    deferredPrompt = null;

function installApp() {
    deferredPrompt.prompt();

    installBtn.disabled = true;

    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
            console.log("PWA setup accepted");
            installBtn.style.visibility = "hidden";
        } else {
            console.log("PWA setup rejected");
        }

        installBtn.disabled = false;
        deferredPrompt = null;
    });
}

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn && (installBtn.className = "active");
    myLog("beforeinstallprompt event was fired");
    installBtn.addEventListener("click", installApp);
  // Получаем элемент с id "mainText"
var mainTextElement = document.getElementById("mainText");

// Проверяем, существует ли такой элемент
if (mainTextElement) {
    // Меняем текст в элементе
    mainTextElement.textContent = "Новый текст на главной странице.";
}
});