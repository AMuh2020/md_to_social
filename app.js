// MD to Social — Instagram Carousel Creator Engine
// Clean & Minimal Engine with File Import and Zero-Clip DOM Auto-Packing

const DEFAULT_MARKDOWN = `# A Bit More Loud, A Lot Less Lazy

I'm still not where I want to be, but I seem to be moving closer.

If you ask my parents to describe me, two words always come up: **"He is lazy"** and **"Abdulmuhmeen? that boy is so quiet"**.

"He doesn't put all his effort into what he does" "He barely talks at home". 

That's followed me for a while. I hope I'm a lot less **lazy** than before, in my opinion I'm not lazy at all. And **quiet**? I 100% disagree, but when is the last time someone has accurately described themselves? 

Despite that I'll attempt to do so here: try and describe where I started, where I'm now at, and where next I'm looking to go.

---

## Strats to force change

Social media has been a positive experience through and through for me. I've been able to practice talking aloud, essentially that mirror exercise except everyone can judge you as well.

I've also picked up some extra skills like a bit of video editing, script writing and a new appreciation for every moment. 

It gets your mind thinking: *is this beautiful enough to share, or is this profound enough or funny enough?* It keeps you constantly on the look out.

---

Another strat I've employed is to look at all the possible options and go for the craziest I can imagine. 

An example is starting the group chat for my CS cohort at uni. I hopped into DMs asking people if they were starting CompSci and added over **300 followers** that week.

300 new people to potentially talk to, 300 people I could potentially meet. By freshers week the chat was lively. I took on a big transformation and progress was made.

---

## What's next?

Well here in 2026, I'll soon be starting my last year of uni. I'm looking to talk to and befriend a lot more people and to be a bit more social.

I'm currently learning how to work with other people, organise, and take lead of things whenever there is a need. 

I'm a lot more loud, and hopefully a lot less lazy. I'm just trying, and I think, with all your energy, potential, and willpower **you should too**.`;

// Application State
const state = {
  markdown: DEFAULT_MARKDOWN,
  title: "A Bit More Loud, A Lot Less Lazy",
  subtitle: "I'm still not where I want to be, but I seem to be moving closer.",
  outroText: `Big thanks for reading this far, I hope you learnt something, and get some benefit out of it.

Should I write more stuff? Probably a good habit, plus you learn to convert thoughts into words better. See you all. 

AbdulMuhmeen A. Leasu (aka AMAL)`,
  aspectRatio: '4:5', // '4:5' or '1:1'
  fontSize: 44, // px
  lineHeight: 1.45,
  padding: 100, // px
  textAlign: 'left',
  authorHandle: '@leasu.amuhmeen',
  showCounter: true,
  showSwipe: true,
  showOutro: true,
  previewZoom: 0.35,
  slides: []
};

/*
 * NOTE: Multi-theme presets and complex typography switchers have been commented out
 * in favor of hardcoding custom CSS variables directly in input.css:
 * --slide-bg: #212529;
 * --slide-text: #f8f9fa;
 * --slide-accent: #fd8d0d;
 */

