/* Rendering and small interactions. Edit site.config.js to change the content. */
(() => {
  "use strict";

  const data = window.SITE_DATA;
  if (!data) return;
  const $ = (selector) => document.querySelector(selector);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const setText = (selector, value) => { $(selector).textContent = value || ""; };
  // Restrict configurable links to web, email, and local asset paths.
  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, document.baseURI);
      if (["https:", "http:", "mailto:"].includes(url.protocol)) return url.href;
      if (url.protocol === "file:" && !/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith("//")) return url.href;
    } catch { /* An invalid link is omitted. */ }
    return "";
  }
  function link(label, href, className) {
    const url = safeUrl(href);
    if (!url) return null;
    const anchor = el("a", className, label);
    anchor.href = url;
    if (/^https?:/.test(url) && new URL(url).origin !== location.origin) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    return anchor;
  }

  const icons = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    scholar: '<path d="m2 9 10-6 10 6-10 6L2 9Z"/><path d="M6 12v5c4 3 8 3 12 0v-5M22 9v8"/>',
    github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .1-1.5-.5-2 3.3-.4 6.5-1.6 6.5-7a5.4 5.4 0 0 0-1.5-3.7 5 5 0 0 0-.1-3.6S18.1 1.3 15 3a13.5 13.5 0 0 0-6 0C5.9 1.3 4.6 1.7 4.6 1.7a5 5 0 0 0-.1 3.6A5.4 5.4 0 0 0 3 9c0 5.4 3.2 6.6 6.5 7-.6.5-.6 1.3-.5 2v4"/>',
    external: '<path d="M14 3h7v7m0-7L10 14"/><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
    network: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="19" r="2"/><circle cx="20" cy="19" r="2"/><path d="m7 7 3 3m4-1 3-3M7 18l3-4m4 0 4 4"/>',
    human: '<circle cx="8" cy="7" r="3"/><path d="M2 21v-3a6 6 0 0 1 12 0v3m4-16 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Zm1 10v6m-3-3h6"/>',
    science: '<path d="M9 3h6m-5 0v7l-6 9a1.5 1.5 0 0 0 1.2 2h13.6a1.5 1.5 0 0 0 1.2-2l-6-9V3M7 15h10"/><circle cx="11" cy="18" r=".5"/><circle cx="14" cy="13" r=".5"/>',
  };
  function icon(name, className) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.35");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    if (className) svg.setAttribute("class", className);
    svg.innerHTML = icons[name] || icons.external;
    return svg;
  }
  function optionalImage(source, alt, className, onError) {
    const url = safeUrl(source);
    if (!url || url.startsWith("mailto:")) return null;
    const image = el("img", className);
    image.alt = alt;
    image.src = url;
    image.addEventListener("error", () => { image.remove(); onError?.(); }, { once: true });
    return image;
  }

  const profile = data.profile;
  document.title = `${profile.name} — Academic Homepage`;
  $("meta[name='description']").content = `${profile.name}, ${profile.role} at ${profile.affiliation}. Research, publications, and experience.`;
  setText("#brand-name", profile.name);
  setText("#profile-name", profile.name);
  setText("#profile-native-name", profile.nativeName);
  $("#profile-native-name").hidden = !profile.nativeName;
  setText("#portrait-initials", profile.initials);
  setText("#profile-role", profile.role);
  setText("#profile-department", profile.department);
  setText("#profile-affiliation", profile.affiliation);
  setText("#profile-location", profile.location);
  $(".profile-location").hidden = !profile.location;
  setText("#profile-note p", profile.note);
  $("#profile-note").hidden = !profile.note;
  if (profile.avatar) {
    const photo = optionalImage(profile.avatar, `Portrait of ${profile.name}`, "portrait-photo");
    if (photo) $("#profile-portrait").append(photo);
  }
  for (const item of profile.links) {
    const anchor = link("", item.href, "profile-link");
    if (!anchor) continue;
    anchor.append(icon(item.icon), el("span", "", item.label), el("span", "link-arrow", "↗"));
    anchor.lastElementChild.setAttribute("aria-hidden", "true");
    $("#profile-links").append(anchor);
  }
  if (safeUrl(profile.cv)) {
    const cv = $("#cv-link");
    cv.href = safeUrl(profile.cv);
    cv.target = "_blank";
    cv.rel = "noopener noreferrer";
    cv.hidden = false;
  }
  const email = profile.email ? `mailto:${profile.email}` : "";
  for (const selector of ["#contact-link", "#contact-email"]) {
    $(selector).hidden = !email;
    if (email) $(selector).href = email;
  }

  const titleLines = data.about.title.split("\n");
  titleLines.forEach((line, index) => {
    if (index) $("#about-heading").append(el("br"));
    $("#about-heading").append(el("span", index ? "heading-second-line" : "", line));
  });
  for (const paragraph of data.about.paragraphs) $("#biography").append(el("p", "", paragraph));
  $("#news-block").hidden = !data.about.news.length;
  for (const news of data.about.news) {
    const row = el("li");
    row.append(el("span", "news-date", news.date), el("span", "", news.text));
    $("#news-list").append(row);
  }

  function hideEmptySection(id, isEmpty) {
    if (!isEmpty) return;
    $(`#${id}`).hidden = true;
    $(`.nav-link[href='#${id}']`).hidden = true;
  }
  hideEmptySection("research", !data.research.items.length);
  setText("#research-intro", data.research.intro);
  for (const item of data.research.items) {
    const card = el("article", "research-card");
    card.append(icon(item.icon, "research-icon"), el("h3", "", item.title), el("p", "", item.description));
    $("#research-grid").append(card);
  }

  function publicationArt(style) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 150 120");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");
    if (style === "layers") {
      svg.innerHTML = '<path d="m29 65 46-25 46 25-46 25Z" fill="#e1e9d8" stroke="#a2b491"/><path d="m29 54 46-25 46 25-46 25Z" fill="#eaf0e3" stroke="#93a982"/><path d="m29 43 46-25 46 25-46 25Z" fill="#f1f5eb" stroke="#809b70"/><path d="m52 43 23-12 23 12-23 12Z" fill="#bdcfae"/><path d="M75 55v35m-46-47v22m92-22v22" stroke="#a5b995" stroke-dasharray="3 3"/><path d="M45 103h60" stroke="#c6d2bc"/>';
    } else if (style === "dots") {
      let markup = '<path d="M24 92h104M29 24v73" stroke="#c2cfb5"/>';
      for (let i = 0; i < 24; i++) {
        const x = 40 + ((i * 19) % 78);
        const y = 80 - ((i * 13) % 47);
        markup += `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 3 : 2}" fill="${i % 3 === 0 ? "#789467" : "#b3c4a3"}"/>`;
      }
      markup += '<path d="M37 83c19-4 31-13 42-20s24-15 38-32" stroke="#6c895b" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>';
      svg.innerHTML = markup;
    } else {
      svg.innerHTML = '<g stroke="#bcccae" stroke-width="1"><path d="m34 34 40 27-36 26m-4-53 43-10-3 37 40-24m-37-13 37 13-4 47-36-23 2 39-38-13m36-26 40-24M38 87l72-3M34 34l76 50M77 24l-1 76"/></g><g fill="#9db38d" stroke="#edf1e7" stroke-width="3"><circle cx="34" cy="34" r="6"/><circle cx="77" cy="24" r="5"/><circle cx="114" cy="37" r="6"/><circle cx="38" cy="87" r="6"/><circle cx="110" cy="84" r="5"/><circle cx="76" cy="100" r="4"/></g><circle cx="74" cy="61" r="9" fill="#6c885b" stroke="#e2ead9" stroke-width="5"/>';
    }
    return svg;
  }

  const papers = [...data.publications.items].sort((a, b) => Number(b.year) - Number(a.year));
  setText("#publications-note", data.publications.note);
  const years = ["All", ...new Set(papers.map((paper) => String(paper.year)))];
  for (const year of years) {
    const button = el("button", "year-filter", year);
    button.type = "button";
    button.setAttribute("aria-pressed", String(year === "All"));
    button.addEventListener("click", () => {
      for (const sibling of $("#year-filters").children) sibling.setAttribute("aria-pressed", String(sibling === button));
      renderPublications(year);
    });
    $("#year-filters").append(button);
  }
  $("#year-filters").hidden = papers.length === 0;

  function renderPublications(year = "All") {
    const container = $("#publication-list");
    container.replaceChildren();
    const filtered = papers.filter((paper) => year === "All" || String(paper.year) === year);
    if (!filtered.length) container.append(el("p", "empty-message", "New work is on the way. Stay tuned."));
    for (const paper of filtered) {
      const article = el("article", "publication");
      const art = el("div", "publication-art");
      art.append(publicationArt(paper.illustration));
      if (paper.image) {
        const img = optionalImage(paper.image, `Illustration for ${paper.title}`, "");
        if (img) {
          art.firstElementChild.setAttribute("hidden", "");
          img.addEventListener("error", () => { art.firstElementChild.removeAttribute("hidden"); }, { once: true });
          img.loading = "lazy";
          art.append(img);
        }
      }
      const body = el("div", "publication-content");
      body.append(el("h3", "", paper.title));
      const authors = el("p", "publication-authors");
      paper.authors.forEach((author, index) => {
        if (index) authors.append(document.createTextNode(", "));
        authors.append(el(author.replace(/\*/g, "").trim() === profile.name ? "strong" : "span", "", author));
      });
      const venue = el("p", "publication-venue");
      if (paper.venueShort) venue.append(el("span", "venue-badge", paper.venueShort));
      venue.append(el("span", "", paper.venue));
      body.append(authors, venue);
      if (paper.summary) body.append(el("p", "publication-summary", paper.summary));
      const actions = el("div", "publication-actions");
      for (const item of paper.links || []) {
        const anchor = link(item.label, item.href, "paper-link");
        if (anchor) { const arrow = el("span", "", "↗"); arrow.setAttribute("aria-hidden", "true"); anchor.append(arrow); actions.append(anchor); }
      }
      if (paper.bibtex?.trim()) {
        const cite = el("button", "paper-link", "Cite");
        cite.type = "button";
        cite.setAttribute("aria-label", `Cite: ${paper.title}`);
        cite.addEventListener("click", () => {
          setText("#citation-text", paper.bibtex);
          setText("#copy-status", "");
          $("#citation-dialog").showModal();
        });
        actions.append(cite);
      }
      if (actions.children.length) body.append(actions);
      article.append(art, body);
      container.append(article);
    }
  }
  renderPublications();

  hideEmptySection("experience", !data.experience.length);
  for (const item of data.experience) {
    const row = el("article", `experience-item${item.current ? " current" : ""}`);
    const body = el("div", "experience-content");
    body.append(el("h3", "", item.title), el("p", "experience-institution", item.institution));
    if (item.detail) body.append(el("p", "experience-detail", item.detail));
    row.append(el("p", "experience-period", item.period), body);
    $("#experience-list").append(row);
  }
  setText("#contact-note", data.contact);
  setText("#copyright", `© ${new Date().getFullYear()} ${profile.name}${data.footer.updated ? ` · Updated ${data.footer.updated}` : ""}`);

  const dialog = $("#citation-dialog");
  $("#close-citation").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  $("#copy-citation").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("#citation-text").textContent);
      setText("#copy-status", "Copied to clipboard.");
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents($("#citation-text"));
      selection.removeAllRanges();
      selection.addRange(range);
      setText("#copy-status", "Text selected. Press Ctrl+C / ⌘C to copy.");
    }
  });

  const menuButton = $(".menu-toggle");
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    $("#site-nav").classList.remove("is-open");
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    $("#site-nav").classList.toggle("is-open", open);
  });
  for (const anchor of document.querySelectorAll(".nav-link")) anchor.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  document.addEventListener("click", (event) => { if (!$(".site-header").contains(event.target)) closeMenu(); });
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = navLinks.map((anchor) => $(anchor.getAttribute("href"))).filter((section) => !section.hidden);
  let scrollPending = false;
  function updateActiveSection() {
    let active = sections[0];
    for (const section of sections) { if (section.getBoundingClientRect().top <= 150) active = section; }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) active = sections[sections.length - 1];
    for (const anchor of navLinks) {
      const current = anchor.getAttribute("href") === `#${active.id}`;
      anchor.classList.toggle("active", current);
      if (current) anchor.setAttribute("aria-current", "location");
      else anchor.removeAttribute("aria-current");
    }
    scrollPending = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateActiveSection); }
  }, { passive: true });
  window.addEventListener("resize", () => { if (window.innerWidth > 500) closeMenu(); updateActiveSection(); });
  updateActiveSection();
})();
