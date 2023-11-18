(function () {
    var body = document.body;
    var menuTrigger = body.getElementsByClassName("menu-trigger")[0];

    if (menuTrigger !== undefined) {
        menuTrigger.addEventListener("click", function () {
            body.classList.toggle("menu-active");
        });
    }
}).call(this);