// DOM Elements
const elements = {
  markdownInput: document.getElementById('markdown-input'),
  coverTitleInput: document.getElementById('cover-title-input'),
  coverSubtitleInput: document.getElementById('cover-subtitle-input'),
  outroTextInput: document.getElementById('outro-text-input'),
  editorDropzone: document.getElementById('editor-dropzone'),
  fileImportInput: document.getElementById('file-import-input'),
  importMdBtn: document.getElementById('import-md-btn'),
  slidesViewport: document.getElementById('slides-viewport'),
  statsBadge: document.getElementById('stats-badge'),
  slideCountBadge: document.getElementById('slide-count-badge'),
  ratio45Btn: document.getElementById('ratio-4-5-btn'),
  ratio11Btn: document.getElementById('ratio-1-1-btn'),
  loadSampleBtn: document.getElementById('load-sample-btn'),
  downloadZipBtn: document.getElementById('download-zip-btn'),
  insertSplitBtn: document.getElementById('insert-split-btn'),
  fontSizeSlider: document.getElementById('font-size-slider'),
  fontSizeVal: document.getElementById('font-size-val'),
  paddingSlider: document.getElementById('padding-slider'),
  paddingVal: document.getElementById('padding-val'),
  previewZoom: document.getElementById('preview-zoom'),
  authorHandleInput: document.getElementById('author-handle-input'),
  exportModal: document.getElementById('export-modal'),
  exportStatusTitle: document.getElementById('export-status-title'),
  exportStatusDesc: document.getElementById('export-status-desc'),
  measuringSandbox: document.getElementById('measuring-sandbox'),
  sandboxCard: document.getElementById('sandbox-card'),
  sandboxHeader: document.getElementById('sandbox-header'),
  sandboxContent: document.getElementById('sandbox-content'),
  sandboxFooter: document.getElementById('sandbox-footer')
};

// Initialize Application
function init() {
  elements.markdownInput.value = state.markdown;
  if (elements.coverTitleInput) {
    elements.coverTitleInput.value = state.title || '';
  }
  if (elements.coverSubtitleInput) {
    elements.coverSubtitleInput.value = state.subtitle || '';
  }
  if (elements.outroTextInput) {
    elements.outroTextInput.value = state.outroText || '';
  }
  setupEventListeners();
  updateStats();
  recalculateAndRender();
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Event Listeners
function setupEventListeners() {
  // Markdown Input
  let debounceTimer;
  elements.markdownInput.addEventListener('input', (e) => {
    state.markdown = e.target.value;
    updateStats();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      recalculateAndRender();
    }, 250);
  });

  // Cover Title Input
  if (elements.coverTitleInput) {
    elements.coverTitleInput.addEventListener('input', (e) => {
      state.title = e.target.value;
      recalculateAndRender();
    });
  }

  // Cover Subtitle Input
  if (elements.coverSubtitleInput) {
    elements.coverSubtitleInput.addEventListener('input', (e) => {
      state.subtitle = e.target.value;
      recalculateAndRender();
    });
  }

  // Final Slide / Outro Text Input
  if (elements.outroTextInput) {
    elements.outroTextInput.addEventListener('input', (e) => {
      state.outroText = e.target.value;
      recalculateAndRender();
    });
  }

  // File Import Button & Input
  elements.importMdBtn.addEventListener('click', () => {
    elements.fileImportInput.click();
  });

  elements.fileImportInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      readMarkdownFile(file);
    }
  });

  // Drag & Drop on Editor
  if (elements.editorDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      elements.editorDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.markdownInput.classList.add('border-[#fd8d0d]');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      elements.editorDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.markdownInput.classList.remove('border-[#fd8d0d]');
      }, false);
    });

    elements.editorDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt.files[0];
      if (file) {
        readMarkdownFile(file);
      }
    });
  }

  // Aspect Ratio
  elements.ratio45Btn.addEventListener('click', () => {
    state.aspectRatio = '4:5';
    updateRatioButtons();
    recalculateAndRender();
  });

  elements.ratio11Btn.addEventListener('click', () => {
    state.aspectRatio = '1:1';
    updateRatioButtons();
    recalculateAndRender();
  });

  // Load Sample Button
  elements.loadSampleBtn.addEventListener('click', () => {
    state.markdown = DEFAULT_MARKDOWN;
    state.title = "A Bit More Loud, A Lot Less Lazy";
    state.subtitle = "I'm still not where I want to be, but I seem to be moving closer.";
    state.outroText = `Big thanks for reading this far, I hope you learnt something, and get some benefit out of it.

Should I write more stuff? Probably a good habit, plus you learn to convert thoughts into words better. See you all. 

AbdulMuhmeen A. Leasu (aka AMAL)`;

    elements.markdownInput.value = DEFAULT_MARKDOWN;
    if (elements.coverTitleInput) {
      elements.coverTitleInput.value = state.title;
    }
    if (elements.coverSubtitleInput) {
      elements.coverSubtitleInput.value = state.subtitle;
    }
    if (elements.outroTextInput) {
      elements.outroTextInput.value = state.outroText;
    }
    updateStats();
    recalculateAndRender();
  });

  // Insert Split Break (---)
  elements.insertSplitBtn.addEventListener('click', () => {
    const textarea = elements.markdownInput;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const insertion = "\n\n---\n\n";
    textarea.value = text.substring(0, start) + insertion + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
    state.markdown = textarea.value;
    updateStats();
    recalculateAndRender();
    textarea.focus();
  });

  // Sliders
  elements.fontSizeSlider.addEventListener('input', (e) => {
    state.fontSize = parseInt(e.target.value, 10);
    elements.fontSizeVal.textContent = `${state.fontSize}px`;
    recalculateAndRender();
  });

  elements.paddingSlider.addEventListener('input', (e) => {
    state.padding = parseInt(e.target.value, 10);
    elements.paddingVal.textContent = `${state.padding}px`;
    recalculateAndRender();
  });

  // Handle Input
  elements.authorHandleInput.addEventListener('input', (e) => {
    state.authorHandle = e.target.value;
    renderSlides();
  });

  // Preview Zoom
  elements.previewZoom.addEventListener('change', (e) => {
    state.previewZoom = parseFloat(e.target.value);
    renderSlides();
  });

  // Download All as ZIP
  elements.downloadZipBtn.addEventListener('click', exportAllSlidesAsZip);
}

