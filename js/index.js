const PA_TARGET_URL = "https://www.tui.com/flughafen-report"; // without trailling slash
const PA_DEMO_URL = "https://contenthost.org/tui/flughafen-report"; // without trailling slash
const PA_TARGET_HOST = "www.tui.com";

function checkWebpFeature(feature, callback) {
    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha:
            "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation:
            "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
    };
    var img = new Image();
    img.onload = function () {
        var result = img.width > 0 && img.height > 0;
        callback(feature, result);
    };
    img.onerror = function () {
        callback(feature, false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
}

function isWebp(feature, result) {
    document.body.classList.add(result ? "webP" : "noWebp");
}

checkWebpFeature("lossy", isWebp);
const embedEngine = {
    init() {
        embedEngine.binds();
    },
    binds() {
        document.querySelectorAll(".embed-textarea").forEach((e) => {
            e.textContent = e.textContent.replace(
                "BASE_URL",
                window.location.hostname === PA_TARGET_HOST
                    ? PA_TARGET_URL
                    : PA_DEMO_URL
            );
        });
        let scrollToTopBtn = document.querySelector(".scrollup");

        document.querySelectorAll(".embed-button").forEach((e) => {
            e.addEventListener("click", embedEngine.embedBox);
        });

        const menuBtnRef = document.querySelector("[data-menu-button]");
        const mobileMenuRef = document.querySelector("[data-menu]");
        const expanded =
            menuBtnRef.getAttribute("aria-expanded") === "true" || false;

        menuBtnRef.addEventListener("click", () => {
            menuBtnRef.classList.toggle("is-open");
            menuBtnRef.setAttribute("aria-expanded", !expanded);

            mobileMenuRef.classList.toggle("is-open");
            document.body.classList.toggle("is-open");
        });
        mobileMenuRef.addEventListener("click", () => {
            menuBtnRef.classList.toggle("is-open");
            menuBtnRef.setAttribute("aria-expanded", !expanded);

            mobileMenuRef.classList.toggle("is-open");
            document.body.classList.toggle("is-open");
        });

        window.onscroll = throttle(scrollFunction, 500);

        function throttle(func, ms) {
            let isThrottled = false,
                savedArgs,
                savedThis;

            function wrapper() {
                if (isThrottled) {
                    // (2)
                    savedArgs = arguments;
                    savedThis = this;
                    return;
                }

                func.apply(this, arguments); // (1)

                isThrottled = true;

                setTimeout(function () {
                    isThrottled = false; // (3)
                    if (savedArgs) {
                        wrapper.apply(savedThis, savedArgs);
                        savedArgs = savedThis = null;
                    }
                }, ms);
            }

            return wrapper;
        }

        let prevScrollpos = window.scrollY;

        function scrollFunction() {
            let currentScrollPos = window.scrollY;

            if (
                prevScrollpos > currentScrollPos &&
                (document.body.scrollTop > 466 ||
                    document.documentElement.scrollTop > 466)
            ) {
                scrollToTopBtn.classList.add("showBtn");
            } else {
                scrollToTopBtn.classList.remove("showBtn");
            }
            prevScrollpos = currentScrollPos;
            if (
                document.body.scrollTop > 466 ||
                document.documentElement.scrollTop > 466
            ) {
                document.querySelector(".nav").classList.add("nav--sticky");
            } else {
                document.querySelector(".nav").classList.remove("nav--sticky");
            }

            function scrollToTop() {
                document.querySelector(".main-section").scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            }

            scrollToTopBtn.addEventListener("click", scrollToTop);
        }
    },

    embedBox() {
        this.parentNode.querySelector(".embed-content").classList.toggle("hidden");
    },
};
document.addEventListener("DOMContentLoaded", embedEngine.init);
