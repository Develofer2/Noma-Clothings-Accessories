import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { categories, products, type Category, type Product } from './data'

type View = 'home' | 'closet'
interface CartItem { id: string; size?: string; qty: number }

const money = (n: number) => `$${n.toFixed(0)}`

/* ---------- icons ---------- */
const I = ({ d, className = 'size-5' }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={d} /></svg>
)
const BagIcon = () => <I d="M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2" />
const UserIcon = () => <I d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c0-3.5 3-6 7-6s7 2.5 7 6" />
const CloseIcon = ({ className }: { className?: string }) => <I className={className} d="M6 6l12 12M18 6 6 18" />
const Arrow = () => <I className="size-4" d="M5 12h14m-5-5 5 5-5 5" />

/* ---------- reveal on scroll ---------- */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`} style={{ ['--d' as string]: `${delay}ms` }}>{children}</div>
}

/* ---------- product presentations ---------- */
function Swatches({ colors }: { colors: string[] }) {
  return <span className="flex gap-1.5">{colors.map((c) => <i key={c} className="size-3 rounded-full border border-black/15" style={{ background: c }} />)}</span>
}

function Meta({ p }: { p: Product }) {
  return (
    <div className="mt-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-[15px] font-medium leading-tight">{p.name}</h3>
        <p className="mt-1 text-xs text-mute">{p.sub}</p>
      </div>
      <p className="text-[15px] tabular-nums">{money(p.price)}</p>
    </div>
  )
}

function QuickAdd({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onAdd() }}
      className="absolute inset-x-3 bottom-3 translate-y-[140%] rounded-full bg-paper/90 py-3 text-xs font-medium tracking-wide backdrop-blur transition duration-500 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:translate-y-0 hover:bg-ink hover:text-paper"
    >
      Quick add
    </button>
  )
}

/* Clothing: hung on a rail, portrait, sways */
function ClothCard({ p, open, quick }: { p: Product; open: () => void; quick: () => void }) {
  return (
    <article onClick={open} className="group cursor-pointer">
      <div className="relative pt-5">
        <div className="absolute inset-x-0 top-0 h-px bg-line" />
        <div className="absolute left-1/2 top-0 h-5 w-px bg-ink/30" />
        <div className="sway">
          <div className="relative aspect-[3/4] overflow-hidden" style={{ background: p.tone }}>
            <img src={p.img} alt={p.name} loading="lazy" className="size-full object-cover transition duration-[1400ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:scale-105" />
            {p.tag && <span className="absolute left-3 top-3 rounded-full bg-paper px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest">{p.tag}</span>}
            <div className="absolute inset-x-0 top-3 flex justify-center gap-1 opacity-0 transition duration-500 group-hover:opacity-100">
              {p.sizes?.map((s) => <span key={s} className="rounded-full bg-paper/80 px-2 py-0.5 text-[10px] backdrop-blur">{s}</span>)}
            </div>
            <QuickAdd onAdd={quick} />
          </div>
        </div>
      </div>
      <Meta p={p} />
      <div className="mt-3"><Swatches colors={p.colors} /></div>
    </article>
  )
}

/* Bags: arched alcove, like a display niche */
function BagCard({ p, open, quick }: { p: Product; open: () => void; quick: () => void }) {
  return (
    <article onClick={open} className="group cursor-pointer">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] p-5 pb-0 transition-colors duration-700" style={{ background: p.tone }}>
        <div className="size-full overflow-hidden rounded-t-[999px]">
          <img src={p.img} alt={p.name} loading="lazy" className="size-full object-cover transition duration-[1400ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:scale-110 group-hover:-translate-y-1" />
        </div>
        {p.tag && <span className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full bg-paper px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest">{p.tag}</span>}
        <QuickAdd onAdd={quick} />
      </div>
      <Meta p={p} />
      <p className="mt-2 text-xs text-mute">{p.detail}</p>
    </article>
  )
}

/* Accessories: gallery plinth with specimen label */
function AccCard({ p, i, open, quick }: { p: Product; i: number; open: () => void; quick: () => void }) {
  return (
    <article onClick={open} className="group cursor-pointer">
      <div className="relative aspect-square p-6 transition-colors duration-700" style={{ background: p.tone }}>
        <div className="relative size-full overflow-hidden rounded-full ring-1 ring-black/10 transition duration-700 group-hover:rounded-[2rem]">
          <img src={p.img} alt={p.name} loading="lazy" className="size-full object-cover transition duration-[1400ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:scale-110" />
        </div>
        <span className="absolute left-4 top-4 text-[10px] tracking-[.2em] text-mute">NO. {String(i + 1).padStart(2, '0')}</span>
        {p.tag && <span className="absolute right-4 top-4 text-[10px] uppercase tracking-[.2em]">{p.tag}</span>}
        <QuickAdd onAdd={quick} />
      </div>
      <Meta p={p} />
      <p className="mt-2 border-t border-line pt-2 text-xs text-mute">{p.detail}</p>
    </article>
  )
}

function Card({ p, i, open, quick }: { p: Product; i: number; open: () => void; quick: () => void }) {
  if (p.cat === 'clothing') return <ClothCard p={p} open={open} quick={quick} />
  if (p.cat === 'bags') return <BagCard p={p} open={open} quick={quick} />
  return <AccCard p={p} i={i} open={open} quick={quick} />
}

/* ---------- header ---------- */
function Header({ view, go, count, bumpKey, openCart, openLogin }: { view: View; go: (v: View, c?: Category | 'all') => void; count: number; bumpKey: number; openCart: () => void; openLogin: () => void }) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 24)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition duration-500 ${solid ? 'bg-paper/85 backdrop-blur-md shadow-[0_1px_0_var(--color-line)]' : ''}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <nav className="flex flex-1 gap-8 text-sm">
          <button className="ulink" data-active={view === 'home'} onClick={() => go('home')}>Home</button>
          <button className="ulink" data-active={view === 'closet'} onClick={() => go('closet', 'all')}>Closet</button>
        </nav>
        <button onClick={() => go('home')} className="flex items-center gap-2" aria-label="Go to Noma home">
          <img src="/logo.svg" alt="" className="size-8" />
          <span className="font-serif text-3xl tracking-tight">noma<span className="text-mute">.</span></span>
        </button>
        <div className="flex flex-1 items-center justify-end gap-5">
          <button onClick={openLogin} className="flex items-center gap-2 text-sm transition hover:opacity-60"><UserIcon /><span className="hidden sm:inline">Log in</span></button>
          <button onClick={openCart} className="relative flex items-center gap-2 text-sm transition hover:opacity-60" aria-label="Open cart">
            <BagIcon />
            {count > 0 && <span key={bumpKey} className="bump absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-ink text-[10px] text-paper">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}

/* ---------- home ---------- */
function Home({ go, open, quick }: { go: (v: View, c?: Category | 'all') => void; open: (p: Product) => void; quick: (p: Product) => void }) {
  const featured = products.filter((p) => p.tag === 'New' || p.tag === 'Bestseller').slice(0, 4)
  const words = ['Linen', 'Knitwear', 'Leather', 'Timepieces', 'Everyday', 'Quiet', 'Considered']
  return (
    <>
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pb-16 pt-28 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="fade-up text-xs uppercase tracking-[.3em] text-mute" style={{ animationDelay: '.1s' }}>Spring / Summer 25</p>
          <h1 className="mt-6 font-serif text-[clamp(3.5rem,9vw,8rem)] leading-[.92] tracking-tight">
            <span className="line-mask"><span style={{ animationDelay: '.2s' }}>Wear less,</span></span>
            <span className="line-mask"><span style={{ animationDelay: '.35s' }}><em className="text-mute">mean</em> more.</span></span>
          </h1>
          <p className="fade-up mt-8 max-w-sm leading-relaxed text-mute" style={{ animationDelay: '.7s' }}>Calm, considered essentials in natural fabrics. Clothing, bags and accessories made to be worn on repeat.</p>
          <div className="fade-up mt-10 flex gap-4" style={{ animationDelay: '.85s' }}>
            <button onClick={() => go('closet', 'all')} className="group flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition hover:gap-5">Shop the closet <Arrow /></button>
            <button onClick={() => go('closet', 'clothing')} className="rounded-full border border-ink/20 px-7 py-3.5 text-sm transition hover:border-ink">Clothing</button>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="unveil aspect-[4/5] overflow-hidden bg-line" style={{ animationDelay: '.2s' }}>
            <img src={categories[0].img} alt="Linen shirt on the rail" className="size-full object-cover" />
          </div>
          <div className="fade-up absolute -bottom-6 -left-6 hidden w-40 bg-paper p-2 shadow-xl shadow-black/5 sm:block md:-left-12" style={{ animationDelay: '1.2s' }}>
            <div className="[animation:float_6s_ease-in-out_infinite]">
              <img src={products[6].img} alt="" className="aspect-square w-full object-cover" />
              <p className="mt-2 px-1 pb-1 text-[11px]">Noir Structured Bag</p>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-line py-5">
        <div className="marquee flex w-max gap-12 font-serif text-3xl">
          {[...words, ...words, ...words, ...words].map((w, i) => <span key={i} className="flex items-center gap-12">{w}<i className="size-1.5 rounded-full bg-ink/40" /></span>)}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <Reveal><h2 className="font-serif text-5xl tracking-tight md:text-6xl">Shop by <em className="text-mute">category</em></h2></Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.key} delay={i * 120}>
              <button onClick={() => go('closet', c.key)} className="group block w-full text-left">
                <div className="aspect-[4/5] overflow-hidden bg-line">
                  <img src={c.img} alt={c.label} loading="lazy" className="size-full object-cover transition duration-[1600ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:scale-105" />
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div><h3 className="font-serif text-3xl">{c.label}</h3><p className="mt-1 text-sm text-mute">{c.blurb}</p></div>
                  <span className="grid size-10 place-items-center rounded-full border border-ink/20 transition group-hover:bg-ink group-hover:text-paper"><Arrow /></span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#efece6] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex items-end justify-between">
            <h2 className="font-serif text-5xl tracking-tight md:text-6xl">Just <em className="text-mute">in</em></h2>
            <button onClick={() => go('closet', 'all')} className="ulink hidden text-sm sm:block">View all</button>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}><Card p={p} i={i} open={() => open(p)} quick={() => quick(p)} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-32 md:grid-cols-2">
        <Reveal><div className="aspect-[4/3] overflow-hidden"><img src={products[4].img} alt="Folded sweaters" loading="lazy" className="size-full object-cover" /></div></Reveal>
        <Reveal delay={150}>
          <p className="text-xs uppercase tracking-[.3em] text-mute">Our approach</p>
          <h2 className="mt-5 font-serif text-5xl leading-tight tracking-tight">Fewer pieces. Better fabrics. Longer lives.</h2>
          <p className="mt-6 max-w-md leading-relaxed text-mute">Every garment is cut from natural fibres and finished by hand. We release small runs, so your closet stays quiet and your wardrobe stays yours.</p>
        </Reveal>
      </section>

      <Footer />
    </>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-14 md:flex-row">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="size-10" />
            <p className="font-serif text-4xl">noma.</p>
          </div>
          <p className="mt-2 text-sm text-mute">A demo shop. Nothing here is for sale.</p>
        </div>
        <div className="flex gap-16 text-sm text-mute">
          <ul className="space-y-2"><li>Clothing</li><li>Bags</li><li>Accessories</li></ul>
          <ul className="space-y-2"><li>Shipping</li><li>Returns</li><li>Contact</li></ul>
        </div>
      </div>
    </footer>
  )
}

/* ---------- closet ---------- */
function Closet({ cat, setCat, open, quick }: { cat: Category | 'all'; setCat: (c: Category | 'all') => void; open: (p: Product) => void; quick: (p: Product) => void }) {
  const tabs: { key: Category | 'all'; label: string }[] = [{ key: 'all', label: 'All' }, ...categories.map((c) => ({ key: c.key, label: c.label }))]
  const groups = useMemo(() => (cat === 'all' ? categories : categories.filter((c) => c.key === cat)), [cat])
  return (
    <div className="mx-auto max-w-7xl px-6 pb-8 pt-32">
      <h1 className="fade-up font-serif text-6xl tracking-tight md:text-8xl">The <em className="text-mute">closet</em></h1>
      <p className="fade-up mt-4 max-w-md text-mute" style={{ animationDelay: '.1s' }}>Everything we make, arranged the way it deserves to be seen.</p>

      <div className="sticky top-16 z-30 -mx-6 mt-10 bg-paper/85 px-6 backdrop-blur-md">
        <div className="relative flex gap-2 border-b border-line">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setCat(t.key)} className={`ulink px-5 py-4 text-sm transition ${cat === t.key ? '' : 'text-mute hover:text-ink'}`} data-active={cat === t.key}>{t.label}</button>
          ))}
        </div>
      </div>

      <div key={cat}>
        {groups.map((g) => {
          const list = products.filter((p) => p.cat === g.key)
          const cols = g.key === 'clothing' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
          return (
            <section key={g.key} className="pt-16">
              <div className="fade-up mb-8 flex items-baseline justify-between border-b border-line pb-4">
                <h2 className="font-serif text-4xl">{g.label}</h2>
                <p className="text-sm text-mute">{g.blurb} <span className="ml-2">({list.length})</span></p>
              </div>
              <div className={`grid grid-cols-2 gap-x-5 gap-y-14 ${cols}`}>
                {list.map((p, i) => (
                  <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}><Card p={p} i={i} open={() => open(p)} quick={() => quick(p)} /></div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
      <div className="mt-28 -mx-6"><Footer /></div>
    </div>
  )
}

/* ---------- overlays ---------- */
function Overlay({ onClose, children, side }: { onClose: () => void; children: ReactNode; side?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className={`fixed inset-0 z-50 flex ${side ? 'justify-end' : 'items-center justify-center p-4'}`}>
      <div onClick={onClose} className="absolute inset-0 bg-ink/35 backdrop-blur-[2px] [animation:fade_.4s_both]" />
      {children}
    </div>
  )
}

function QuickView({ p, onClose, add }: { p: Product; onClose: () => void; add: (p: Product, size?: string) => void }) {
  const [size, setSize] = useState(p.sizes?.[2])
  const [color, setColor] = useState(p.colors[0])
  const [done, setDone] = useState(false)
  return (
    <Overlay onClose={onClose}>
      <div className="relative grid max-h-[92vh] w-full max-w-4xl overflow-auto bg-paper [animation:pop_.6s_cubic-bezier(.2,.8,.2,1)_both] md:grid-cols-2">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-paper/90 transition hover:rotate-90" aria-label="Close"><CloseIcon className="size-4" /></button>
        <div className="group aspect-[4/5] overflow-hidden md:aspect-auto" style={{ background: p.tone }}>
          <img src={p.img} alt={p.name} className="size-full object-cover transition duration-[2s] group-hover:scale-110" />
        </div>
        <div className="flex flex-col p-8 md:p-10">
          <p className="text-xs uppercase tracking-[.25em] text-mute">{categories.find((c) => c.key === p.cat)?.label} / {p.sub}</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight">{p.name}</h2>
          <p className="mt-2 text-xl tabular-nums">{money(p.price)}</p>
          <p className="mt-6 leading-relaxed text-mute">{p.desc}</p>
          <p className="mt-4 text-sm">{p.detail}</p>

          <p className="mt-8 text-xs uppercase tracking-widest text-mute">Colour</p>
          <div className="mt-3 flex gap-3">
            {p.colors.map((c) => <button key={c} onClick={() => setColor(c)} aria-label="colour" className={`size-7 rounded-full border border-black/15 transition ${color === c ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : ''}`} style={{ background: c }} />)}
          </div>

          {p.sizes && (
            <>
              <p className="mt-6 text-xs uppercase tracking-widest text-mute">Size</p>
              <div className="mt-3 flex gap-2">
                {p.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`size-11 rounded-full border text-sm transition ${size === s ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}>{s}</button>)}
              </div>
            </>
          )}

          <button
            onClick={() => { add(p, size); setDone(true); setTimeout(onClose, 700) }}
            className="mt-auto rounded-full bg-ink py-4 text-sm text-paper transition hover:opacity-85 md:mt-10"
          >{done ? 'Added to bag' : 'Add to bag'}</button>
        </div>
      </div>
    </Overlay>
  )
}

