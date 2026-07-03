const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data/regions.json"), "utf8"));
const imageData = JSON.parse(fs.readFileSync(path.join(__dirname, "data/images.json"), "utf8"));
const { city, phone, siteUrl, districts } = data;
const { pageSets, schema, schemaBase, favicon, ogImage } = imageData;

function relPrefix(depth) {
  return depth === 0 ? "" : "../".repeat(depth);
}

function mainImagePath(depth, setId) {
  return `${relPrefix(depth)}images/main/before-${setId}.jpg`;
}

function schemaJsonLd(canonical) {
  const services = Object.values(schema);
  const images = services.map((s) => `${siteUrl}${schemaBase}/${s.file}`);
  const catalog = services.map((s, i) => `      {
        "@type": "ListItem",
        "position": ${i + 1},
        "item": {
          "@type": "Service",
          "name": "${s.name}",
          "provider": { "@type": "LocalBusiness", "name": "성남 올바른정리" },
          "image": "${siteUrl}${schemaBase}/${s.file}"
        }
      }`).join(",\n");

  return `{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "성남 올바른정리",
    "url": "${canonical}",
    "telephone": "${phone}",
    "image": ${JSON.stringify(images)},
    "description": "성남시 유품정리, 고독사청소, 특수청소, 폐기물처리 전문 상담",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "성남 올바른정리 서비스",
      "itemListElement": [
${catalog}
      ]
    }
  }`;
}

function headExtras(prefix, canonical) {
  const iconPath = prefix ? `${prefix}images/favicon.png` : "/images/favicon.png";
  return `  <link rel="icon" href="${iconPath}" />
  <link rel="apple-touch-icon" href="${iconPath}" />
  <meta property="og:image" content="${siteUrl}${ogImage}" />
  <script type="application/ld+json">
  ${schemaJsonLd(canonical)}
  </script>`;
}

function areaLinksHtml(pageDepth, currentGu, currentDong) {
  const toRegions = pageDepth === 3 ? "../../" : "../";
  let html = '<div class="area-grid">';
  for (const gu of districts) {
    const guPath = `${toRegions}${gu.slug}/`;
    const isCurrentGu = gu.slug === currentGu;
    html += `<div class="area-card"><h3>${gu.name}</h3><div class="chips">`;
    html += `<a href="${guPath}"${isCurrentGu && !currentDong ? ' aria-current="page"' : ""}>${gu.name} 전체</a>`;
    for (const dong of gu.dongs) {
      const dongPath = `${toRegions}${gu.slug}/${dong.slug}/`;
      const isCurrent = isCurrentGu && dong.slug === currentDong;
      html += `<a href="${dongPath}"${isCurrent ? ' aria-current="page"' : ""}>${dong.name}</a>`;
    }
    html += "</div></div>";
  }
  html += "</div>";
  return html;
}

function seoContent(placeName, isDong, parentGu) {
  const fullPlace = isDong ? `성남시 ${parentGu} ${placeName}` : `성남시 ${placeName}`;
  return `
    <h3>${fullPlace} 유품정리와 폐기물처리, 어떻게 진행되나요?</h3>
    <p>${fullPlace}에서는 유품정리, 고독사청소, 특수청소와 함께 쓰레기집청소, 빈집정리, 가정·이사·폐업폐기물처리 상담이 많이 접수됩니다. 아파트, 오피스텔, 빌라, 단독주택, 상가 등 현장 형태에 따라 작업 방식과 비용이 달라지므로 사전 상담이 중요합니다.</p>
    <h3>${fullPlace} 유품정리 비용은 어떻게 결정될까요?</h3>
    <p>유품정리 비용은 평수만으로 정해지지 않습니다. 유품의 양, 폐기물 반출량, 가구·가전 크기, 엘리베이터·주차 환경, 특수청소 필요 여부가 함께 반영됩니다. ${isDong ? `${placeName}은` : `${placeName} 일대는`} 공동주택과 신축 단지가 많아 반출 동선 확인이 특히 중요합니다.</p>
    <h3>${fullPlace} 폐기물처리가 필요한 대표 상황</h3>
    <ul>
      <li>이사 전후 불필요한 가구·생활용품 대량 반출</li>
      <li>빈집 매매·임대 전 남은 짐과 생활폐기물 정리</li>
      <li>장기간 방치된 공간의 쓰레기집청소</li>
      <li>사무실·매장 폐업 후 집기와 폐기물 처리</li>
    </ul>
    <h3>${fullPlace} 작업 전 확인하면 좋은 내용</h3>
    <p>유품정리의 경우 보관할 물품, 중요 서류, 통장, 도장, 사진 등을 가능한 범위에서 먼저 확인하는 것이 좋습니다. 폐기물처리는 전체 공간 사진, 폐기물 양, 건물 입구·엘리베이터 여부를 함께 알려주시면 더 빠른 상담이 가능합니다.</p>
  `;
}