// Read Markdown file via FileReader
function readMarkdownFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    state.markdown = text;
    elements.markdownInput.value = text;
    
    // Auto-detect Title and Subtitle from file content
    const lines = text.split('\n');
    const h1Line = lines.find(l => l.startsWith('# '));
    if (h1Line) {
      state.title = h1Line.replace(/^#\s+/, '').trim();
      if (elements.coverTitleInput) {
        elements.coverTitleInput.value = state.title;
      }
    }
    
    const restLines = lines.filter(l => !l.startsWith('#')).join('\n').trim();
    if (restLines) {
      const paragraphs = restLines.split(/\n\n+/);
      if (paragraphs.length > 0 && paragraphs[0].length < 180 && !paragraphs[0].startsWith('#')) {
        state.subtitle = paragraphs[0];
        if (elements.coverSubtitleInput) {
          elements.coverSubtitleInput.value = state.subtitle;
        }
      }
    }
    
    updateStats();
    recalculateAndRender();
  };
  reader.readAsText(file);
}

// Update Aspect Ratio UI Buttons
function updateRatioButtons() {
  if (state.aspectRatio === '4:5') {
    elements.ratio45Btn.className = 'ratio-btn px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all bg-[#fd8d0d] text-[#212529]';
    elements.ratio11Btn.className = 'ratio-btn px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all text-[#adb5bd] hover:text-white';
  } else {
    elements.ratio11Btn.className = 'ratio-btn px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all bg-[#fd8d0d] text-[#212529]';
    elements.ratio45Btn.className = 'ratio-btn px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all text-[#adb5bd] hover:text-white';
  }
}

// Update Word and Slide Stats
function updateStats() {
  const text = state.markdown.trim();
  const words = text ? text.split(/\s+/).length : 0;
  elements.statsBadge.textContent = `${words} words • ${state.slides.length} slides`;
}

