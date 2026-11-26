const menuData = {
    starter: {
        title: "Starter",
        images: [
            "Screenshot_2026-11-26-19-59-43-25_99c04817c0de5652397fc8b56c3b3817.jpg",
            "Screenshot_2026-11-26-19-59-49-65_99c04817c0de5652397fc8b56c3b3817.jpg",
            "Screenshot_2026-11-26-19-59-54-97_99c04817c0de5652397fc8b56c3b3817.jpg"
        ]
    },
    mainCourse: {
        title: "Main Course",
        images: [
            "Screenshot_2026-11-26-19-58-48-55_99c04817c0de5652397fc8b56c3b3817.jpg",
            "Screenshot_2026-11-26-19-59-06-87_99c04817c0de5652397fc8b56c3b3817.jpg",
            "Screenshot_2026-11-26-19-59-16-95_99c04817c0de5652397fc8b56c3b3817.jpg"
        ]
    },
    desserts: {
        title: "Desserts",
        images: [
            "Screenshot_2026-11-26-19-57-05-58_99c04817c0de5652397fc8b56c3b3817.jpg",
            "Screenshot_2026-11-26-19-57-20-82_99c04817c0de5652397fc8b56c3b3817.jpg",
            "Screenshot_2026-11-26-19-57-29-07_99c04817c0de5652397fc8b56c3b3817.jpg"
        ]
    },
    refreshments: {
        title: "Refreshments",
        images: [
            "Screenshot_2026-11-26-19-57-48-01_99c04817c0de5652397fc8b56c3b3817.jpg",
            "Screenshot_2026-11-26-19-58-11-95_99c04817c0de5652397fc8b56c3b3817.jpg",
            "Screenshot_2026-11-26-19-58-27-36_99c04817c0de5652397fc8b56c3b3817.jpg"
        ]
    }
};

let currentPages = [];
let currentIndex = 0; // 0 = Page 1, 1 = Page 2, 2 = Page 3

// Fast Load ke liye sabhi images background mein preload karein
window.addEventListener("DOMContentLoaded", () => {
    Object.values(menuData).forEach(category => {
        category.images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    });
});

function openCategory(categoryKey) {
    const category = menuData[categoryKey];
    if (!category) return;

    currentPages = category.images;
    currentIndex = 0;

    document.getElementById("category-title").textContent = category.title;
    const bookEl = document.getElementById("book");
    bookEl.innerHTML = "";

    // Reverse z-index ke saath pages create karein taaki Page 1 sabse upar rahe
    currentPages.forEach((imgSrc, index) => {
        const pageDiv = document.createElement("div");
        pageDiv.className = "page";
        pageDiv.style.zIndex = currentPages.length - index;
        pageDiv.dataset.index = index;

        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = `${category.title} Page ${index + 1}`;
        img.loading = "eager";

        pageDiv.appendChild(img);
        bookEl.appendChild(pageDiv);
    });

    updateUI();

    document.getElementById("cover-screen").classList.remove("active");
    document.getElementById("flipbook-screen").classList.add("active");
}

function goHome() {
    document.getElementById("flipbook-screen").classList.remove("active");
    document.getElementById("cover-screen").classList.add("active");
}

function nextPage() {
    // STRICT STOP: Last page (index 2) ke baad flip nahi hoga
    if (currentIndex >= currentPages.length - 1) {
        return; 
    }

    const pages = document.querySelectorAll(".page");
    pages[currentIndex].classList.add("flipped");
    currentIndex++;
    updateUI();
}

function prevPage() {
    if (currentIndex <= 0) {
        return;
    }

    currentIndex--;
    const pages = document.querySelectorAll(".page");
    pages[currentIndex].classList.remove("flipped");
    updateUI();
}

function updateUI() {
    const total = currentPages.length;
    document.getElementById("page-indicator").textContent = `${currentIndex + 1} / ${total}`;
    
    // Buttons enable/disable state
    document.getElementById("prev-btn").disabled = (currentIndex === 0);
    document.getElementById("next-btn").disabled = (currentIndex === total - 1);
}

// Mobile Touch Swipe & Tap Support
const bookStage = document.getElementById("book-stage");
let touchStartX = 0;
let touchEndX = 0;

bookStage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

bookStage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
}, { passive: true });

function handleGesture() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
        if (diff > 0) {
            nextPage(); // Swipe Left -> Next Page
        } else {
            prevPage(); // Swipe Right -> Prev Page
        }
    } else {
        // Screen ke right half par tap karne se Next, left par tap karne se Prev
        const screenWidth = window.innerWidth;
        if (touchEndX > screenWidth * 0.45) {
            nextPage();
        } else {
            prevPage();
        }
    }
}
