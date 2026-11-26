const menuData = {
    starters: [
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

let currentImages = [];
let currentPageIndex = 0;
let isFlipping = false;

const homeScreen = document.getElementById('homeScreen');
const flipbookScreen = document.getElementById('flipbookScreen');
const bookContainer = document.getElementById('bookContainer');
const pageDots = document.getElementById('pageDots');

function openCategory(categoryKey) {
    currentImages = menuData[categoryKey] || [];
    currentPageIndex = 0;
    isFlipping = false;
    renderBook();

    homeScreen.classList.add('hidden');
    flipbookScreen.classList.add('active');
}

function goHome() {
    flipbookScreen.classList.remove('active');
    homeScreen.classList.remove('hidden');
    isFlipping = false;
}

function renderBook() {
    bookContainer.innerHTML = '';
    pageDots.innerHTML = '';

    currentImages.forEach((imgSrc, index) => {
        const page = document.createElement('div');
        page.className = 'page';
        page.style.zIndex = currentImages.length - index;
        page.id = `page-${index}`;

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Menu Page ${index + 1}`;
        page.appendChild(img);
        bookContainer.appendChild(page);

        const dot = document.createElement('div');
        dot.className = index === 0 ? 'dot active' : 'dot';
        dot.id = `dot-${index}`;
        pageDots.appendChild(dot);
    });
}

function updateBookState() {
    isFlipping = true;

    currentImages.forEach((_, index) => {
        const page = document.getElementById(`page-${index}`);
        const dot = document.getElementById(`dot-${index}`);

        if (index < currentPageIndex) {
            page.classList.add('flipped');
            page.style.zIndex = index + 1;
        } else {
            page.classList.remove('flipped');
            page.style.zIndex = currentImages.length - index;
        }

        dot.className = index === currentPageIndex ? 'dot active' : 'dot';
    });

    setTimeout(() => {
        isFlipping = false;
    }, 650);
}

function nextPage() {
    if (isFlipping) return;
    if (currentPageIndex < currentImages.length - 1) {
        currentPageIndex++;
        updateBookState();
    }
}

function prevPage() {
    if (isFlipping) return;
    if (currentPageIndex > 0) {
        currentPageIndex--;
        updateBookState();
    }
}

let touchStartX = 0;
let touchEndX = 0;

flipbookScreen.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

flipbookScreen.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 40;
    if (touchStartX - touchEndX > swipeThreshold) {
        nextPage();
    } else if (touchEndX - touchStartX > swipeThreshold) {
        prevPage();
    }
}
