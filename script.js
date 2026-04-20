var home = document.querySelector(".home");
var dot = document.querySelector(".dot");

if (home && dot) {
    var rafId = null;

    home.addEventListener("mousemove", function (event) {
        if (rafId) {
            return;
        }

        rafId = requestAnimationFrame(function () {
            dot.style.left = event.clientX + "px";
            dot.style.top = event.clientY + "px";
            rafId = null;
        });
    }, { passive: true });
}