function CartDrawer({ items, onClose, setQty, go }: { items: CartItem[]; onClose: () => void; setQty: (id: string, size: string | undefined, d: number) => void; go: () => void }) {
  const lines = items.map((it) => ({ ...it, p: products.find((p) => p.id === it.id)! }))
  const total = lines.reduce((s, l) => s + l.p.price * l.qty, 0)
  const [ordered, setOrdered] = useState(false)
  return (
    <Overlay onClose={onClose} side>
      <aside className="relative flex h-full w-full max-w-md flex-col bg-paper [animation:slideIn_.6s_cubic-bezier(.2,.8,.2,1)_both]">
        <div className="flex items-center justify-between border-b border-line p-6">
          <h2 className="font-serif text-3xl">Your bag</h2>
          <button onClick={onClose} aria-label="Close" className="transition hover:rotate-90"><CloseIcon /></button>
        </div>
        {ordered ? (
          <div className="grid flex-1 place-items-center p-10 text-center fade-up">
            <div><p className="font-serif text-4xl">Thank you.</p><p className="mt-3 text-mute">This is a demo, so no order was placed.</p></div>
          </div>
        ) : lines.length === 0 ? (
          <div className="grid flex-1 place-items-center p-10 text-center">
            <div><p className="font-serif text-3xl">Nothing here yet</p><button onClick={go} className="ulink mt-4 text-sm">Browse the closet</button></div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-auto px-6">
              {lines.map((l, i) => (
                <li key={l.id + l.size} className="fade-up flex gap-4 py-5" style={{ animationDelay: `${i * 60}ms` }}>
                  <img src={l.p.img} alt="" className="h-24 w-20 object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2"><p className="text-sm font-medium">{l.p.name}</p><p className="text-sm tabular-nums">{money(l.p.price * l.qty)}</p></div>
                    {l.size && <p className="mt-1 text-xs text-mute">Size {l.size}</p>}
                    <div className="mt-auto flex w-fit items-center gap-4 rounded-full border border-line px-3 py-1 text-sm">
                      <button onClick={() => setQty(l.id, l.size, -1)} aria-label="Decrease">−</button>
                      <span className="w-3 text-center tabular-nums">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.size, 1)} aria-label="Increase">+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-6">
              <div className="flex justify-between"><span className="text-mute">Subtotal</span><span className="tabular-nums">{money(total)}</span></div>
              <button onClick={() => setOrdered(true)} className="mt-5 w-full rounded-full bg-ink py-4 text-sm text-paper transition hover:opacity-85">Checkout</button>
            </div>
          </>
        )}
      </aside>
    </Overlay>
  )
}

function Login({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [sent, setSent] = useState(false)
  return (
    <Overlay onClose={onClose}>
      <div className="relative w-full max-w-md bg-paper p-10 [animation:pop_.6s_cubic-bezier(.2,.8,.2,1)_both]">
        <button onClick={onClose} className="absolute right-4 top-4 transition hover:rotate-90" aria-label="Close"><CloseIcon className="size-5" /></button>
        {sent ? (
          <div className="fade-up py-10 text-center"><p className="font-serif text-4xl">Welcome in.</p><p className="mt-3 text-mute">Demo only. Nothing was saved.</p></div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(onClose, 1400) }}>
            <h2 className="font-serif text-4xl">{mode === 'in' ? 'Welcome back' : 'Join noma.'}</h2>
            <p className="mt-2 text-sm text-mute">{mode === 'in' ? 'Log in to your account.' : 'Create an account in a minute.'}</p>
            <div className="mt-8 space-y-5">
              {mode === 'up' && <Field label="Name" type="text" />}
              <Field label="Email" type="email" />
              <Field label="Password" type="password" />
            </div>
            <button className="mt-8 w-full rounded-full bg-ink py-4 text-sm text-paper transition hover:opacity-85">{mode === 'in' ? 'Log in' : 'Create account'}</button>
            <p className="mt-6 text-center text-sm text-mute">
              {mode === 'in' ? 'New here? ' : 'Have an account? '}
              <button type="button" className="ulink text-ink" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>{mode === 'in' ? 'Create account' : 'Log in'}</button>
            </p>
          </form>
        )}
      </div>
    </Overlay>
  )
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-mute">{label}</span>
      <input type={type} required className="mt-1 w-full border-b border-line bg-transparent py-2 outline-none transition focus:border-ink" />
    </label>
  )
}

