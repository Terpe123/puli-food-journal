
"use strict";

// ========================================
// 1. 取得店家資料
// ========================================

const restaurants = window.RESTAURANTS;

if (!Array.isArray(restaurants)) {
  console.error(
    "店家資料載入失敗，請檢查 restaurants.js"
  );
}


// ========================================
// 2. 取得 HTML 元素
// ========================================

const homeView = document.querySelector("#home-view");
const detailView = document.querySelector("#detail-view");
const restaurantList = document.querySelector("#restaurant-list");
const searchInput = document.querySelector("#search");
const resultCount = document.querySelector("#result-count");


// ========================================
// 3. 檢查 HTML 元素
// ========================================

if (
  !homeView ||
  !detailView ||
  !restaurantList ||
  !searchInput ||
  !resultCount
) {
  console.error(
    "找不到必要的 HTML 元素，請檢查 index.html"
  );
}


// ========================================
// 4. 建立 HTML 元素
// ========================================

function createElement(tag, text, className) {
  const element = document.createElement(tag);

  if (text !== undefined && text !== null) {
    element.textContent = text;
  }

  if (className) {
    element.className = className;
  }

  return element;
}


// ========================================
// 5. 建立 Google Maps 連結
// ========================================

function createMapLink(restaurant) {
  const link = createElement("a", "查看地圖 ↗");

  link.href = restaurant.mapsUrl || "#";

  link.target = "_blank";

  link.rel = "noopener noreferrer";

  link.setAttribute(
    "aria-label",
    `在新分頁查看${restaurant.name}的 Google Maps`
  );

  return link;
}


// ========================================
// 6. 建立圖片
// ========================================

function createImage(restaurant) {
  const image = document.createElement("img");

  image.src = restaurant.image;

  image.alt = restaurant.imageAlt || restaurant.name;

  image.className = "restaurant-image";

  image.loading = "lazy";

  return image;
}


// ========================================
// 7. 建立食記文字區塊
// ========================================

function createTextSection(title, text) {
  const section = createElement(
    "section",
    undefined,
    "detail-section"
  );

  section.append(
    createElement("h2", title),
    createElement("p", text || "尚無相關內容。")
  );

  return section;
}


// ========================================
// 8. 搜尋店家並顯示卡片
// ========================================

