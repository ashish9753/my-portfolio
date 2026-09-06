import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const revisionSections = [
  {
    title: '1. CSS Basics',
    questions: [
      { q: 'What is CSS?', a: 'It makes HTML look good.', example: 'p { color: blue; }' },
      { q: 'CSS rule format?', a: 'Selector + property + value.', example: 'h1 { font-size: 32px; }' },
      { q: 'External CSS?', a: 'CSS written in a separate .css file.', example: '<link rel="stylesheet" href="style.css">' },
      { q: 'Element selector?', a: 'Selects every tag of one type.', example: 'p { color: red; }' },
      { q: 'Class selector?', a: 'Selects elements with the same class.', example: '.card { padding: 16px; }' },
      { q: 'ID selector?', a: 'Selects one unique element.', example: '#header { background: black; }' },
      { q: 'Universal selector?', a: 'Selects all elements.', example: '* { box-sizing: border-box; }' },
      { q: 'Group selector?', a: 'Applies one style to many selectors.', example: 'h1, h2 { color: navy; }' },
      { q: 'Descendant selector?', a: 'Selects an element inside another.', example: '.card p { color: gray; }' },
      { q: 'What is a comment?', a: 'A note ignored by the browser.', example: '/* Button styles */' },
      { q: 'Specificity?', a: 'The stronger selector wins.', example: '#title { color: red; } /* beats .title */' },
      { q: '!important?', a: 'Forces a style; avoid it when possible.', example: 'color: red !important;' },
    ]
  },
  {
    title: '2. Text, Colors & Box Model',
    questions: [
      { q: 'color?', a: 'Changes text color.', example: 'color: #2563eb;' },
      { q: 'background-color?', a: 'Changes an element background.', example: 'background-color: lightyellow;' },
      { q: 'font-size?', a: 'Changes text size.', example: 'font-size: 18px;' },
      { q: 'font-weight?', a: 'Changes text thickness.', example: 'font-weight: bold;' },
      { q: 'font-family?', a: 'Chooses the text font.', example: 'font-family: Arial, sans-serif;' },
      { q: 'text-align?', a: 'Aligns text horizontally.', example: 'text-align: center;' },
      { q: 'line-height?', a: 'Controls space between text lines.', example: 'line-height: 1.6;' },
      { q: 'text-decoration?', a: 'Adds or removes text lines.', example: 'text-decoration: none;' },
      { q: 'width and height?', a: 'Set element size.', example: 'width: 200px; height: 100px;' },
      { q: 'padding?', a: 'Space inside the border.', example: 'padding: 12px 20px;' },
      { q: 'margin?', a: 'Space outside the border.', example: 'margin: 20px auto;' },
      { q: 'border?', a: 'Draws an element edge.', example: 'border: 1px solid #ddd;' },
      { q: 'border-radius?', a: 'Rounds corners.', example: 'border-radius: 8px;' },
      { q: 'box-shadow?', a: 'Adds a shadow.', example: 'box-shadow: 0 4px 12px #0002;' },
      { q: 'box-sizing: border-box?', a: 'Includes padding and border in width.', example: '* { box-sizing: border-box; }' },
    ]
  },
  {
    title: '3. Display, Position & Flexbox',
    questions: [
      { q: 'display: block?', a: 'Takes the full available row.', example: 'display: block;' },
      { q: 'display: inline?', a: 'Stays in the same text line.', example: 'display: inline;' },
      { q: 'display: none?', a: 'Hides and removes the element space.', example: 'display: none;' },
      { q: 'position: relative?', a: 'Keeps normal place; can be shifted.', example: 'position: relative; top: 10px;' },
      { q: 'position: absolute?', a: 'Positions relative to nearest positioned parent.', example: 'position: absolute; right: 0;' },
      { q: 'position: fixed?', a: 'Stays in one screen position while scrolling.', example: 'position: fixed; bottom: 20px;' },
      { q: 'z-index?', a: 'Controls which positioned item is on top.', example: 'z-index: 10;' },
      { q: 'overflow?', a: 'Controls extra content.', example: 'overflow: auto;' },
      { q: 'display: flex?', a: 'Turns a parent into a flex layout.', example: '.row { display: flex; }' },
      { q: 'flex-direction?', a: 'Sets main direction.', example: 'flex-direction: column;' },
      { q: 'justify-content?', a: 'Aligns items on the main axis.', example: 'justify-content: center;' },
      { q: 'align-items?', a: 'Aligns items across the main axis.', example: 'align-items: center;' },
      { q: 'gap?', a: 'Adds equal space between items.', example: 'gap: 16px;' },
      { q: 'flex-wrap?', a: 'Lets items move to the next line.', example: 'flex-wrap: wrap;' },
    ]
  },
  {
    title: '4. Grid, Responsive & Effects',
    questions: [
      { q: 'display: grid?', a: 'Turns a parent into a row-and-column layout.', example: '.grid { display: grid; }' },
      { q: 'grid-template-columns?', a: 'Sets the number and size of columns.', example: 'grid-template-columns: repeat(3, 1fr);' },
      { q: 'fr?', a: 'A fraction of available grid space.', example: 'grid-template-columns: 1fr 2fr;' },
      { q: 'minmax()?', a: 'Sets a minimum and maximum track size.', example: 'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));' },
      { q: '@media?', a: 'Applies CSS at a screen size.', example: '@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }' },
      { q: 'rem?', a: 'A size based on the root font size.', example: 'padding: 1rem;' },
      { q: 'vw and vh?', a: 'Units based on viewport width and height.', example: 'min-height: 100vh;' },
      { q: ':hover?', a: 'Styles an item when the mouse is over it.', example: 'button:hover { background: navy; }' },
      { q: ':focus?', a: 'Styles an input when it is selected.', example: 'input:focus { outline: 2px solid blue; }' },
      { q: 'transition?', a: 'Makes a change smooth.', example: 'transition: background 0.2s ease;' },
      { q: 'transform?', a: 'Moves, scales, or rotates an item.', example: 'transform: scale(1.05);' },
      { q: 'opacity?', a: 'Controls transparency from 0 to 1.', example: 'opacity: 0.5;' },
      { q: 'cursor?', a: 'Changes the mouse cursor.', example: 'cursor: pointer;' },
      { q: 'object-fit?', a: 'Controls how an image fits its box.', example: 'object-fit: cover;' },
    ]
  },
  {
    title: '5. Useful CSS Patterns',
    questions: [
      { q: 'Center an item with Flexbox?', a: 'Use flex alignment on the parent.', example: '.center { display: flex; justify-content: center; align-items: center; }' },
      { q: 'Center a block horizontally?', a: 'Give it a width and automatic side margins.', example: '.box { width: 300px; margin: 0 auto; }' },
      { q: 'Make a simple button?', a: 'Add color, spacing, and a pointer cursor.', example: '.btn { background: #2563eb; color: white; padding: 10px 16px; border: 0; border-radius: 6px; cursor: pointer; }' },
      { q: 'Make a responsive card grid?', a: 'Use auto-fit grid columns.', example: '.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }' },
      { q: 'Create a CSS variable?', a: 'Store a reusable value.', example: ':root { --brand: #2563eb; }\nbutton { background: var(--brand); }' },
      { q: 'Hide but keep its space?', a: 'Use visibility: hidden.', example: 'visibility: hidden;' },
      { q: 'Remove bullets from a list?', a: 'Remove the list style and default padding.', example: 'ul { list-style: none; padding: 0; }' },
      { q: 'Make an image responsive?', a: 'Keep it inside its parent width.', example: 'img { max-width: 100%; height: auto; }' },
      { q: 'Use calc()?', a: 'Calculate a CSS value.', example: 'width: calc(100% - 32px);' },
      { q: 'CSS reading order?', a: 'Think: selector → property → value.', example: '.title { color: purple; }' },
    ]
  },
  {
    title: '6. Tailwind CSS Quick Revision',
    questions: [
      { q: 'What is Tailwind CSS?', a: 'A utility-first CSS framework. You style using classes in HTML.', example: '<button class="bg-blue-600 text-white">Save</button>', tailwind: 'button' },
      { q: 'What is a utility class?', a: 'One small class that does one styling job.', example: '<p class="text-red-500">Hello</p>', tailwind: 'text-color' },
      { q: 'p-4?', a: 'Adds padding on all four sides.', example: '<div class="p-4">Content</div>', tailwind: 'padding' },
      { q: 'px-4 and py-2?', a: 'Adds horizontal and vertical padding.', example: '<button class="px-4 py-2">Button</button>', tailwind: 'padding' },
      { q: 'm-4?', a: 'Adds margin on all four sides.', example: '<div class="m-4">Box</div>', tailwind: 'margin' },
      { q: 'text-blue-500?', a: 'Changes text to a blue shade.', example: '<p class="text-blue-500">Blue text</p>', tailwind: 'text-color' },
      { q: 'bg-blue-500?', a: 'Adds a blue background.', example: '<div class="bg-blue-500">Box</div>', tailwind: 'background' },
      { q: 'text-white?', a: 'Changes text color to white.', example: '<button class="bg-blue-600 text-white">Save</button>', tailwind: 'button' },
      { q: 'font-bold?', a: 'Makes text bold.', example: '<p class="font-bold">Important</p>', tailwind: 'font' },
      { q: 'text-xl?', a: 'Makes text extra large.', example: '<h2 class="text-xl">Title</h2>', tailwind: 'font' },
      { q: 'rounded-lg?', a: 'Adds noticeably rounded corners.', example: '<div class="rounded-lg">Card</div>', tailwind: 'rounded' },
      { q: 'border?', a: 'Adds a thin border.', example: '<div class="border">Card</div>', tailwind: 'border' },
      { q: 'shadow-md?', a: 'Adds a medium shadow.', example: '<div class="shadow-md">Card</div>', tailwind: 'shadow' },
      { q: 'w-full?', a: 'Makes an element use all available width.', example: '<input class="w-full">', tailwind: 'width' },
      { q: 'flex?', a: 'Turns a parent into a Flexbox layout.', example: '<div class="flex gap-2">...</div>', tailwind: 'flex' },
      { q: 'justify-center?', a: 'Centers flex items horizontally.', example: '<div class="flex justify-center">...</div>', tailwind: 'flex-center' },
      { q: 'items-center?', a: 'Centers flex items vertically.', example: '<div class="flex items-center">...</div>', tailwind: 'flex-center' },
      { q: 'gap-4?', a: 'Adds space between flex or grid items.', example: '<div class="flex gap-4">...</div>', tailwind: 'gap' },
      { q: 'grid grid-cols-3?', a: 'Creates a grid with three columns.', example: '<div class="grid grid-cols-3 gap-4">...</div>', tailwind: 'grid' },
      { q: 'hover:bg-blue-700?', a: 'Changes background when the mouse is over the item.', example: '<button class="bg-blue-600 hover:bg-blue-700">Hover</button>', tailwind: 'hover' },
      { q: 'focus:ring-2?', a: 'Shows a ring when an input is selected.', example: '<input class="focus:ring-2 focus:ring-blue-500">', tailwind: 'focus' },
      { q: 'md:text-lg?', a: 'Applies larger text on medium screens and above.', example: '<p class="text-sm md:text-lg">Responsive text</p>', tailwind: 'responsive' },
      { q: 'hidden?', a: 'Hides an element and removes its space.', example: '<div class="hidden">Hidden</div>', tailwind: 'hidden' },
      { q: 'dark:bg-gray-900?', a: 'Changes the background when dark mode is active.', example: '<div class="bg-white dark:bg-gray-900">...</div>', tailwind: 'dark' },
      { q: 'Tailwind button pattern?', a: 'Combine utilities to make a complete button.', example: '<button class="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">Save</button>', tailwind: 'button' },
    ]
  },
];