function buildPage({ placeName, isDong, parentGu, guSlug, dongSlug, depth, mainSet }) {
  const prefix = relPrefix(depth);
  const imgBase = `${prefix}images/main/`;
  const fullPlace = isDong ? `성남시 ${parentGu} ${placeName}` : `성남시 ${placeName}`;
  const shortPlace = isDong ? placeName : placeName;
  const canonicalPath = isDong
    ? `regions/${guSlug}/${dongSlug}/`
    : `regions/${guSlug}/`;
  const canonical = `${siteUrl}/${canonicalPath}`;

  let breadcrumb = `<div class="breadcrumb"><a href="${prefix}index.html">성남 올바른정리</a>`;
  if (isDong) {
    breadcrumb += ` › <a href="${prefix}regions/${guSlug}/">${parentGu}</a> › ${placeName}`;
  } else {
    breadcrumb += ` › ${placeName}`;
  }
  breadcrumb += "</div>";

  const serviceOptions = [
    `${fullPlace} 유품정리`,
    `${fullPlace} 고독사청소`,
    `${fullPlace} 특수청소`,
    `${fullPlace} 쓰레기집청소`,
    `${fullPlace} 빈집정리`,
    `${fullPlace} 가정폐기물처리`,
    `${fullPlace} 이사폐기물처리`,
    `${fullPlace} 폐업폐기물처리`
  ].map((s) => `<option value="${s}">${s}</option>`).join("\n            ");

  const defaultRegion = fullPlace;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${fullPlace} 유품정리 · 폐기물처리 | 성남 올바른정리</title>
  <meta name="description" content="${fullPlace} 유품정리, 고독사청소, 특수청소, 쓰레기집청소, 빈집정리, 가정·이사·폐업폐기물처리 전문 상담. 성남 올바른정리가 현장에 맞춰 안내합니다." />
  <meta name="keywords" content="${fullPlace} 유품정리, ${fullPlace} 폐기물처리, ${fullPlace} 고독사청소, ${fullPlace} 빈집정리, 성남 올바른정리" />
  <meta property="og:title" content="${fullPlace} 유품정리 · 폐기물처리 | 성남 올바른정리" />
  <meta property="og:description" content="${fullPlace} 유품정리·폐기물처리 전문 상담. 현장 확인 후 비용과 일정을 안내합니다." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="stylesheet" href="${prefix}assets/css/style.css" />
${headExtras(prefix, canonical)}
</head>
<body>

<header>
  <div class="nav">
    <a href="${prefix}index.html" class="logo">성남 올바른정리</a>
    <nav class="nav-links">
      <a href="#service">서비스</a>
      <a href="#pricing">비용안내</a>
      <a href="#seo">정보안내</a>
      <a href="#process">진행과정</a>
      <a href="#reviews">작업후기</a>
      <a href="#area">서비스지역</a>
      <a href="#contact">상담접수</a>
    </nav>
    <a href="tel:01043932414" class="call-btn">전화 ${phone}</a>
  </div>
</header>

${breadcrumb}

<main>
  <section class="hero">
    <div class="hero-inner">
      <span class="badge">경기 ${fullPlace}</span>
      <h1>${fullPlace} 유품정리,<br>폐기물처리 전문 상담</h1>
      <p>성남 올바른정리는 ${fullPlace}에서 유품정리, 고독사청소, 특수청소와 쓰레기집청소, 빈집정리, 가정·이사·폐업폐기물처리를 상담합니다. 현장 상황을 확인한 뒤 필요한 작업 범위와 비용을 안내합니다.</p>
      <div class="hero-actions">
        <a href="#contact" class="btn btn-primary">상담 접수하기</a>
        <a href="tel:01043932414" class="btn btn-outline">전화 상담 ${phone}</a>
      </div>
    </div>
  </section>

  <section id="service">
    <div class="wrap">
      <div class="title">
        <span>SERVICE</span>
        <h2>${fullPlace} 서비스 안내</h2>
        <p>유품정리와 폐기물처리를 한곳에서 상담할 수 있습니다.</p>
      </div>
      <div class="service-grid">
        <div class="service-card">
          <small>유품 · 특수청소</small>
          <h3>유품정리 · 고독사청소 · 특수청소</h3>
          <p>보관할 물품과 정리 대상을 구분하고, 오염 정리·소독·냄새 저감이 필요한 현장은 특수청소 절차에 따라 진행합니다.</p>
          <div class="tags">
            <span>유품정리</span><span>고독사청소</span><span>특수청소</span><span>유품+특수청소</span>
          </div>
        </div>
        <div class="service-card">
          <small>폐기물 처리</small>
          <h3>쓰레기집청소 · 빈집정리 · 이사폐기물</h3>
          <p>생활폐기물, 가구, 가전, 이사 잔짐, 폐업 집기 등 반출이 필요한 현장을 분류·운반·상차까지 진행합니다.</p>
          <div class="tags">
            <span>쓰레기집청소</span><span>빈집정리</span><span>가정폐기물</span><span>이사폐기물</span><span>폐업폐기물</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="pricing" id="pricing">
    <div class="wrap">
      <div class="title">
        <span>PRICE</span>
        <h2>${fullPlace} 비용 안내</h2>
        <p>아래 금액은 기본 시작 가격이며, 현장 환경과 작업 범위에 따라 달라질 수 있습니다.</p>
      </div>
      <div class="price-note">* 부가세 별도 · 폐기물 운반비 포함 · 정확한 비용은 현장 확인 후 안내</div>
      <div class="price-grid">
        <div class="price-card">
          <strong>유품정리</strong>
          <div class="price">45만원 <span>부터~</span></div>
          <p>유품 분류와 공간 정리 기준 시작 금액입니다.</p>
        </div>
        <div class="price-card">
          <strong>고독사 특수청소</strong>
          <div class="price">80만원 <span>부터~</span></div>
          <p>오염 정리, 소독, 냄새 저감이 필요한 경우입니다.</p>
        </div>
        <div class="price-card">
          <strong>일반폐기물</strong>
          <div class="price">30만원 <span>부터~</span></div>
          <p>생활폐기물, 가정·이사폐기물 반출 기준입니다.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="seo">
    <div class="wrap">
      <div class="title">
        <span>GUIDE</span>
        <h2>${fullPlace} 정리·처리 안내</h2>
        <p>검색과 상담에 도움이 되도록 핵심 정보를 정리했습니다.</p>
      </div>
      <div class="seo-article">${seoContent(shortPlace, isDong, parentGu)}</div>
    </div>
  </section>

  <section class="why" id="process">
    <div class="wrap">
      <div class="title">
        <span>PROCESS</span>
        <h2>${fullPlace} 진행 과정 · 작업 사례</h2>
        <p>상담부터 마무리 확인까지 단계별로 진행합니다.</p>
      </div>
      <div class="process-grid">
        <div class="process-card"><div class="step">STEP 01</div><strong>상담 접수</strong><p>지역, 공간 형태, 필요한 서비스를 확인합니다.</p></div>
        <div class="process-card"><div class="step">STEP 02</div><strong>현장 확인</strong><p>물품·폐기물 양, 반출 환경, 오염 여부를 확인합니다.</p></div>
        <div class="process-card"><div class="step">STEP 03</div><strong>작업 진행</strong><p>분류, 정리, 청소·소독, 폐기물 반출을 진행합니다.</p></div>
      </div>
      <div style="margin-top:28px" class="photo-row">
        <img src="${imgBase}before-${mainSet}.jpg" alt="${fullPlace} 작업 전 현장" loading="lazy" />
        <img src="${imgBase}process-${mainSet}.jpg" alt="${fullPlace} 작업 중" loading="lazy" />
        <img src="${imgBase}after-${mainSet}.jpg" alt="${fullPlace} 작업 후" loading="lazy" />
      </div>
    </div>
  </section>

  <section id="reviews">
    <div class="wrap">
      <div class="title">
        <span>REVIEW</span>
        <h2>${fullPlace} 작업후기 · 고객후기</h2>
        <p>${fullPlace} 현장에서 진행한 작업 사례와 고객 후기를 확인할 수 있습니다.</p>
      </div>
      <div class="review-grid">
        <div class="review-card">
          <span class="tag">작업후기</span>
          <strong>${shortPlace} 유품정리 · 폐기물처리 현장</strong>
          <p>작업 전·중·후 사진과 정리 과정을 작업후기 페이지에서 확인하세요.</p>
          <a href="${prefix}reviews/?area=${encodeURIComponent(fullPlace)}" class="card-btn" style="margin-top:14px">작업후기 보기</a>
        </div>
        <div class="review-card">
          <span class="tag">고객후기</span>
          <strong>${shortPlace} 상담 · 작업 고객 후기</strong>
          <p>실제 상담과 작업을 진행한 고객분들의 후기를 모았습니다.</p>
          <a href="${prefix}reviews/customer/?area=${encodeURIComponent(fullPlace)}" class="card-btn" style="margin-top:14px">고객후기 보기</a>
        </div>
      </div>
    </div>
  </section>

  <section class="gallery-block" id="area">
    <div class="wrap">
      <div class="title">
        <span>REGION</span>
        <h2>성남시 서비스 지역</h2>
        <p>수정구 · 중원구 · 분당구 및 주요 동 단위 안내입니다.</p>
      </div>
      ${areaLinksHtml(isDong ? 3 : 2, guSlug, dongSlug || null)}
    </div>
  </section>

  <section class="contact-section" id="contact">
    <div class="wrap contact-box">
      <div class="contact-info">
        <h2>${fullPlace} 상담 접수</h2>
        <p>성함, 연락처, 지역, 필요한 서비스를 남겨주시면 확인 후 연락드립니다.</p>
        <a href="tel:01043932414" class="phone-large">${phone}</a>
      </div>
      <form id="contactForm">
        <select name="service" required>
          <option value="">필요한 서비스를 선택하세요</option>
          ${serviceOptions}
        </select>
        <input type="text" name="from_name" placeholder="성함" required />
        <input type="tel" name="phone" placeholder="연락처" required />
        <input type="text" name="region" placeholder="지역" value="${defaultRegion}" required />
        <textarea name="message" placeholder="상담 내용을 간단히 적어주세요"></textarea>
        <label class="agree">
          <input type="checkbox" id="privacyCheck" />
          <span>개인정보 수집 및 이용에 동의합니다. 수집항목은 성함, 연락처, 지역, 상담내용이며 상담 및 견적 안내 목적으로만 사용됩니다.</span>
        </label>
        <button type="submit">상담 신청하기</button>
      </form>
    </div>
  </section>

  <section class="related-section" id="related">
    <div class="wrap">
      <div class="title">
        <span>올바른 관련 서비스</span>
        <h2>서울·경기 올바른 서비스 바로가기</h2>
      </div>
      <div class="related-grid">
        <a href="https://www.allbarunclean.com/" class="related-card" target="_blank" rel="noopener">
          <h3>올바른수거</h3>
          <p>서울·경기 전 지역 유품정리·폐기물처리 종합 안내</p>
          <span>allbarunclean.com →</span>
        </a>
        <a href="https://yupum.allbarunclean.com/" class="related-card" target="_blank" rel="noopener">
          <h3>경기 올바른유품</h3>
          <p>유품정리, 고독사청소, 특수청소 전문 안내</p>
          <span>yupum.allbarunclean.com →</span>
        </a>
        <a href="https://waste.allbarunclean.com/" class="related-card" target="_blank" rel="noopener">
          <h3>경기 올바른폐기물</h3>
          <p>쓰레기집청소, 빈집정리, 가정·이사·폐업폐기물처리</p>
          <span>waste.allbarunclean.com →</span>
        </a>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="footer-inner">
    <div><strong>성남 올바른정리</strong><br />성남시 유품정리 · 폐기물처리 전문</div>
    <div class="footer-links">
      대표 상담 : <a href="tel:01043932414">${phone}</a>
      <a href="https://www.allbarunclean.com/" target="_blank" rel="noopener">올바른수거 · allbarunclean.com</a>
      <a href="https://yupum.allbarunclean.com/" target="_blank" rel="noopener">올바른 유품정리</a>
      <a href="https://waste.allbarunclean.com/" target="_blank" rel="noopener">올바른 폐기물처리</a>
    </div>
  </div>
</footer>

<a href="tel:01043932414" class="floating-call">전화 상담 ${phone}</a>

<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script src="${prefix}assets/js/contact.js?v=3"></script>
</body>
</html>`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writePage(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

for (const gu of districts) {
  const guDir = path.join(ROOT, "regions", gu.slug);
  const guDepth = 2;
  writePage(
    path.join(guDir, "index.html"),
    buildPage({
      placeName: gu.name,
      isDong: false,
      parentGu: gu.name,
      guSlug: gu.slug,
      depth: guDepth,
      mainSet: pageSets[gu.slug] || pageSets.index
    })
  );

  for (const dong of gu.dongs) {
    const dongDir = path.join(guDir, dong.slug);
    writePage(
      path.join(dongDir, "index.html"),
      buildPage({
        placeName: dong.name,
        isDong: true,
        parentGu: gu.name,
        guSlug: gu.slug,
        dongSlug: dong.slug,
        depth: guDepth + 1,
        mainSet: pageSets[dong.slug] || pageSets.index
      })
    );
  }
}

console.log("Region pages generated.");