function renderCards() {

  // 確認資料是否正常
  if (!Array.isArray(restaurants)) {

    resultCount.textContent = "店家資料載入失敗";

    restaurantList.replaceChildren();

    restaurantList.append(
      createElement(
        "p",
        "目前無法載入店家資料，請稍後重新整理。",
        "empty-state"
      )
    );

    return;
  }


  // 取得搜尋文字
  const keyword = searchInput.value
    .trim()
    .toLocaleLowerCase();


  // 搜尋符合條件的店家
  const filtered = restaurants.filter((restaurant) => {

    const searchableText = [

      restaurant.name,

      restaurant.recommendedDish,

      restaurant.tagline,

      restaurant.review,

      restaurant.personalNote,

      ...(Array.isArray(restaurant.searchKeywords)
        ? restaurant.searchKeywords
        : [])

    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();


    return searchableText.includes(keyword);

  });


  // 清空原本的搜尋結果
  restaurantList.replaceChildren();


  // 更新搜尋結果數量
  resultCount.textContent = `找到 ${filtered.length} 間店`;


  // 沒有搜尋結果
  if (filtered.length === 0) {

    restaurantList.append(
      createElement(
        "p",
        "找不到符合的店家，試試其他店名、餐點或類別關鍵字吧！",
        "empty-state"
      )
    );

    return;
  }


  // 建立店家卡片
  for (const restaurant of filtered) {

    const card = createElement(
      "article",
      undefined,
      "food-card"
    );


    // 店家圖片
    if (restaurant.image) {

      card.append(createImage(restaurant));

    }


    // 店家基本資訊
    card.append(

      createElement(
        "p",
        "我的埔里口袋名單",
        "card-label"
      ),

      createElement(
        "h3",
        restaurant.name || "未命名店家"
      ),

      createElement(
        "p",
        `推薦餐點｜${restaurant.recommendedDish || "尚未提供"}`,
        "dish"
      ),

      createElement(
        "p",
        restaurant.tagline || "",
        "tagline"
      ),

      createElement(
        "p",
        restaurant.priceNote || "價格未記錄",
        "price"
      ),

      createElement(
        "p",
        restaurant.priceNote
          ? "約略消費資訊，實際價格以店家公告為準。"
          : "實際價格以店家公告為準。",
        "small-note"
      )

    );


    // 建立操作按鈕
    const actions = createElement(
      "div",
      undefined,
      "card-actions"
    );


    // 閱讀食記
    const readLink = createElement(
      "a",
      "閱讀食記",
      "button"
    );

    readLink.href = `#${restaurant.slug}`;

    readLink.setAttribute(
      "aria-label",
      `閱讀${restaurant.name}的食記`
    );


    // 加入按鈕
    actions.append(
      readLink,
      createMapLink(restaurant)
    );


    card.append(actions);

    restaurantList.append(card);

  }

}


// ========================================
// 9. 顯示首頁
// ========================================

function showHome() {

  homeView.hidden = false;

  detailView.hidden = true;

  detailView.replaceChildren();

  document.title = "埔里日常食記";

  renderCards();

}


// ========================================
// 10. 顯示個別店家的食記
// ========================================

function showDetail(slug) {

  const restaurant = restaurants.find(
    (item) => item.slug === slug
  );


  homeView.hidden = true;

  detailView.hidden = false;

  detailView.replaceChildren();


  // 建立食記容器
  const panel = createElement(
    "article",
    undefined,
    "detail-panel"
  );


  // 返回首頁
  const backLink = createElement(
    "a",
    "← 返回推薦名單",
    "back-link"
  );

  backLink.href = "#";

  panel.append(backLink);


  // 找不到店家
  if (!restaurant) {

    const title = createElement(
      "h1",
      "找不到這篇食記"
    );

    title.id = "detail-title";

    panel.append(
      title,

      createElement(
        "p",
        "這個店家代號可能不存在，請返回首頁選擇其他店家。"
      )
    );

    detailView.append(panel);

    document.title = "找不到食記｜埔里日常食記";

    return;
  }


  // 食記標題
  const title = createElement(
    "h1",
    restaurant.name
  );

  title.id = "detail-title";


  panel.append(

    createElement(
      "p",
      "埔里日常・個人食記",
      "eyebrow"
    ),

    title,

    createElement(
      "p",
      restaurant.tagline || "",
      "detail-tagline"
    )

  );


  // 店家圖片
  if (restaurant.image) {

    panel.append(createImage(restaurant));

  }


  // 店家基本資訊
  const infoBox = createElement(
    "div",
    undefined,
    "info-box"
  );


  infoBox.append(

    createElement(
      "p",
      `推薦餐點：${restaurant.recommendedDish || "尚未提供"}`
    ),

    createElement(
      "p",
      `約略消費：${restaurant.priceNote || "價格未記錄"}`
    ),

    createElement(
      "p",
      restaurant.visitedAt
        ? `用餐時間：${restaurant.visitedAt}`
        : "用餐日期未記錄"
    ),

    createElement(
      "p",
      "消費資訊為作者約略紀錄，非已查核的現行菜單價格；實際價格以店家公告為準。",
      "small-note"
    )

  );


  // 食記內容
  panel.append(

    infoBox,

    createTextSection(
      "我喜歡這間店的原因",
      restaurant.review
    ),

    createTextSection(
      "我的小提醒",
      restaurant.personalNote
    )

  );


  // Google Maps 區域
  const mapSection = createElement(
    "section",
    undefined,
    "detail-section"
  );


  mapSection.append(

    createElement(
      "h2",
      "想去吃看看？"
    ),

    createMapLink(restaurant),

    createElement(
      "p",
      "出發前請確認店家最新營業資訊；優惠及活動以現場公告為準。",
      "small-note"
    )

  );


  panel.append(

    mapSection,

    createElement(
      "p",
      "以上為個人口味與用餐經驗，僅供參考。",
      "small-note"
    )

  );


  detailView.append(panel);

  document.title = `${restaurant.name}｜埔里日常食記`;

}


// ========================================
// 11. 網址切換
// ========================================

function renderRoute(moveFocus = false) {

  const slug = decodeURIComponent(
    window.location.hash.slice(1)
  );


  if (slug) {

    showDetail(slug);

  } else {

    showHome();

  }


  // 切換畫面後移動焦點
  if (moveFocus) {

    const title = document.querySelector(
      slug ? "#detail-title" : "#home-title"
    );

    if (title) {

      title.tabIndex = -1;

      title.focus();

    }

    window.scrollTo(0, 0);

  }

}


// ========================================
// 12. 搜尋框即時搜尋
// ========================================

searchInput.addEventListener(
  "input",
  renderCards
);


// ========================================
// 13. 網址變更時切換畫面
// ========================================

window.addEventListener(
  "hashchange",
  () => {

    renderRoute(true);

  }
);


// ========================================
// 14. 網頁載入時執行
// ========================================

if (
  homeView &&
  detailView &&
  restaurantList &&
  searchInput &&
  resultCount
) {

  renderRoute();

}
