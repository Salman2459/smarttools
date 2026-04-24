/**
 * SEO copy for tool pages: one 50–100 word summary per tool (from tool.description),
 * then deeper sections that do not repeat that summary verbatim.
 */

import { clipToolPageDescription, clipWords } from "./clip-words"

function hashId(id) {
  let h = 5381
  for (let i = 0; i < id.length; i++) {
    h = (h * 33) ^ id.charCodeAt(i)
  }
  return Math.abs(h)
}

/** Intro paragraphs: never paste the long tool summary here (avoids duplicate blocks on-page). */
const openings = (title, category) => [
  `When you need reliable results for ${title.toLowerCase()}, working inside the browser keeps your workflow simple. SmartTools.fun focuses on clarity: you open the tool, complete your task, and move on without installing desktop software or creating an account. That helps students, freelancers, and teams who switch devices often.`,
  `${title} sits in our ${category} collection. People use it while preparing assets for a site, cleaning up files before email, or batch-processing content for social media—jobs where a single-purpose utility beats opening a heavy suite. The sections below explain workflows and limits, not the same overview twice.`,
  `Many visitors reach ${title} with a deadline: a form rejecting a file type, a page that feels slow, or a clip over an upload cap. The sections below turn that pressure into a short checklist—what to upload, what to verify on download, and when desktop software is the better choice.`,
]

const midBlocks = {
  'Image Tools': (title, seed) => [
    `Raster images power ecommerce, blogs, presentations, and messaging apps. ${title} helps you control file weight, dimensions, and visual clarity so pages load quickly and still look professional. When search engines evaluate user experience, large unoptimized images are a common bottleneck; compressing and resizing thoughtfully supports both Core Web Vitals and human readers who scroll on phones.`,
    `Color profiles, transparency, and export settings all influence how an image appears across devices. While browser-based tools cannot replace a full design suite for every edge case, they excel at repeatable tasks: convert formats, trim backgrounds, or add a watermark before publication. For brand safety, keep a master copy in your archive and use the online tool for derivatives you share publicly.`,
  ],
  'PDF Tools': (title, seed) => [
    `PDF remains the standard for contracts, invoices, reports, and printable coursework because layout stays stable across operating systems. ${title} on SmartTools.fun is designed for quick conversions from office formats or web content into shareable PDFs. When you send a file to clients or teachers, a consistent PDF reduces “it looks different on my screen” confusion.`,
    `Accessibility still matters: add headings and readable text in source documents before conversion when possible. If you merge or split PDFs later, descriptive filenames and version notes help everyone on your team find the right file. Our workflow assumes you want speed without sacrificing basic readability for the people who receive your documents.`,
  ],
  'Text Tools': (title, seed) => [
    `Writing for the web blends tone, grammar, and structure. ${title} supports authors who need a second pass on wording or who want to hear how text sounds when read aloud. Clear language improves comprehension for international audiences and for readers who skim; tools that highlight issues quickly complement—not replace—your editorial judgment.`,
    `For professional communication, consistency beats cleverness. Run important emails, landing page drafts, and support articles through a quick check before publishing. Pair automated suggestions with a short manual review for context, brand voice, and factual accuracy, especially when content represents your company or academic work.`,
  ],
  'Video Tools': (title, seed) => [
    `Video files grow large fast; trimming, cropping, and compressing are essential before upload to hosting platforms or learning systems. ${title} helps you reduce upload time and storage use while keeping the message intact. Consider your target resolution and frame rate: not every clip needs 4K when viewers watch on mobile data.`,
    `If you distribute tutorials or marketing clips, export a version optimized for each channel when necessary—short vertical cuts for social, wider formats for YouTube or embedded players. Good audio matters as much as pixels; when you cut footage, check that speech remains audible and that cuts feel natural to the viewer.`,
  ],
  'Other Tools': (title, seed) => [
    `Utility tools such as ${title} solve focused problems: generate machine-readable codes, verify infrastructure settings, or prepare visuals for print. These tasks appear small but recur daily across IT, retail, and creative work. Keeping them in the browser means anyone on the team can run a check without requesting a software license.`,
    `Document outputs with timestamps and context when you share results with colleagues. For DNS or barcode-related tasks, a screenshot or exported file plus a short note avoids misunderstandings later. SmartTools.fun processes your input for the task at hand and does not retain your data after the session completes.`,
  ],
  'Viewer Tools': (title, seed) => [
    `Previewing documents and source files without installing native apps is essential on shared computers and lightweight laptops. ${title} lets you inspect spreadsheets, manuscripts, code, or PDFs directly in the browser. Reviewers, hiring managers, and students often need a fast look rather than full editing—viewers fill that gap.`,
    `When you open proprietary formats online, prefer official or well-tested renderers and keep sensitive files off public devices when possible. For code review, viewers help you scan structure before cloning a repository. For office files, verify that tables and slides display as expected before presenting to stakeholders.`,
  ],
}