/* ---------- app ---------- */
export default function App() {
  const [view, setView] = useState<View>('home')
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [bumpKey, setBumpKey] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [quickP, setQuickP] = useState<Product | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    document.title = view === 'closet' ? 'Noma — The Closet' : 'Noma — Considered Essentials'
  }, [view])

  const go = (v: View, c: Category | 'all' = 'all') => { setView(v); setCat(c); window.scrollTo({ top: 0 }) }

  const add = (p: Product, size?: string) => {
    setCart((c) => {
      const s = size ?? p.sizes?.[2]
      const ex = c.find((i) => i.id === p.id && i.size === s)
      return ex ? c.map((i) => (i === ex ? { ...i, qty: i.qty + 1 } : i)) : [...c, { id: p.id, size: s, qty: 1 }]
    })
    setBumpKey((k) => k + 1)
    setToast(`${p.name} added`)
  }
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 1800); return () => clearTimeout(t) }, [toast])

  const setQty = (id: string, size: string | undefined, d: number) =>
    setCart((c) => c.map((i) => (i.id === id && i.size === size ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0))

  const count = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="min-h-screen">
      <Header view={view} go={go} count={count} bumpKey={bumpKey} openCart={() => setCartOpen(true)} openLogin={() => setLoginOpen(true)} />
      <main key={view} className="[animation:fade_.7s_both]">
        {view === 'home' ? <Home go={go} open={setQuickP} quick={add} /> : <Closet cat={cat} setCat={setCat} open={setQuickP} quick={add} />}
      </main>
      {quickP && <QuickView p={quickP} onClose={() => setQuickP(null)} add={add} />}
      {cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} setQty={setQty} go={() => { setCartOpen(false); go('closet', 'all') }} />}
      {loginOpen && <Login onClose={() => setLoginOpen(false)} />}
      {toast && <div key={toast} className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-6 py-3 text-sm text-paper [animation:pop_.5s_both]">{toast}</div>}
    </div>
  )
}