// INTELLIGENT DOM-BASED AUTO-PACKING ENGINE
function recalculateAndRender() {
  if (!state.markdown.trim()) {
    state.slides = [];
    renderSlides();
    return;
  }

  // 1. Prepare Sandbox Container
  setupSandbox();

  // 2. Parse Markdown Sections
  const rawMarkdown = state.markdown;
  const sections = rawMarkdown.split(/\n\s*---\s*\n/);

  const slides = [];

  sections.forEach((sectionStr, sectionIdx) => {
    const trimmedSection = sectionStr.trim();
    if (!trimmedSection) return;

    // Check if first section starts with H1 for a Cover Slide
    if (sectionIdx === 0 && trimmedSection.startsWith('# ')) {
      const parsedCover = parseCoverSlide(trimmedSection);
      if (parsedCover) {
        slides.push(parsedCover.coverSlide);
        if (parsedCover.remainingMarkdown) {
          packContentIntoSlides(parsedCover.remainingMarkdown, slides);
        }
        return;
      }
    }

    // Normal section packing with DOM overflow detection
    packContentIntoSlides(trimmedSection, slides);
  });

  // Outro slide
  if (state.showOutro && slides.length > 0) {
    slides.push({
      type: 'outro',
      html: generateOutroHTML()
    });
  }

  state.slides = slides;
  updateStats();
  renderSlides();
}