const totalQuestions = revisionSections.reduce((s, sec) => s + sec.questions.length, 0);

function ExamplePreview({ item }) {
  const label = 'Example text';
  const frame = 'rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-200';
  const q = item.q.toLowerCase();

  if (item.tailwind) {
    const kind = item.tailwind;
    if (kind === 'button') return <div className={frame}><button className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">Save</button></div>;
    if (kind === 'text-color') return <div className={frame}><span className="text-red-500">Colored text</span></div>;
    if (kind === 'padding') return <div className={frame}><span className="inline-block rounded bg-sky-500/25 p-4">Padded box</span></div>;
    if (kind === 'margin') return <div className={frame}><span className="m-4 inline-block rounded bg-sky-500/25 p-2">Outside space</span></div>;
    if (kind === 'background') return <div className={frame}><span className="inline-block rounded bg-blue-500 px-3 py-2 text-white">Blue box</span></div>;
    if (kind === 'font') return <div className={frame}><span className="text-xl font-bold">Large, bold text</span></div>;
    if (kind === 'rounded') return <div className={frame}><span className="inline-block rounded-lg bg-violet-500/30 px-4 py-2">Rounded card</span></div>;
    if (kind === 'border') return <div className={frame}><span className="inline-block rounded border border-sky-400 px-4 py-2">Bordered card</span></div>;
    if (kind === 'shadow') return <div className={frame}><span className="inline-block rounded bg-gray-800 px-4 py-2 shadow-md">Shadow card</span></div>;
    if (kind === 'width') return <div className={frame}><div className="w-full rounded bg-sky-500/40 px-3 py-2">Full width</div></div>;
    if (kind === 'flex' || kind === 'gap') return <div className={`${frame} flex gap-4`}><span className="rounded bg-sky-500/25 px-3 py-2">1</span><span className="rounded bg-sky-500/25 px-3 py-2">2</span><span className="rounded bg-sky-500/25 px-3 py-2">3</span></div>;
    if (kind === 'flex-center') return <div className={`${frame} flex h-14 items-center justify-center`}><span className="rounded bg-sky-500/25 px-3 py-2">Centered</span></div>;
    if (kind === 'grid') return <div className={`${frame} grid grid-cols-3 gap-2`}><span className="rounded bg-violet-500/25 p-2 text-center">1</span><span className="rounded bg-violet-500/25 p-2 text-center">2</span><span className="rounded bg-violet-500/25 p-2 text-center">3</span></div>;
    if (kind === 'hover') return <div className={frame}><button className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">Hover me</button></div>;
    if (kind === 'focus') return <div className={frame}><input aria-label="Tailwind focus example" placeholder="Click here" className="rounded border border-gray-500 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" /></div>;
    if (kind === 'responsive') return <div className={frame}><span className="text-sm md:text-lg">Resize the screen to enlarge me</span></div>;
    if (kind === 'hidden') return <div className={frame}><span className="text-gray-400">The element is hidden.</span></div>;
    if (kind === 'dark') return <div className="rounded-md bg-white px-4 py-3 text-sm text-gray-900 dark:bg-gray-900 dark:text-white">Light or dark background</div>;
  }

  if (q.includes('text-decoration')) {
    return <div className={`${frame} flex flex-wrap gap-4`}>
      <span className="underline">Underline</span><span className="overline">Overline</span><span className="line-through">Line-through</span>
    </div>;
  }
  if (q.includes('color?') || q.includes('background-color')) {
    return <div className={`${frame} flex items-center gap-3`}><span className="font-semibold text-blue-500">Blue text</span><span className="rounded bg-yellow-200 px-2 py-1 text-gray-900">Yellow background</span></div>;
  }
  if (q.includes('font-size') || q.includes('font-weight') || q.includes('font-family') || q.includes('line-height') || q.includes('text-align')) {
    const style = q.includes('font-size') ? { fontSize: '20px' } : q.includes('font-weight') ? { fontWeight: 700 } : q.includes('font-family') ? { fontFamily: 'Georgia, serif' } : q.includes('line-height') ? { lineHeight: 2 } : { textAlign: 'center' };
    return <div className={frame} style={style}>{q.includes('line-height') ? <>Two lines of text<br />with extra space</> : label}</div>;
  }
  if (q.includes('width and height') || q.includes('padding') || q.includes('margin') || q.includes('border?') || q.includes('border-radius') || q.includes('box-shadow') || q.includes('box-sizing')) {
    const style = q.includes('padding') ? { padding: '14px 24px' } : q.includes('margin') ? { margin: '10px auto', width: '55%' } : q.includes('border?') ? { border: '2px solid #38bdf8' } : q.includes('border-radius') ? { borderRadius: '18px' } : q.includes('box-shadow') ? { boxShadow: '0 5px 12px #0008' } : q.includes('width and height') ? { width: '130px', height: '55px' } : { boxSizing: 'border-box', width: '100%', border: '1px solid #38bdf8', padding: '8px' };
    return <div className={frame}><span className="inline-block rounded bg-sky-500/20 px-3 py-2" style={style}>Box</span></div>;
  }
  if (q.includes('display: flex') || q.includes('flex-direction') || q.includes('justify-content') || q.includes('align-items') || q.includes('gap?') || q.includes('flex-wrap') || q.includes('center an item')) {
    const column = q.includes('flex-direction');
    const style = { display: 'flex', flexDirection: column ? 'column' : 'row', gap: q.includes('gap?') ? '20px' : '8px', justifyContent: q.includes('justify') || q.includes('center an item') ? 'center' : 'flex-start', alignItems: q.includes('align') || q.includes('center an item') ? 'center' : 'stretch', flexWrap: q.includes('flex-wrap') ? 'wrap' : 'nowrap', minHeight: '52px' };
    return <div className={frame} style={style}>{['1', '2', '3'].map(n => <span key={n} className="rounded bg-sky-500/25 px-3 py-1.5 text-sky-200">{n}</span>)}</div>;
  }
  if (q.includes('display: grid') || q.includes('grid-template') || q.includes('fr?') || q.includes('minmax') || q.includes('responsive card grid')) {
    return <div className={`${frame} grid grid-cols-3 gap-2`}>{['Card 1', 'Card 2', 'Card 3'].map(n => <span key={n} className="rounded bg-violet-500/20 p-2 text-center text-violet-200">{n}</span>)}</div>;
  }
  if (q.includes('@media') || q.includes('rem?') || q.includes('vw and vh')) {
    return <div className={frame}><span className="rounded bg-emerald-500/20 px-3 py-2 text-emerald-200">Adapts to screen size</span></div>;
  }
  if (q.includes(':hover') || q.includes('transition')) {
    return <div className={frame}><button className="rounded bg-sky-500 px-3 py-2 font-medium text-white transition hover:scale-105 hover:bg-sky-400">Hover me</button></div>;
  }
  if (q.includes(':focus')) {
    return <div className={frame}><input aria-label="Example input" placeholder="Click here" className="rounded border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30" /></div>;
  }
  if (q.includes('transform')) {
    return <div className={frame}><span className="inline-block rounded bg-pink-500/25 px-3 py-2 transition hover:scale-110 hover:rotate-3">Hover me</span></div>;
  }
  if (q.includes('opacity')) return <div className={frame}><span className="rounded bg-orange-400 px-3 py-2 text-gray-900 opacity-50">50% visible</span></div>;
  if (q.includes('cursor')) return <div className={frame}><button className="cursor-pointer rounded bg-sky-500/25 px-3 py-2">Pointer cursor</button></div>;
  if (q.includes('object-fit') || q.includes('responsive?')) return <div className={frame}><div className="h-12 w-32 rounded bg-gradient-to-r from-sky-400 to-violet-500" /></div>;
  if (q.includes('display: none')) return <div className={frame}><span className="text-gray-400">Only this text remains — the hidden item has no space.</span></div>;
  if (q.includes('visibility')) return <div className={`${frame} flex gap-2`}><span className="rounded bg-sky-500/25 px-3 py-1">Visible</span><span className="invisible rounded bg-sky-500/25 px-3 py-1">Hidden</span><span className="rounded bg-sky-500/25 px-3 py-1">Visible</span></div>;
  if (q.includes('position') || q.includes('z-index') || q.includes('overflow')) return <div className={`${frame} relative h-14 overflow-hidden`}><span className="absolute left-4 top-3 rounded bg-violet-500/30 px-3 py-1">Layer 1</span><span className="absolute left-16 top-5 rounded bg-sky-500/40 px-3 py-1">Layer 2</span></div>;
  if (q.includes('remove bullets')) return <div className={frame}><div className="flex gap-4"><span>Home</span><span>About</span><span>Contact</span></div></div>;
  if (q.includes('calc')) return <div className={frame}><div className="h-3 w-[calc(100%-32px)] rounded bg-sky-400" /></div>;
  if (q.includes('variable')) return <div className={frame}><button className="rounded bg-blue-600 px-3 py-2 text-white">Brand button</button></div>;
  if (q.includes('simple button')) return <div className={frame}><button className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white">Save</button></div>;
  if (q.includes('center a block')) return <div className={frame}><div className="mx-auto w-32 rounded bg-sky-500/25 p-2 text-center">Centered</div></div>;
  if (q.includes('selector') || q.includes('specificity') || q.includes('!important')) return <div className={frame}><p className="text-red-400">This paragraph is styled</p><h3 className="font-bold text-gray-100">This heading is different</h3></div>;
  if (q.includes('comment') || q.includes('external css') || q.includes('rule format') || q.includes('css?') || q.includes('reading order')) return <div className={frame}><span className="font-semibold text-blue-400">Styled HTML result</span></div>;
  return <div className={frame}><span className="rounded bg-sky-500/20 px-3 py-2 text-sky-100">{label}</span></div>;
}

function CSSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => revisionSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('css_revision_last_read')) || null; }
    catch { return null; }
  });

  const revealedCount = Object.values(openAnswers).filter(Boolean).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null, token: null });
    navigate('/login');
  };

  const toggleAnswer = (key, question, sectionTitle) => {
    setOpenAnswers(prev => {
      const isOpening = !prev[key];
      if (isOpening) {
        const data = { key, question, sectionTitle };
        setLastRead(data);
        localStorage.setItem('css_revision_last_read', JSON.stringify(data));
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    const sectionIdx = parseInt(lastRead.key.split('-')[0], 10);
    setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
    setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
    setTimeout(() => {
      const el = questionRefs.current[lastRead.key];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const clearLastRead = () => {
    setLastRead(null);
    localStorage.removeItem('css_revision_last_read');
  };

  const toggleSection = (sIdx) => {
    setCollapsedSections(prev => ({ ...prev, [sIdx]: !prev[sIdx] }));
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = revisionSections.map(sec => ({
    ...sec,
    questions: q
      ? sec.questions.filter(item =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        )
      : sec.questions,
  })).filter(sec => sec.questions.length > 0);

  const totalVisible = filteredSections.reduce((s, sec) => s + sec.questions.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/sheet" className="text-sky-400 hover:text-sky-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-sky-400">CSS + Tailwind</span> Quick Revision
              </h1>
              <p className="text-xs text-gray-500">{totalQuestions} short definitions with examples</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-gray-400 text-sm hidden sm:block">{auth.user?.username}</span>
            <button onClick={handleLogout} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-sm rounded-lg transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-8 space-y-8">
        <div className="relative">
          <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search a CSS property or topic..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-sky-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">x</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-sky-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: revisionSections.length, color: 'text-cyan-300' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {lastRead && (
          <div className="flex items-center justify-between bg-sky-400/8 border border-sky-400/30 rounded-xl px-4 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sky-400 text-base flex-shrink-0">Pinned</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-sky-400 hover:bg-sky-300 text-black text-xs font-bold rounded-lg transition-colors">Resume</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">x</button>
            </div>
          </div>
        )}

        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">No Match</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-sky-400 text-xs hover:underline">Clear search</button>
          </div>
        )}

        {filteredSections.map((section, sIdx) => {
          const originalIdx = revisionSections.findIndex(s => s.title === section.title);
          const isCollapsed = q ? false : collapsedSections[originalIdx];
          return (
            <div key={sIdx}>
              <button
                onClick={() => toggleSection(originalIdx)}
                className="w-full flex items-center justify-between py-4 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sky-400 font-bold text-lg">{section.title}</span>
                  <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
                  <svg className={`w-4 h-4 text-sky-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className="h-px bg-[#1f1f1f] mb-2" />

              {!isCollapsed && (
                <div>
                  {section.questions.map((item, qIdx) => {
                    const key = `${originalIdx}-${qIdx}`;
                    const isOpen = openAnswers[key];
                    const isLastRead = lastRead?.key === key;
                    return (
                      <div
                        key={key}
                        ref={el => questionRefs.current[key] = el}
                        className={`border-b transition-all rounded-sm ${
                          isOpen
                            ? 'bg-sky-400/[0.06] border-sky-400/20'
                            : isLastRead
                            ? 'border-sky-400/15'
                            : 'border-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAnswer(key, item.q, section.title)}
                            className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isLastRead && <span className="text-sky-400 text-xs flex-shrink-0">Pin</span>}
                              <span className={`text-[17px] leading-snug ${isLastRead ? 'text-sky-200' : 'text-gray-200'}`}>{item.q}</span>
                            </div>
                            <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <a
                            href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in short.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ask ChatGPT"
                            className="flex-shrink-0 p-2 mr-1 text-red-400 hover:text-red-300 hover:scale-125 transition-all duration-300 rounded animate-spin [animation-duration:6s]"
                            onClick={e => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.648zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.679zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.603 1.497v2.999l-2.597 1.5-2.603-1.495z"/>
                            </svg>
                          </a>
                        </div>
                        {isOpen && (
                          <div className="px-1 pb-5 pt-2">
                            <p className="text-[16px] text-sky-300/80 px-2 pb-3 leading-relaxed">
                              <span className="text-sky-500 mr-1">Meaning:</span>{item.a}
                            </p>
                            {item.example && (
                              <div className="mx-2 rounded-lg border border-sky-400/15 bg-black/30 px-3 py-2.5">
                                <p className="mb-1.5 text-xs font-medium text-sky-400">Example</p>
                                <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-gray-300">{item.example}</pre>
                              </div>
                            )}
                            <div className="mx-2 mt-3">
                              <p className="mb-1.5 text-xs font-medium text-emerald-400">Example result</p>
                              <ExamplePreview item={item} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {q && filteredSections.length > 0 && (
          <p className="text-xs text-gray-600 text-center pt-2">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </div>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default CSSSheet;