const scenarios = (title, category) => [
  `Typical scenarios for ${title} include preparing materials for a deadline, fixing a last-minute client request, or learning a new format as part of a course. Because the tool stays free and does not require signup, you can bookmark it and return whenever a similar task appears. Teams can share one link instead of maintaining a list of desktop installers across operating systems.`,
  `If you work across Windows, macOS, and Linux, browser tools reduce compatibility surprises. ${title} complements cloud storage and chat apps: download a result, upload to your drive, and share the link. For ${category}, we recommend testing one sample file first whenever you change settings, then applying the same settings to a larger batch for predictable output.`,
]

const scenarioExtras = (title, category, seed) =>
  pickVariant(seed, 40, [
    `Accessibility reviewers sometimes pair ${title} with captioned exports: after you finalize media, route transcripts through your normal publishing checklist so WCAG goals stay intact.`,
    `Localization teams chain ${title} with glossary checks—file format is only one piece of a multilingual launch, but getting bytes right prevents downstream rework in CAT tools.`,
    `Bootstrapped founders use ${title} when investors ask for “one clean PDF” minutes before a call; the tool buys time until a designer can refine the deck in Figma.`,
    `Newsroom interns use ${title} under tight embargoes: after export, rename files carefully so cloud links do not leak working titles to the public folder.`,
  ])

const privacy = (title) => [
  `SmartTools.fun processes files and inputs to deliver ${title} results and does not use your content for training unrelated models or for resale. Avoid uploading highly confidential material on any shared or public network; when in doubt, use offline tools approved by your organization. Clearing your browser after sensitive sessions adds another layer of caution on shared machines.`,
  `Performance depends on file size and device capabilities. Very large videos or images may take longer to process or require a stable connection. If a job fails, try a smaller test file to rule out format issues, then retry with the original. We continuously improve reliability, but realistic expectations around bandwidth and memory help avoid frustration.`,
]

function pickVariant(seed, index, variants) {
  return variants[(seed + index * 31) % variants.length]
}

