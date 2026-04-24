/**
 * Unique long-form copy per tool (50–100 words) for listings, tool UIs, and SEO.
 * Avoids duplicate “free fast online” boilerplate across similar converters.
 */

export const toolExtendedCopy = {
  "image-compressor": {
    description:
      "Heavy photos slow down websites, coursework uploads, and email threads. This compressor balances smaller byte counts against visible detail so JPG, PNG, and WebP assets stay sharp enough for blogs, storefronts, and presentations. Tweak quality, compare before-and-after, and download without installing plugins—ideal when you only have a browser on a locked-down office laptop. Keep a lossless master copy offline for print projects; use compressed derivatives for screens.",
    metaDescription:
      "Compress JPG, PNG, and WebP images in your browser. Reduce file size for faster sites and smaller email attachments while keeping detail sensible for web use.",
  },
  "image-resizer": {
    description:
      "Every platform demands different pixel widths: LinkedIn banners, Instagram squares, and marketplace thumbnails rarely match your camera’s default export. Set exact dimensions, lock aspect ratio to avoid stretching, and produce multiple sizes from one upload. Teachers, marketers, and developers use this when CMS templates specify strict image boxes. Start from your largest source file so upscaling does not blur important text or product edges.",
    metaDescription:
      "Resize images to exact width and height in pixels. Lock aspect ratio for social templates, hero images, and thumbnails—runs in the browser with no signup.",
  },
  "image-watermarker": {
    description:
      "Visible text or logo overlays discourage casual copying of proofs, stock-style shots, and event photography shared before final payment. Place your brand, URL, or “Draft” label, adjust opacity so the subject remains clear, and export quickly for email or social previews. This complements—not replaces—formal copyright strategy, but it helps freelancers and small shops signal ownership. Works when you need a simple overlay without opening Photoshop.",
    metaDescription:
      "Add text or logo watermarks to photos in your browser. Protect previews and portfolio samples with adjustable opacity—no design suite required.",
  },
  "image-cropper": {
    description:
      "Framing changes the story: remove stray background clutter, center a product, or match a strict 1:1 or 16:9 box required by ad networks. Drag handles to select the region you want, preview the crop, and save when the composition feels right. Journalists, ecommerce managers, and students use this minutes before deadlines. If a platform later asks for a wider crop, retain your original file elsewhere before overwriting.",
    metaDescription:
      "Crop JPG, PNG, and WebP images to precise regions and aspect ratios. Reframe photos for social ads, thumbnails, and presentations—fast browser-based cropping.",
  },

  "png-to-jpg": {
    description:
      "PNG preserves transparency and crisp edges—great for logos—but photographs often become smaller as JPG when alpha channels are unnecessary. Convert when you need a flatter file for CMS uploads, legacy systems, or email clients that mishandle PNG. Expect a background color (often white) where transparency existed, so review edges on dark themes. This path suits screenshots and camera exports destined for articles rather than layered design work.",
    metaDescription:
      "Convert PNG to JPG online when you need smaller photos without transparency. Browser-based conversion for blogs, email, and CMS uploads.",
  },
  "png-to-jpeg": {
    description:
      "JPEG and JPG are effectively the same family; some enterprise tools only accept the “.jpeg” extension. Moving from PNG drops alpha transparency but can shrink large photographic PNGs dramatically. Use this when archival layering is done and you only need a flat image for a report or LMS. Check hairlines and gradients after conversion because aggressive compression may show banding on skies or shadows.",
    metaDescription:
      "Turn PNG images into JPEG files with a .jpeg extension. Useful when a system requires that suffix—no install, quick download.",
  },
  "png-to-svg": {
    description:
      "Raster PNGs do not magically become true infinitely scalable vectors, but tracing workflows help logos, icons, and simple illustrations scale for responsive sites and print. Expect best results on high-contrast artwork with limited colors; busy photographs rarely trace cleanly. Designers use this to prep assets for SVG-first front ends or to hand off to vector editors. Always inspect paths and simplify where the preview looks noisy.",
    metaDescription:
      "Convert PNG bitmaps toward SVG-friendly output for simple logos and icons. Best for high-contrast art; review traced paths in your browser workflow.",
  },
  "png-to-webp": {
    description:
      "WebP often beats PNG on file size for similar visual quality on modern browsers, which helps Core Web Vitals and mobile data users. Convert PNG marketing graphics and UI slices when your CDN or static host serves WebP alongside fallbacks. Transparency is supported, unlike classic JPEG. If you must support very old browsers, keep a PNG backup and use responsive picture tags or server rules.",
    metaDescription:
      "Convert PNG to WebP for lighter images on modern browsers. Often smaller files with transparency support—ideal for performance-minded sites.",
  },
  "jpg-to-png": {
    description:
      "JPG is lossy and has no transparency; PNG adds an alpha channel and sharper edges for overlays, slides, and screenshots with crisp UI text. Convert when you need to place a photo on variable backgrounds or export a slide for design tools that prefer PNG. File sizes may grow—use PNG when fidelity or transparency matters more than kilobytes. Avoid repeated JPG-to-PNG round trips; each cycle can add artifacts.",
    metaDescription:
      "Convert JPG to PNG when you need transparency or sharper edges for overlays and slides. Browser-based conversion with clear use-case guidance.",
  },
  "jpg-to-jpeg": {
    description:
      "JPG and JPEG describe the same compression; only the extension differs. Some banks, government portals, and HR systems reject “.jpg” while accepting “.jpeg,” or the reverse. Rename or re-encode here without changing visible quality settings when the validator is picky. This is a practical fix for upload forms that behave inconsistently across operating systems. Keep your original if you later need EXIF metadata intact.",
    metaDescription:
      "Convert JPG files to the .jpeg extension (or adjust encoding) when a form requires that exact suffix—quick fix without desktop software.",
  },
  "jpg-to-svg": {
    description:
      "Photographic JPGs are poor candidates for true vector conversion, but flat logos, ink sketches, and high-contrast diagrams can trace into scalable SVG for web components. Expect cleanup in a vector editor afterward for production assets. Developers use this to move legacy raster brand marks into icon systems. For photos, consider keeping JPG and using responsive srcset instead of forcing SVG.",
    metaDescription:
      "Convert JPG images toward SVG-oriented output for simple logos and line art. Understand limits with photos—best for bold, limited-color graphics.",
  },
  "jpg-to-webp": {
    description:
      "WebP typically reduces size versus JPEG at similar perceived quality, which speeds up galleries and product grids. Convert JPG sources when your build pipeline or static host already emits WebP and you want consistent modern assets. Always spot-check skin tones and product colors after conversion. Pair with a JPEG fallback if analytics show significant traffic from older browsers your organization must support.",
    metaDescription:
      "Convert JPG to WebP for smaller photo files on the web. Improve load times for galleries and ecommerce—check color accuracy after conversion.",
  },
  "jpeg-to-png": {
    description:
      "JPEG compression blurs fine text and introduces artifacts around hard edges; PNG preserves sharper UI captures and supports transparency for layered designs. Convert JPEG screenshots or exports when you need to composite on colored backgrounds or import into presentation tools that favor PNG. Expect larger files—only choose PNG when the visual benefit outweighs storage. One-way quality recovery from heavy JPEG damage is not possible.",
    metaDescription:
      "Convert JPEG images to PNG for transparency or sharper UI captures. Useful for slides and compositing—know that file sizes often increase.",
  },
  "jpeg-to-jpg": {
    description:
      "Many cameras and phones save “.jpeg,” while Windows and some editors default to “.jpg.” If a uploader rejects your file purely due to extension mismatch, convert here to match policy without visually recompressing unnecessarily. Content stays comparable when settings align. Document which extension your DAM or CI pipeline expects to avoid repeat confusion across teammates.",
    metaDescription:
      "Convert JPEG files to the .jpg extension when a platform requires it. Straightforward browser conversion for picky upload validators.",
  },
  "jpeg-to-svg": {
    description:
      "Use JPEG-to-SVG workflows for stylized graphics rather than full-color photos. Charts, stamps, and two-tone artwork trace more predictably than vacation pictures. SVG output helps front-end teams who need one asset at multiple densities. Review curves after conversion: simplify paths to keep page weight reasonable. For photographic hero images, prefer responsive JPEG/WebP sets instead of SVG.",
    metaDescription:
      "Convert JPEG graphics toward SVG for scalable icons and simple illustrations. Not ideal for photos—best for limited-color artwork and diagrams.",
  },
  "jpeg-to-webp": {
    description:
      "Moving JPEG sources to WebP can shrink bytes on image-heavy pages without a full redesign. Ideal when your performance budget demands better Largest Contentful Paint scores. Test marketing creatives where color fidelity matters—WebP is strong but not identical to every JPEG encoder. Roll out behind caching rules and monitor real-user metrics after deployment.",
    metaDescription:
      "Convert JPEG to WebP for smaller files on modern browsers. Supports performance tuning for blogs, news sites, and ecommerce imagery.",
  },
  "webp-to-png": {
    description:
      "WebP excels on the web, yet some desktop publishers, print shops, and older creative tools still expect PNG. Convert when you must edit layers in software without WebP plugins or when a client requests PNG deliverables. Transparency carries over in many workflows—verify edges on checkered backgrounds. Keep WebP for site delivery; use PNG for compatibility handoffs.",
    metaDescription:
      "Convert WebP images to PNG for editing tools and clients that require PNG. Transparency-friendly path from modern web formats to universal bitmaps.",
  },
  "webp-to-jpg": {
    description:
      "When you no longer need transparency, WebP-to-JPG can simplify assets for email newsletters, slide decks, and systems that block WebP. Flatten against a chosen background if your source used alpha. Compare brightness and saturation—any conversion can shift appearance slightly. Prefer keeping WebP on your live site while exporting JPG for specific channels that insist on JPEG.",
    metaDescription:
      "Convert WebP to JPG for channels that only accept JPEG photos without transparency. Browser-based flattening for email and legacy viewers.",
  },
  "webp-to-jpeg": {
    description:
      "Some enterprise CMS and DAM systems accept “.jpeg” but choke on WebP despite supporting JPEG family codecs. Convert WebP photography to a JPEG bitstream with the exact extension your validator expects. Audit EXIF and color profiles if your workflow depends on metadata. This step is often about compatibility gates rather than artistic change—preview before mass upload.",
    metaDescription:
      "Convert WebP to JPEG with a .jpeg extension for strict enterprise upload rules. Quick compatibility fix without desktop converters.",
  },

  "image-to-pdf": {
    description:
      "Combine receipts, ID scans, and camera photos into one PDF for submissions to schools, landlords, or HR. Order pages logically, ensure text is legible, and avoid mixing wildly different resolutions when possible. PDF keeps layout stable across devices—better than emailing a dozen separate JPGs. For archival scans, consider OCR in a dedicated tool afterward if you need searchable text.",
    metaDescription:
      "Merge JPG, PNG, and WebP images into a single PDF. Ideal for applications, invoices, and homework—stable layout across phones and desktops.",
  },
  "doc-to-pdf": {
    description:
      "Spreadsheets, Word files, HTML exports, and plain text can become share-ready PDFs when reviewers should not accidentally edit cells or styles. Teachers, analysts, and account managers use this to freeze formatting before distribution. Large tables may need landscape orientation checks—preview before sending externally. Sensitive documents should follow your organization’s approved redaction workflow.",
    metaDescription:
      "Convert Excel, Word, TXT, CSV, and HTML sources to PDF. Share read-only documents with consistent fonts and layout—browser-based conversion.",
  },
  "excel-to-pdf": {
    description:
      "Finance teams and program coordinators often need non-editable snapshots of forecasts, rosters, and KPI tables. Export XLSX, XLS, or CSV to PDF so recipients see the same column widths and number formats you intended. Wide sheets may shrink fonts—adjust print areas in Excel first when readability suffers. Password policies on attachments still apply; PDF is not encryption by itself.",
    metaDescription:
      "Turn Excel and CSV spreadsheets into PDF for reports and handouts. Preserves table structure for stakeholders who should not edit cells.",
  },
  "word-to-pdf": {
    description:
      "Contracts, policies, and resumes travel more safely as PDFs because reflow engines won’t scramble headings on different Word versions. Convert DOCX when external counsel, admissions offices, or clients request an immutable-looking file. Embed fonts when branding matters; otherwise expect subtle shifts on exotic typefaces. Always proof the PDF page breaks before submission.",
    metaDescription:
      "Convert Word DOCX documents to PDF for stable sharing. Keeps formatting consistent across devices—great for resumes, policies, and proposals.",
  },
  "txt-to-pdf": {
    description:
      "Plain text logs, poems, and configuration excerpts become printable PDFs when you need pagination, margins, and fonts suitable for court bundles or coursework. This helps programmers share code listings and writers produce uniform proofs. Choose a readable monospace or serif font in your workflow if the tool exposes styling. Very long files should be split for readability.",
    metaDescription:
      "Convert TXT files to PDF with predictable pagination. Useful for documentation, poetry, and logs that must print or archive cleanly.",
  },
  "html-to-pdf": {
    description:
      "Save invoices, articles, or locally saved HTML snapshots as PDFs for offline reading or attachment to tickets. Web layouts can differ from print—check that images load and that CSS print rules behave as expected. Developers use this for quick QA of static pages; marketers archive landing pages after campaigns. Dynamic sites that require login may need alternative capture methods.",
    metaDescription:
      "Convert HTML files or saved pages to PDF for archives and attachments. Handy for articles, receipts, and static reports—verify layout after export.",
  },

  "text-to-speech": {
    description:
      "Listening catches awkward phrasing that silent proofreading misses—valuable for ESL authors, accessibility reviews, and long commutes. Paste blog drafts, study notes, or support macros, pick a voice that fits your audience, and hear how sentences flow. This supports inclusive content when paired with published transcripts. It does not replace human narration for brand campaigns, but it speeds iteration.",
    metaDescription:
      "Turn text into spoken audio in the browser. Proofread aloud, support accessibility reviews, and hear drafts with multiple voice options.",
  },
  "grammar-checker": {
    description:
      "Typos undermine trust in job applications, help-center articles, and customer email. Paste copy to catch spelling, agreement, and punctuation issues before you send. Treat suggestions as advisory—technical terms, brand names, and inclusive language choices sometimes conflict with rigid rules. Combine automated checks with a human pass for tone and factual accuracy, especially under regulation.",
    metaDescription:
      "Check grammar, spelling, and punctuation online. Improve clarity for emails, essays, and support docs—review suggestions in context.",
  },

  "video-compressor": {
    description:
      "Oversized clips fail LMS uploads, Slack attachments, and mobile viewers on slow data. Reduce bitrate and resolution to match each channel’s limits while keeping speech intelligible. Event organizers and trainers compress rehearsal footage before sharing with remote teams. Always preview audio sync after heavy compression—extreme settings can smear motion or flatten colors.",
    metaDescription:
      "Compress video files in the browser for faster uploads and smoother playback. Balance size and quality for training clips, social, and email.",
  },
  "video-trimmer": {
    description:
      "Cut cold opens, remove mistakes, and export only the segment reviewers need—without learning a full nonlinear editor. Podcasters and educators trim intros; recruiters clip highlights from long interviews. Set approximate in and out points, preview, then download. Keep your master file untouched elsewhere when you might need context that trimming removes.",
    metaDescription:
      "Trim videos online to keep the best segments. Remove dead air and mistakes for social clips, assignments, and internal reviews.",
  },
  "video-cropper": {
    description:
      "Vertical platforms expect 9:16; YouTube often wants 16:9; some ads require safe margins around text overlays. Reframe footage to remove letterboxing or focus on a speaker. Journalists and marketers reuse one interview across channels by cropping thoughtfully. Check that critical action stays inside safe zones after you crop—especially on smaller phones.",
    metaDescription:
      "Crop videos to new aspect ratios in the browser. Adapt interviews and promos for vertical feeds, widescreen embeds, and ad-safe frames.",
  },

  "qr-generator": {
    description:
      "QR codes bridge print and digital: posters, packaging, and conference badges can open URLs, Wi‑Fi join dialogs, or plain text instructions. Generate high-contrast codes, test scans under real lighting, and avoid stuffing excessive data that makes modules tiny and hard to read. Pair with UTM parameters when tracking campaigns. For payments, follow your processor’s specs—generic QR tools are not substitutes for certified payment codes.",
    metaDescription:
      "Create QR codes for URLs, text, and Wi‑Fi setup. Download scannable graphics for posters, events, and product labels—test before print runs.",
  },
  "barcode-generator": {
    description:
      "Retail, warehouses, and school libraries still rely on linear barcodes for SKUs, books, and asset tags. Choose symbologies your scanner hardware supports—Code 128, EAN-13, and others have different rules. Print at adequate resolution and quiet zones so laser readers decode reliably. This tool helps small teams prototype labels before investing in dedicated design software.",
    metaDescription:
      "Generate common barcode formats online for inventory, retail, and asset labels. Match symbology to your scanners—print tests before bulk use.",
  },
  "background-remover": {
    description:
      "Cut subjects from busy backgrounds for ecommerce cutouts, presentation slides, and YouTube thumbnails. Replace with solid colors or new imagery when your campaign requires consistent backdrops. Results vary with hair and glass—manual touch-up may still be needed for premium print. Avoid uploading confidential IDs or sensitive documents on shared networks; follow your data policy.",
    metaDescription:
      "Remove image backgrounds in the browser for product photos and thumbnails. Replace with colors or new images—review fine hair and edges.",
  },
  "dns-checker": {
    description:
      "After changing hosts or email providers, DNS records propagate unevenly worldwide. Query A, MX, CNAME, and TXT from multiple vantage points to see whether the world agrees with your intended configuration. IT admins and site owners use this to debug “works for me” issues before customers hit stale caches. TTL and resolver behavior mean patience is normal—document expected values for your team.",
    metaDescription:
      "Check DNS records and global propagation for A, MX, CNAME, and TXT. Debug domain and email cutovers when results differ by region.",
  },

  "excel-viewer": {
    description:
      "Preview XLSX, XLS, and CSV on machines without Microsoft Office—common in libraries, airports, and locked-down offices. Scan formulas and totals before meetings without downloading heavy desktop suites. Read-only viewing reduces accidental edits during review. For sensitive payroll or financial data, prefer corporate-approved environments and avoid public computers.",
    metaDescription:
      "View Excel and CSV spreadsheets online without installing Excel. Quick review of tables and charts for meetings and support tickets.",
  },
  "word-viewer": {
    description:
      "Open DOCX and DOC manuscripts, policies, and résumés when you only need to read—not edit—before an interview or committee session. Rendering approximates Word; complex macros and embedded fonts may differ slightly from desktop Word. Proof final pagination before printing. Confidential briefings should stay on compliant devices per your employer’s rules.",
    metaDescription:
      "Open Word DOCX and DOC files in the browser for read-only review. Handy on Chromebooks and shared PCs when Word is not installed.",
  },
  "text-viewer": {
    description:
      "Inspect logs, README files, JSON-ish snippets saved as .txt, and lightweight scripts when double-clicking would open the wrong editor. Monospace-friendly viewing helps developers scan stack traces during incidents. Very large logs may load slowly—trim locally first when possible. Do not paste secrets into untrusted networks.",
    metaDescription:
      "View plain text and code-oriented .txt files online. Read logs, notes, and config excerpts quickly without a local editor install.",
  },
  "html-viewer": {
    description:
      "Teachers, junior developers, and support staff preview saved HTML fragments to verify tags, anchors, and embedded media paths before publishing. Source inspection complements rendered view when debugging layout issues. Sandboxed browser viewing is safer than opening random files with system handlers. Dynamic sites that need server-side includes still require the proper host environment.",
    metaDescription:
      "View and inspect HTML files online. Preview saved pages and snippets, then review source structure before deployment or coursework submission.",
  },
  "js-viewer": {
    description:
      "Skim React, TypeScript, and plain JavaScript modules when reviewing pull requests on borrowed hardware. Syntax-aware presentation beats plain Notepad for braces and imports. This is for reading and light navigation—not replacing IDE refactoring. Obfuscated bundles remain hard to read by design; seek source maps from the author.",
    metaDescription:
      "View JavaScript, JSX, TS, and TSX files with readable formatting. Quick code review on machines without VS Code installed.",
  },
  "css-viewer": {
    description:
      "Designers and front-end developers audit SCSS, LESS, and CSS variables when troubleshooting theme conflicts across WordPress or component libraries. Color-coded structure speeds scanning. Pair with browser devtools on live sites for computed styles—this viewer focuses on static files. Large design-system files benefit from section folding in your editor afterward.",
    metaDescription:
      "View CSS, SCSS, and LESS stylesheets online. Inspect selectors and variables when debugging themes without local preprocessors.",
  },
  "json-viewer": {
    description:
      "API responses and config dumps are unreadable as single-line blobs. Pretty-print JSON to validate commas, arrays, and nested keys during integrations. Mobile engineers and support engineers use this when Slack pastes arrive mangled. This does not validate schema against OpenAPI—pair with dedicated validators for contract testing.",
    metaDescription:
      "Format and explore JSON data in the browser. Readable trees for API responses, configs, and webhook payloads during debugging.",
  },
  "markdown-viewer": {
    description:
      "README files, internal wikis, and course notes often live in Markdown. Render headings, lists, and code fences to verify structure before publishing to GitHub or static generators. Math and exotic extensions may need specialized engines—preview basic GFM-compatible content here. Collaborative editing still belongs in your git or CMS workflow.",
    metaDescription:
      "Render Markdown files with headings, lists, and code blocks. Proof docs and README content before pushing to GitHub or static site generators.",
  },
  "python-viewer": {
    description:
      "Teaching assistants and interviewers skim .py assignments without cloning entire repositories on a loaner laptop. Indentation-sensitive Python benefits from monospace display. This is read-only; run code in approved sandboxes per your institution’s security policy. Large notebooks should stay in Jupyter—this targets plain scripts.",
    metaDescription:
      "View Python source files online with readable indentation. Review scripts and homework without installing Python IDEs on every machine.",
  },
  "php-viewer": {
    description:
      "Maintain legacy WordPress plugins or Laravel patches? Read PHP sources with syntax cues faster than printing to paper. Useful when VPN access allows file download but not full IDE licensing on a contractor device. Never execute untrusted PHP from unknown origins—viewing is safer but not risk-free if scripts exploit viewer bugs; stay patched.",
    metaDescription:
      "View PHP source files in the browser. Audit plugins and templates on locked-down machines—read-only inspection, not execution.",
  },
  "image-viewer": {
    description:
      "Confirm resolution, transparency, and obvious compression artifacts before approving creative deliverables. Supports common raster formats for quick QA on devices without Photoshop. Zoom and compare when art directors sign off remotely. CMYK print workflows still need professional soft-proofing—this targets screen-oriented checks.",
    metaDescription:
      "View PNG, JPG, WebP, GIF, and SVG images online. Quick visual QA for creative assets when desktop viewers are unavailable.",
  },
  "pdf-viewer": {
    description:
      "Read contracts, whitepapers, and fillable forms when Adobe Reader is blocked or outdated on a kiosk machine. Multi-page navigation helps HR and legal reviewers during walk-ins. Annotated PDFs may render annotations differently—verify critical markup in your official viewer when decisions depend on it.",
    metaDescription:
      "Read multi-page PDF documents in the browser. Review contracts and reports on shared PCs without installing Acrobat.",
  },
  "document-viewer": {
    description:
      "One drop zone for Word, Excel, PowerPoint, PDF, images, code, and Markdown when you are unsure which attachment a colleague sent. Field technicians and admissions teams preview heterogeneous bundles without juggling five apps. Performance depends on file size—huge presentations may load slowly. Classified material should stay within approved government or enterprise viewers only.",
    metaDescription:
      "Preview many document and code formats in one place: Office, PDF, images, JSON, Markdown, and more. Quick triage when file types are mixed.",
  },
}
