"use strict";

const restaurants = window.RESTAURANTS;

const homeView = document.querySelector("#home-view");
const detailView = document.querySelector("#detail-view");
const restaurantList = document.querySelector("#restaurant-list");
const searchInput = document.querySelector("#search");
const resultCount = document.querySelector("#result-count");

function createElement(tag, text, className) {
  const element = document.createElement(tag);

  if (text !== undefined) {
    element.textContent = text;
  }

  if (className) {
    element.className = className;
  }

  return element;
}

function createMapLink(restaurant) {
  const link = createElement("a", "查看地圖 ↗");

  link.href = restaurant.mapsUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute(
    "aria-label",
    `在新分頁查看${restaurant.name}的 Google Maps`
  );

  return link;
}

function createImage(restaurant) {
  const image = document.createElement("img");

  image.src = restaurant.image;
  image.alt = restaurant.imageAlt;
  image.className = "restaurant-image";
  image.loading = "lazy";

  return image;
}

function createTextSection(title, text) {
  const section = createElement(
    "section",
    undefined,
    "detail-section"
  );

  section.append(
    createElement("h2", title),
    createElement("p", text)
  );

  return section;
}

function renderCards() {
  const keyword = searchInput.value.trim().toLocaleLowerCase();

  const filtered = restaurants.filter((restaurant) => {
    const text = [
      restaurant.name,
      restaurant.recommendedDish
    ].join(" ").toLocaleLowerCase();

    return text.includes(keyword);
  });

  restaurantList.replaceChildren();
  resultCount.textContent = `找到 ${filtered.length} 間店`;

  if (filtered.length === 0) {
    restaurantList.append(
      createElement(
        "p",
        "找不到符合的店家，試試其他店名或餐點名稱吧！",
        "empty-state"
      )
    );
    return;
  }

  for (const restaurant of filtered) {
    const card = createElement("article", undefined, "food-card");

    if (restaurant.image) {
      card.append(createImage(restaurant));
    }

    card.append(
      createElement("p", "我的埔里口袋名單", "card-label"),
      createElement("h3", restaurant.name),
      createElement(
        "p",
        `推薦餐點｜${restaurant.recommendedDish}`,
        "dish"
      ),
      createElement("p", restaurant.tagline, "tagline"),
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

    const actions = createElement("div", undefined, "card-actions");
    const readLink = createElement("a", "閱讀食記", "button");

    readLink.href = `#${restaurant.slug}`;
    readLink.setAttribute(
      "aria-label",
      `閱讀${restaurant.name}的食記`
    );

    actions.append(readLink, createMapLink(restaurant));
    card.append(actions);
    restaurantList.append(card);
  }
}

function showHome() {
  homeView.hidden = false;
  detailView.hidden = true;
  detailView.replaceChildren();

  document.title = "埔里日常食記";
  renderCards();
}

function showDetail(slug) {
  const restaurant = restaurants.find(
    (item) => item.slug === slug
  );

  homeView.hidden = true;
  detailView.hidden = false;
  detailView.replaceChildren();

  const panel = createElement("article", undefined, "detail-panel");
  const backLink = createElement("a", "← 返回推薦名單", "back-link");

  backLink.href = "#";
  panel.append(backLink);

  if (!restaurant) {
    const title = createElement("h1", "找不到這篇食記");
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

  const title = createElement("h1", restaurant.name);
  title.id = "detail-title";

  panel.append(
    createElement("p", "埔里日常・個人食記", "eyebrow"),
    title,
    createElement("p", restaurant.tagline, "detail-tagline")
  );

  if (restaurant.image) {
    panel.append(createImage(restaurant));
  }

  const infoBox = createElement("div", undefined, "info-box");

  infoBox.append(
    createElement(
      "p",
      `推薦餐點：${restaurant.recommendedDish}`
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

  panel.append(
    infoBox,
    createTextSection("我喜歡這間店的原因", restaurant.review),
    createTextSection("我的小提醒", restaurant.personalNote)
  );

  const mapSection = createElement(
    "section",
    undefined,
    "detail-section"
  );

  mapSection.append(
    createElement("h2", "想去吃看看？"),
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

function renderRoute(moveFocus = false) {
  const slug = window.location.hash.slice(1);

  if (slug) {
    showDetail(slug);
  } else {
    showHome();
  }

  if (moveFocus) {
    const title = document.querySelector(
      slug ? "#detail-title" : "#home-title"
    );

    title.tabIndex = -1;
    title.focus();
    window.scrollTo(0, 0);
  }
}

searchInput.addEventListener("input", renderCards);

window.addEventListener("hashchange", () => {
  renderRoute(true);
});

renderRoute();