function buildFaqs(tool, seed) {
  const { title, category, description, id } = tool
  const t = title
  const shortHook = clipWords(description.split(/(?<=[.!?])\s/)[0] || description, 28)

  const q1 = pickVariant(seed, 0, [
    `What is ${t} used for?`,
    `When should I choose ${t} over similar apps?`,
    `What problems does ${t} solve on SmartTools.fun?`,
  ])
  const a1 = pickVariant(seed, 0, [
    `${t} helps with this specific job: ${shortHook} Typical visitors use it inside ${category.toLowerCase()} workflows—preparing homework, client deliverables, or site assets—without installing another vendor’s suite. The page above already walks through the “why”; here we focus on fit, limits, and follow-up checks.`,
    `Use ${t} when you want the task finished in one browser tab. ${shortHook} That matters on loaner laptops, school Chromebooks, and locked corporate machines where IT blocks installers. Freelancers and small teams bookmark it because the steps stay the same across Windows, macOS, and Linux.`,
    `${t} exists so you do not hunt for a one-off desktop trial. ${shortHook} If your goal matches that scope—rather than months of batch automation—you will usually get a faster outcome here than reconciling license keys across devices.`,
  ])

  const q2 = pickVariant(seed, 1, [`Is ${t} free on SmartTools.fun?`, `Does ${t} require payment or a subscription?`, `Are there hidden fees for ${t}?`])
  const a2 = pickVariant(seed, 1, [
    `Yes—${t} is free at the point of use, with no mandatory account. SmartTools.fun is funded in part by display advertising so we can keep utilities available to students and small businesses worldwide. Fair-use limits and our terms still apply; abusive automation or resale of the service itself is not OK.`,
    `You can run ${t} without subscribing. We monetize through ads rather than paywalls for basic conversion and viewing tools. If you rely on it weekly, bookmark the canonical /tools/${id} URL so you always land on the current interface.`,
    `${t} does not ask for a credit card for standard use. Revenue from ads covers hosting and development; you help simply by using the tool as intended on a normal connection.`,
  ])

  const q3 = pickVariant(seed, 2, [
    `Do I need to install anything to use ${t}?`,
    `Can I run ${t} without downloading software?`,
    `Does ${t} work if my PC blocks .exe installs?`,
  ])
  const a3 = pickVariant(seed, 2, [
    `Nothing to install—use a current version of Chrome, Edge, Firefox, or Safari. ${t} loads like any secure webpage: grant file access only when you initiate an upload. That is why it works on machines where only the browser is unlocked.`,
    `Installation is optional because the heavy lifting uses web technologies your browser already has. ${t} suits travelers and classroom PCs where you cannot persist software between sessions.`,
    `If your organization whitelists browsers but blocks arbitrary executables, ${t} still fits: you are not adding another attack surface—just loading a documented tool over HTTPS.`,
  ])

  const q4 = pickVariant(seed, 3, [
    `How does SmartTools.fun handle privacy for ${t}?`,
    `Where do my files go after I use ${t}?`,
    `Is ${t} safe for confidential documents?`,
  ])
  const a4 = pickVariant(seed, 3, [
    `Inputs are processed to return your result and are not repurposed for unrelated profiling. Avoid regulated health or legal data on public Wi‑Fi regardless of tool; use VPNs and corporate-approved offline apps when policy demands. Close tabs and clear downloads on shared kiosks after sensitive work.`,
    `We do not monetize your uploads as training fodder. For ${t}, treat the session like any web upload: if the file is secret, use a trusted network and device you control.`,
    `Safety is a shared responsibility: ${t} is built for everyday creative and office files. National-security or HIPAA-grade material deserves dedicated, audited systems—not consumer browser utilities.`,
  ])

  const q5 = pickVariant(seed, 4, [
    `What quality limits should I expect from ${t}?`,
    `Why might ${t} output look different from desktop suites?`,
    `When should I switch from ${t} to specialist software?`,
  ])
  const a5 = pickVariant(seed, 4, [
    `Browser engines prioritize portability. ${t} handles typical ${category.toLowerCase()} files beautifully; exotic color profiles, proprietary macros, or broadcast codecs may still need native apps. Always eyeball the export before you declare a project “done.”`,
    `Start with defaults, compare against your source, then tweak. If artifacts appear only on huge files, split the job or reduce resolution first—memory limits, not laziness, are usually the cause.`,
    `If you are color-matching packaging for print or mastering long-form video, desktop tools remain the reference. ${t} shines at quick turnarounds and mid-fidelity deliverables.`,
  ])

  const q6 = pickVariant(seed, 5, [`Can I use ${t} on a phone or tablet?`, `Does ${t} work on mobile browsers?`, `Is ${t} usable on a small screen?`])
  const a6 = pickVariant(seed, 5, [
    `The layout adapts to smaller viewports. Light tasks—QR generation, text checks, modest image work—feel fine on phones. Long video encodes or giant panoramas are usually calmer on Wi‑Fi and a plugged-in laptop.`,
    `Touch targets follow responsive patterns, but if ${t} involves precise cropping, a mouse or stylus still helps. Plan extra time on mobile data if uploads are hundreds of megabytes.`,
    `Yes, though ergonomics vary: rotate to landscape when you need horizontal sliders. Download folders on mobile fill fast—delete temp files after you share the result.`,
  ])

  const q7 = pickVariant(seed, 6, [
    `Which other SmartTools.fun utilities pair with ${t}?`,
    `How does ${t} fit next to other ${category} tools here?`,
    `Can I chain ${t} with another tool on this site?`,
  ])
  const a7 = pickVariant(seed, 6, [
    `Browse the sidebar: you might compress an image, drop it into a PDF, then QR-link the finished PDF. ${t} is one step—not the whole pipeline—so knowing neighbors on the site saves tab-hopping to random search results.`,
    `Many projects bounce between ${category.toLowerCase()} utilities. After ${t}, you may still need a viewer, a barcode, or a DNS check; keeping everything under one domain keeps your bookmarks sane.`,
    `We group tools so newcomers learn vocabulary—WebP versus JPEG, TXT versus PDF—without leaving. ${t} teaches one transformation; combine it with others when your brief asks for more.`,
  ])

  const q8 = pickVariant(seed, 7, [`Who gets the most value from ${t}?`, `Is ${t} meant for professionals or casual users?`, `Would educators recommend ${t}?`])
  const a8 = pickVariant(seed, 7, [
    `Students trim coursework videos; ecommerce assistants normalize photos; developers inspect JSON; HR teams preview résumés—${t} spans roles. Anyone who values speed over owning another perpetual license benefits.`,
    `Casual users like the zero-learning-curve flow; professionals like that they can delegate a quick conversion to a contractor without sharing seat licenses. Transparency about limits keeps both groups aligned.`,
    `Teachers link to ${t} when classroom PCs cannot install suites. Professionals use it when traveling light. Neither group wants surprise paywalls mid-task—that is the contract we try to honor.`,
  ])

  return [
    { q: q1, a: a1 },
    { q: q2, a: a2 },
    { q: q3, a: a3 },
    { q: q4, a: a4 },
    { q: q5, a: a5 },
    { q: q6, a: a6 },
    { q: q7, a: a7 },
    { q: q8, a: a8 },
  ]
}

