const contentRoot = document.querySelector("[data-content]");
const navRoot = document.querySelector("[data-nav]");
const titleRoot = document.querySelector("[data-site-title]");
const footerRoot = document.querySelector("[data-footer]");
const editMode = new URLSearchParams(window.location.search).has("edit");
const draftKey = "denizbas.markdown.draft";

const clear = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild);
};

const text = (tagName, value) => {
  const element = document.createElement(tagName);
  element.textContent = value;
  return element;
};

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const appendInline = (parent, value) => {
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let match;

  while ((match = pattern.exec(value))) {
    parent.append(document.createTextNode(value.slice(cursor, match.index)));
    const token = match[0];

    if (token.startsWith("**")) {
      const strong = document.createElement("strong");
      appendInline(strong, token.slice(2, -2));
      parent.append(strong);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const anchor = document.createElement("a");
        anchor.href = linkMatch[2];
        anchor.textContent = linkMatch[1];
        parent.append(anchor);
      }
    }

    cursor = match.index + token.length;
  }

  parent.append(document.createTextNode(value.slice(cursor)));
};

const inline = (tagName, value) => {
  const element = document.createElement(tagName);
  appendInline(element, value);
  return element;
};

const parseNav = (line) => {
  const links = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = pattern.exec(line))) {
    links.push({ label: match[1], href: match[2] });
  }

  return links;
};

const renderNav = (items) => {
  if (!navRoot) return;
  clear(navRoot);

  items.forEach((item, index) => {
    if (index > 0) {
      const separator = document.createElement("span");
      separator.setAttribute("aria-hidden", "true");
      separator.textContent = " / ";
      navRoot.append(separator);
    }

    const anchor = document.createElement("a");
    anchor.href = item.href;
    anchor.textContent = item.label;
    navRoot.append(anchor);
  });
};

const flushParagraph = (paragraphLines, target) => {
  if (!paragraphLines.length) return;
  target.append(inline("p", paragraphLines.join(" ")));
  paragraphLines.length = 0;
};

const parseMarkdown = (markdown) => {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const titleLine = lines.find((line) => line.startsWith("# "));
  const title = titleLine ? titleLine.replace(/^#\s+/, "").trim() : "Deniz Bas";
  const footerLine = lines.find((line) => line.startsWith("Footer:"));
  const footer = footerLine ? footerLine.replace(/^Footer:\s*/, "").trim() : "";
  const titleIndex = titleLine ? lines.indexOf(titleLine) : -1;
  const navIndex = lines.findIndex((line, index) => index > titleIndex && /\[[^\]]+\]\([^)]+\)/.test(line));
  const nav = navIndex >= 0 ? parseNav(lines[navIndex]) : [];
  const contentLines = lines.filter((line, index) => {
    if (index === titleIndex || index === navIndex) return false;
    return !line.startsWith("Footer:");
  });

  return { title, nav, footer, contentLines };
};

const renderMarkdown = (markdown, target = contentRoot) => {
  const { title, nav, footer, contentLines } = parseMarkdown(markdown);
  const paragraphLines = [];
  let currentList = null;
  let blockParent = target;
  let firstParagraph = "";

  document.title = title;
  if (titleRoot) titleRoot.textContent = title;
  if (footerRoot) footerRoot.textContent = footer || `Copyright 2026 ${title}`;
  renderNav(nav);

  if (!target) return;
  clear(target);

  const closeList = () => {
    currentList = null;
  };

  contentLines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph(paragraphLines, blockParent);
      closeList();
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph(paragraphLines, blockParent);
      closeList();
      const headingText = trimmed.replace(/^##\s+/, "");
      const section = document.createElement("section");
      section.id = slug(headingText);
      section.setAttribute("aria-labelledby", `${section.id}-title`);
      const heading = inline("h2", headingText);
      heading.id = `${section.id}-title`;
      section.append(heading);
      target.append(section);
      blockParent = section;
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph(paragraphLines, blockParent);
      if (!currentList || currentList.parentElement !== blockParent) {
        currentList = document.createElement("ul");
        blockParent.append(currentList);
      }
      currentList.append(inline("li", trimmed.replace(/^-\s+/, "")));
      return;
    }

    closeList();
    paragraphLines.push(trimmed);
    if (!firstParagraph) firstParagraph = trimmed;
  });

  flushParagraph(paragraphLines, blockParent);

  const description = firstParagraph || title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
};

const renderEditor = (markdown) => {
  document.body.classList.add("edit-mode");

  const editor = document.createElement("aside");
  const heading = text("h2", "Edit Markdown");
  const textarea = document.createElement("textarea");
  const controls = document.createElement("div");
  const copyButton = document.createElement("button");
  const resetButton = document.createElement("button");

  editor.className = "edit-panel";
  editor.setAttribute("aria-label", "Content editor");

  textarea.className = "edit-markdown";
  textarea.spellcheck = false;
  textarea.value = markdown;
  textarea.addEventListener("input", () => {
    localStorage.setItem(draftKey, textarea.value);
    renderMarkdown(textarea.value);
  });

  copyButton.type = "button";
  copyButton.textContent = "Copy Markdown";
  copyButton.addEventListener("click", () => {
    textarea.select();
    navigator.clipboard?.writeText(textarea.value);
  });

  resetButton.type = "button";
  resetButton.textContent = "Reset draft";
  resetButton.addEventListener("click", () => {
    localStorage.removeItem(draftKey);
    window.location.reload();
  });

  controls.className = "edit-controls";
  controls.append(copyButton, resetButton);
  editor.append(heading, textarea, controls);
  document.body.prepend(editor);
};

fetch("content.md", { cache: "no-cache" })
  .then((response) => {
    if (!response.ok) throw new Error(`Could not load content.md (${response.status})`);
    return response.text();
  })
  .then((markdown) => {
    const activeMarkdown = editMode ? localStorage.getItem(draftKey) || markdown : markdown;
    renderMarkdown(activeMarkdown);
    if (editMode) renderEditor(activeMarkdown);
  })
  .catch((error) => {
    if (!contentRoot) return;
    clear(contentRoot);
    const section = document.createElement("section");
    section.append(text("h2", "Content failed to load"));
    section.append(text("p", error.message));
    contentRoot.append(section);
  });
