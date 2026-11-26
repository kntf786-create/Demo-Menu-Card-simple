const menuData = {
    starter: [
        "Screenshot_2026-11-26-19-59-43-25_99c04817c0de5652397fc8b56c3b3817.jpg",
        "Screenshot_2026-11-26-19-59-49-65_99c04817c0de5652397fc8b56c3b3817.jpg",
        "Screenshot_2026-11-26-19-59-54-97_99c04817c0de5652397fc8b56c3b3817.jpg"
    ],
    mainCourse: [
        "Screenshot_2026-11-26-19-58-48-55_99c04817c0de5652397fc8b56c3b3817.jpg",
        "Screenshot_2026-11-26-19-59-06-87_99c04817c0de5652397fc8b56c3b3817.jpg",
        "Screenshot_2026-11-26-19-59-16-95_99c04817c0de5652397fc8b56c3b3817.jpg"
    ],
    desserts: [
        "Screenshot_2026-11-26-19-57-05-58_99c04817c0de5652397fc8b56c3b3817.jpg",
        "Screenshot_2026-11-26-19-57-20-82_99c04817c0de5652397fc8b56c3b3817.jpg",
        "Screenshot_2026-11-26-19-57-29-07_99c04817c0de5652397fc8b56c3b3817.jpg"
    ],
    refreshments: [
        "Screenshot_2026-11-26-19-57-48-01_99c04817c0de5652397fc8b56c3b3817.jpg",
        "Screenshot_2026-11-26-19-58-11-95_99c04817c0de5652397fc8b56c3b3817.jpg",
        "Screenshot_2026-11-26-19-58-27-36_99c04817c0de5652397fc8b56c3b3817.jpg"
    ]
};

let currentPages = [];
let currentIndex = 0;

// Cover image load hone ke baad background mein images quietly preload karein
window.addEventListener("load", () => {
    setTimeout(() => {
        Object.values(menuData).forEach(list => {
            list.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        });
    }, 300);
});

function openCategory(categoryKey) {
    const images = menuData[categoryKey];
    if (!images) return;

    currentPages = images;
    currentIndex = 0;

    const bookEl = document.getElementById("book");
    bookEl.innerHTML = "";

    currentPages.forEach((imgSrc, index) => {
        const pageDiv = document.createElement("div");
        pageDiv.className = "page";
        pageDiv.style.zIndex = currentPages.length - index;

        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = `Page ${index + 1}`;
        img.decoding = "sync";

        pageDiv.appendChild(img);
        bookEl.appendChild(pageDiv);
    });

    updateIndicator();

    document.getElementById("cover-screen").classList.remove("active");
    document.getElementById("flipbook-screen").classList.add("active");
}

function goHome() {
    document.getElementById("flipbook-screen").classList.remove("active");
    document.getElementById("cover-screen").classList.add("active");
}

function nextPage() {
    // 3rd image ke baad flip strictly stop
    if (currentIndex >= currentPages.length - 1) return;

    const pages = document.querySelectorAll(".page");
    pages[currentIndex].classList.add("flipped");
    currentIndex++;
    updateIndicator();
}

function prevPage() {
    if (currentIndex <= 0) return;

    currentIndex--;
    const pages = document.querySelectorAll(".page");
    pages[currentIndex].classList.remove("flipped");
    updateIndicator();
}

function updateIndicator() {
    document.getElementById("page-indicator").textContent = `${currentIndex + 1} / ${currentPages.length}`;
}

// Touch Swipe & Tap Navigation (Left side tap = Prev, Right side tap = Next)
const bookStage = document.getElementById("book-stage");
let touchStartX = 0;

bookStage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

bookStage.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 35) {
        if (diff > 0) nextPage();
        else prevPage();
    } else {
        if (touchEndX > window.innerWidth * 0.4) nextPage();
        else prevPage();
    }
}, { passive: true });