const benefitTitlePools = [
  ['Saves time', 'Cuts setup friction', 'Built for speed', 'Fewer context switches'],
  ['No signup wall', 'Privacy-light access', 'No new passwords', 'Open and use'],
  ['Cross-platform', 'Works on borrowed PCs', 'One tab, many OSes', 'Browser-native'],
  ['Everyday reliability', 'Honest expectations', 'Clear labels', 'Repeatable results'],
]

const benefitBodyPools = (title, category) => [
  [
    `Skip installers and jump straight into ${title.toLowerCase()} when Slack pings you with “needed yesterday.”`,
    `The flow stays short: open, upload or paste, download—no license wizard in the middle.`,
    `Deadlines reward tools that stay out of the way; ${title.toLowerCase()} is built for that rhythm.`,
    `Spend minutes on the task, not on provisioning software seats across teammates.`,
  ],
  [
    `No account means fewer databases holding your email—just the work you came to finish.`,
    `Guest Wi‑Fi and classroom PCs become viable because nothing persists beyond your session.`,
    `Share the /tools link with contractors without provisioning SSO.`,
    `Return weekly without re-verifying identity—bookmarking replaces credential sprawl.`,
  ],
  [
    `macOS, Windows, and Linux disagree on default apps; the browser is the one runtime they share.`,
    `Traveling light? Your phone can kick off a job while your laptop renders another.`,
    `IT departments that whitelist browsers but block random executables still unblock this path.`,
    `Remote teams avoid “works on my machine” when everyone uses the same URL.`,
  ],
  [
    `${category} utilities here explain limits in plain language—no fake “unlimited” promises.`,
    `Labels match what you see in export dialogs elsewhere, so vocabulary transfers.`,
    `When output differs from Photoshop, we say so; surprises help nobody pass QA.`,
    `Predictable steps mean you can document them in runbooks for interns and volunteers.`,
  ],
]