// Setup sandbox styles matching exact native canvas
function setupSandbox() {
  const card = elements.sandboxCard;
  const isRatio45 = state.aspectRatio === '4:5';
  
  card.className = `slide-canvas ${isRatio45 ? 'ratio-4-5' : 'ratio-1-1'}`;
  card.style.padding = `${state.padding}px`;
  
  elements.sandboxContent.style.fontSize = `${state.fontSize}px`;
  elements.sandboxContent.style.lineHeight = state.lineHeight;
  elements.sandboxContent.style.textAlign = state.textAlign;
  
  // Header with social handle
  if (state.authorHandle) {
    elements.sandboxHeader.innerHTML = `
      <div style="display:flex; justify-content:flex-end; align-items:center; margin-bottom: 20px; font-size: 22px; font-weight:600; color:var(--slide-muted);">
        <span>${state.authorHandle}</span>
      </div>
    `;
    elements.sandboxHeader.style.display = 'block';
  } else {
    elements.sandboxHeader.innerHTML = '';
    elements.sandboxHeader.style.display = 'none';
  }

  // Footer
  if (state.showCounter || state.showSwipe) {
    elements.sandboxFooter.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 20px; font-size: 22px; font-weight:600;">
        <span>01 / 05</span>
        <span>Swipe →</span>
      </div>
    `;
    elements.sandboxFooter.style.display = 'block';
  } else {
    elements.sandboxFooter.innerHTML = '';
    elements.sandboxFooter.style.display = 'none';
  }
}

// Parse Cover Slide
function parseCoverSlide(sectionMarkdown) {
  const lines = sectionMarkdown.split('\n');
  const h1Line = lines.find(l => l.startsWith('# '));

  // Use explicitly configured title if present, otherwise fallback to markdown h1
  const title = (state.title && state.title.trim()) || (h1Line ? h1Line.replace(/^#\s+/, '').trim() : 'Title');
  const restLines = lines.filter(l => l !== h1Line).join('\n').trim();

  // Use explicitly configured subtitle if present
  let subtitleHTML = '';
  if (state.subtitle && state.subtitle.trim()) {
    subtitleHTML = marked.parse(state.subtitle.trim());
  }

  const coverSlide = {
    type: 'cover',
    title: title,
    subtitle: subtitleHTML,
    html: `
      <div style="display:flex; flex-direction:column; justify-content:center; height:100%; gap: 28px;">
        <h1 style="font-size: ${Math.round(state.fontSize * 1.65)}px; line-height: 1.15; font-weight: 800; color:var(--slide-heading); margin:0;">
          ${title}
        </h1>
        ${subtitleHTML ? `<div style="font-size:${Math.round(state.fontSize * 0.95)}px; line-height:1.45; color:var(--slide-text); opacity:0.9;">${subtitleHTML}</div>` : ''}
        
        <div style="margin-top: 32px; padding-top: 28px; border-top: 2px solid var(--slide-border); display:flex; align-items:center; justify-content:space-between;">
          <div style="font-size: 30px; font-weight:700; color:var(--slide-accent);">
            ${state.authorHandle || ''}
          </div>
        </div>
      </div>
    `
  };

  return { coverSlide, remainingMarkdown: restLines };
}

// Content Auto-Packing Engine
function packContentIntoSlides(markdownText, slidesArray) {
  if (!markdownText.trim()) return;

  const tokens = marked.lexer(markdownText);
  const blocks = tokens.map(t => ({
    html: marked.parser([t]),
    type: t.type,
    depth: t.depth
  }));

  let currentBlocks = [];
  elements.sandboxContent.innerHTML = '';

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockHtml = block.html;

    // Automatic slide break for headings/subheadings (h1, h2, h3, etc.)
    // If current slide already has content, start the heading on a new slide
    if (block.type === 'heading' && currentBlocks.length > 0) {
      slidesArray.push({
        type: 'body',
        html: currentBlocks.join('')
      });
      currentBlocks = [];
      elements.sandboxContent.innerHTML = '';
    }

    const testBlocks = [...currentBlocks, blockHtml];
    elements.sandboxContent.innerHTML = testBlocks.join('');

    // Check if container overflows
    if (elements.sandboxContent.scrollHeight > elements.sandboxContent.clientHeight) {
      if (currentBlocks.length > 0) {
        slidesArray.push({
          type: 'body',
          html: currentBlocks.join('')
        });
        currentBlocks = [];
        elements.sandboxContent.innerHTML = '';
        
        i--;
        continue;
      } else {
        const splitPieces = splitOversizedBlock(blockHtml);
        if (splitPieces.length > 1) {
          const newBlocks = splitPieces.map(piece => ({
            html: piece,
            type: 'paragraph'
          }));
          blocks.splice(i, 1, ...newBlocks);
          i--;
          continue;
        } else {
          slidesArray.push({
            type: 'body',
            html: blockHtml
          });
          currentBlocks = [];
          elements.sandboxContent.innerHTML = '';
        }
      }
    } else {
      currentBlocks.push(blockHtml);
    }
  }

  if (currentBlocks.length > 0) {
    slidesArray.push({
      type: 'body',
      html: currentBlocks.join('')
    });
  }
}

// Split an oversized paragraph by sentence boundaries
function splitOversizedBlock(htmlBlock) {
  const match = htmlBlock.match(/^<p>([\s\S]*)<\/p>$/i);
  if (!match) return [htmlBlock];

  const innerText = match[1];
  const sentences = innerText.split(/(?<=[.?!])\s+/);
  if (sentences.length <= 1) return [htmlBlock];

  const mid = Math.ceil(sentences.length / 2);
  const part1 = `<p>${sentences.slice(0, mid).join(' ')}</p>`;
  const part2 = `<p>${sentences.slice(mid).join(' ')}</p>`;

  return [part1, part2];
}

// Generate Outro Slide HTML
function generateOutroHTML() {
  const outroMarkdown = (state.outroText && state.outroText.trim()) || '';
  const contentHTML = outroMarkdown ? marked.parse(outroMarkdown) : '';

  return `
    <div style="display:flex; flex-direction:column; justify-content:center; height:100%; gap: 28px;">
      <div class="slide-content" style="font-size:${state.fontSize}px; line-height:${state.lineHeight}; text-align:${state.textAlign};">
        ${contentHTML}
      </div>
    </div>
  `;
}

// RENDER ALL SLIDES IN WORKSPACE VIEWPORT
function renderSlides() {
  const container = elements.slidesViewport;
  container.innerHTML = '';

  const totalSlides = state.slides.length;
  elements.slideCountBadge.textContent = `${totalSlides} ${totalSlides === 1 ? 'slide' : 'slides'}`;

  if (totalSlides === 0) {
    container.innerHTML = `
      <div class="text-center py-20 text-[#6c757d]">
        <i data-lucide="file-x" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
        <p class="text-sm font-semibold">No content to render</p>
        <p class="text-xs text-[#adb5bd] mt-1">Paste markdown or import a .md file to create slides</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const isRatio45 = state.aspectRatio === '4:5';
  const nativeWidth = 1080;
  const nativeHeight = isRatio45 ? 1350 : 1080;
  const zoom = state.previewZoom;

  const displayWidth = Math.round(nativeWidth * zoom);
  const displayHeight = Math.round(nativeHeight * zoom);

  state.slides.forEach((slide, index) => {
    const pageNum = index + 1;
    const pageNumStr = pageNum < 10 ? `0${pageNum}` : `${pageNum}`;
    const totalStr = totalSlides < 10 ? `0${totalSlides}` : `${totalSlides}`;

    const slideWrapper = document.createElement('div');
    slideWrapper.className = 'preview-slide-wrapper';
    slideWrapper.style.width = `${displayWidth}px`;
    slideWrapper.style.height = `${displayHeight}px`;

    const slideCard = document.createElement('div');
    slideCard.className = 'preview-slide-card';
    slideCard.style.width = `${displayWidth}px`;
    slideCard.style.height = `${displayHeight}px`;

    // Hover action buttons
    const actions = document.createElement('div');
    actions.className = 'slide-hover-actions';
    actions.innerHTML = `
      <button class="download-single-btn px-2 py-1 rounded bg-[#212529] hover:bg-[#fd8d0d] text-[#f8f9fa] hover:text-[#212529] text-xs font-semibold border border-[#343a40] shadow flex items-center gap-1 transition-all" data-index="${index}" title="Download PNG">
        <i data-lucide="download" class="w-3 h-3"></i>
        <span>PNG</span>
      </button>
      <button class="copy-single-btn px-2 py-1 rounded bg-[#212529] hover:bg-[#fd8d0d] text-[#f8f9fa] hover:text-[#212529] text-xs font-semibold border border-[#343a40] shadow flex items-center gap-1 transition-all" data-index="${index}" title="Copy to clipboard">
        <i data-lucide="copy" class="w-3 h-3"></i>
      </button>
    `;

    // Native 1080px Canvas Node
    const canvasNode = document.createElement('div');
    canvasNode.id = `slide-canvas-${index}`;
    canvasNode.className = `slide-canvas ${isRatio45 ? 'ratio-4-5' : 'ratio-1-1'}`;
    canvasNode.style.padding = `${state.padding}px`;
    canvasNode.style.transform = `scale(${zoom})`;
    canvasNode.style.transformOrigin = 'top left';

    // Slide Header
    let headerHTML = '';
    if (slide.type !== 'cover' && state.authorHandle) {
      headerHTML = `
        <div class="slide-header" style="display:flex; justify-content:flex-end; align-items:center; margin-bottom: 20px; font-size: 30px; font-weight:600; color:var(--slide-muted);">
          <span>${state.authorHandle}</span>
        </div>
      `;
    }

    // Slide Footer
    let footerHTML = '';
    const counterText = `${pageNumStr} / ${totalStr}`;
    const swipeText = index === totalSlides - 1 ? 'End' : 'Swipe →';

    footerHTML = `
      <div class="slide-footer" style="display:flex; align-items:center; justify-content:space-between; align-items:center; margin-top: 20px; font-size: 30px; font-weight:600;">
        ${state.showCounter ? `<span style="background:var(--slide-card-bg); border: 1px solid var(--slide-border); padding: 8px 18px; border-radius: 999px; color:var(--slide-muted);">${counterText}</span>` : '<span></span>'}
        ${state.showSwipe && index < totalSlides ? `<span style="color:var(--slide-accent); display:flex; align-items:center; gap:6px;">${swipeText}</span>` : '<span></span>'}
      </div>
    `;

    canvasNode.innerHTML = `
      ${headerHTML}
      <div class="slide-content" style="font-size:${state.fontSize}px; line-height:${state.lineHeight}; text-align:${state.textAlign};">
        ${slide.html}
      </div>
      ${footerHTML}
    `;

    slideCard.appendChild(canvasNode);
    slideCard.appendChild(actions);
    slideWrapper.appendChild(slideCard);
    container.appendChild(slideWrapper);
  });

  // Attach individual slide handlers
  document.querySelectorAll('.download-single-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index, 10);
      downloadSingleSlide(idx);
    });
  });

  document.querySelectorAll('.copy-single-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index, 10);
      copySlideToClipboard(idx, btn);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// HIGH RESOLUTION CANVAS EXPORT ENGINE
async function renderCanvasForSlide(slideIndex) {
  const canvasNode = document.getElementById(`slide-canvas-${slideIndex}`);
  if (!canvasNode) return null;

  const clone = canvasNode.cloneNode(true);
  clone.style.transform = 'none';
  clone.style.position = 'fixed';
  clone.style.top = '-99999px';
  clone.style.left = '-99999px';
  clone.style.zIndex = '-1000';
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null
    });
    document.body.removeChild(clone);
    return canvas;
  } catch (err) {
    document.body.removeChild(clone);
    console.error('Canvas export error:', err);
    throw err;
  }
}