/**
 * @param {{ id: string, title: string, description: string, category: string, metaDescription?: string }} tool
 */
export function buildToolSeoContent(tool) {
  const seed = hashId(tool.id)
  const { title, description, category } = tool
  const metaDesc = tool.metaDescription || description
  /** Single on-page summary; same cap as tool hero (max 100 words). */
  const summary = clipToolPageDescription(description)

  const openParts = openings(title, category)
  const open = openParts[seed % openParts.length]
  const open2 = openParts[(seed + 1) % openParts.length]

  const catFn = midBlocks[category] || midBlocks['Other Tools']
  const mid = catFn(title, seed)

  const guideLead = pickVariant(seed, 11, [
    `${title} tackles one slice of modern digital work. Traffic often arrives mid-task—resize a hero image, PDF a policy, trim a clip—so this section pairs on-screen controls with expectations about quality, load time, and how the output will look to reviewers.`,
    `Treat ${title} as a focused step, not a full creative suite replacement. The paragraphs below spell out where browser-based processing shines, when native apps still win, and what to verify before you attach a file to email or an LMS.`,
    `Teachers, merchants, and IT folks land here with different files, but the same question: can I ship this today? The guide covers the happy path, common edge cases, and moments to stop and switch to offline tools so you rerun fewer failed jobs.`,
  ])

  const sections = [
    {
      id: 'guide',
      heading: `Complete guide to ${title}`,
      paragraphs: [
        guideLead,
        `SmartTools.fun groups ${category} tools so you can finish tasks without juggling multiple vendor accounts. Instructions stay obvious on first visit: upload or paste your input, adjust options if shown, then download or copy the result. If you repeat the same workflow weekly, bookmark this page and note the settings that worked last time.`,
        mid[0],
        mid[1],
      ],
    },
    {
      id: 'scenarios',
      heading: 'Practical scenarios and workflow tips',
      paragraphs: [...scenarios(title, category), scenarioExtras(title, category, seed)],
    },
    {
      id: 'privacy',
      heading: 'Privacy, performance, and realistic expectations',
      paragraphs: [
        ...privacy(title),
        `Readers who care about search visibility should know that helpful, specific pages tend to perform better than bare upload widgets. That is why this guide goes beyond a slogan: it connects ${title.toLowerCase()} to real workflows, limitations, and follow-up steps. When you share this page, you are pointing colleagues to context—not just a utility—so they can make informed decisions about file formats, compression, and delivery channels.`,
      ],
    },
  ]

  const benefitCards = [0, 1, 2, 3].map((i) => ({
    title: pickVariant(seed, 20 + i, benefitTitlePools[i]),
    body: pickVariant(seed, 24 + i, benefitBodyPools(title, category)[i]),
  }))

  return {
    intro: {
      title: `How to use ${title} online — full walkthrough`,
      lead: `${title} is a ${category.toLowerCase()} utility on SmartTools.fun. Read the short summary once, then use the sections below for workflows and FAQs—we do not repeat the same description block in every paragraph.`,
      summary,
      paragraphs: [open, open2],
    },
    sections,
    benefitCards,
    faqs: buildFaqs(tool, seed),
    relatedNote: `Explore more ${category} tools from the sidebar to build an end-to-end workflow around ${title.toLowerCase()} without leaving SmartTools.fun.`,
  }
}