// Download single slide PNG
async function downloadSingleSlide(index) {
  try {
    showExportModal('Generating Slide Image...', `Rendering slide #${index + 1} at high-res 1080px...`);
    const canvas = await renderCanvasForSlide(index);
    hideExportModal();

    if (!canvas) return;
    canvas.toBlob(blob => {
      saveAs(blob, `slide_${String(index + 1).padStart(2, '0')}.png`);
    }, 'image/png');
  } catch (err) {
    hideExportModal();
    alert('Failed to generate image: ' + err.message);
  }
}

// Copy single slide to clipboard
async function copySlideToClipboard(index, btnEl) {
  try {
    const origHTML = btnEl.innerHTML;
    btnEl.innerHTML = `<i data-lucide="loader" class="w-3 h-3 animate-spin"></i>`;
    if (window.lucide) window.lucide.createIcons();

    const canvas = await renderCanvasForSlide(index);
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        btnEl.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-emerald-400"></i>`;
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          btnEl.innerHTML = origHTML;
          if (window.lucide) window.lucide.createIcons();
        }, 2000);
      } catch (clipErr) {
        console.error('Clipboard error:', clipErr);
        btnEl.innerHTML = origHTML;
        alert('Could not copy directly to clipboard. You can use the PNG download button instead.');
      }
    }, 'image/png');
  } catch (err) {
    alert('Failed to copy slide: ' + err.message);
  }
}

// Export All Slides as a ZIP
async function exportAllSlidesAsZip() {
  const total = state.slides.length;
  if (total === 0) {
    alert('No slides to export!');
    return;
  }

  showExportModal('Exporting Carousel ZIP', `Processing slide 1 of ${total}...`);
  const zip = new JSZip();

  try {
    for (let i = 0; i < total; i++) {
      elements.exportStatusDesc.textContent = `Rendering slide ${i + 1} of ${total}...`;
      const canvas = await renderCanvasForSlide(i);
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const filename = `slide_${String(i + 1).padStart(2, '0')}.png`;
      zip.file(filename, blob);
    }

    elements.exportStatusDesc.textContent = 'Compressing into ZIP archive...';
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    hideExportModal();
    saveAs(zipBlob, 'instagram_carousel.zip');
  } catch (err) {
    hideExportModal();
    console.error('Zip export error:', err);
    alert('Export failed: ' + err.message);
  }
}

function showExportModal(title, desc) {
  elements.exportStatusTitle.textContent = title;
  elements.exportStatusDesc.textContent = desc;
  elements.exportModal.classList.remove('hidden');
}

function hideExportModal() {
  elements.exportModal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', init);
