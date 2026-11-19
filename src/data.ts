export type Category = 'clothing' | 'bags' | 'accessories'

export interface Product {
  id: string
  name: string
  price: number
  cat: Category
  sub: string
  img: string
  tone: string
  colors: string[]
  sizes?: string[]
  detail: string
  desc: string
  tag?: string
}

const u = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const categories: { key: Category; label: string; blurb: string; img: string }[] = [
  { key: 'clothing', label: 'Clothing', blurb: 'Hung on the rail, cut to drape.', img: u('1713881587420-113c1c43e28a', 1000) },
  { key: 'bags', label: 'Bags', blurb: 'Quiet leather, shaped to carry.', img: u('1614179689702-355944cd0918', 1000) },
  { key: 'accessories', label: 'Accessories', blurb: 'Small objects, considered.', img: u('1668819584056-6b4f13145988', 1000) },
]

const S = ['XS', 'S', 'M', 'L', 'XL']

export const products: Product[] = [
  { id: 'c1', name: 'Washed Linen Shirt', price: 68, cat: 'clothing', sub: 'Shirts', img: u('1713881587420-113c1c43e28a'), tone: '#ece8e1', colors: ['#f4f1ec', '#b9c4d0', '#1c1c1c'], sizes: S, detail: '100% European linen', desc: 'A relaxed, garment-washed shirt that softens with every wear. Boxy through the shoulder, long in the hem.', tag: 'New' },
  { id: 'c2', name: 'Oxford Blue Button-Up', price: 72, cat: 'clothing', sub: 'Shirts', img: u('1740711152088-88a009e877bb'), tone: '#e4e8ec', colors: ['#7f9bb8', '#f4f1ec'], sizes: S, detail: 'Brushed cotton oxford', desc: 'Crisp collar, soft hand. The shirt you reach for without thinking.' },
  { id: 'c3', name: 'Heavyweight Tee', price: 38, cat: 'clothing', sub: 'Tees', img: u('1713881917939-b558c8f50ccd'), tone: '#e9e6e2', colors: ['#1c1c1c', '#f4f1ec', '#8a8478'], sizes: S, detail: '240gsm organic cotton', desc: 'Dense jersey with a clean neckline that holds its shape wash after wash.', tag: 'Bestseller' },
  { id: 'c4', name: 'Fisherman Knit', price: 96, cat: 'clothing', sub: 'Knitwear', img: u('1574201635302-388dd92a4c3f'), tone: '#e8e5e0', colors: ['#9a978f', '#e7dfd0'], sizes: S, detail: 'Merino and cotton blend', desc: 'A chunky, textured knit with a generous neck. Warm without weight.' },
  { id: 'c5', name: 'Cloud Crew Sweater', price: 84, cat: 'clothing', sub: 'Knitwear', img: u('1646270968802-6bad28659329'), tone: '#ece7df', colors: ['#e7dfd0', '#c9b9a3', '#6d6a63'], sizes: S, detail: 'Lambswool, mid-weight', desc: 'Folded into stacks in our studio, worn everywhere else. Soft, even, quiet.', tag: 'New' },
  { id: 'c6', name: 'Everyday Tee, Ecru', price: 34, cat: 'clothing', sub: 'Tees', img: u('1693443688057-85f57b872a3c'), tone: '#ebe8e3', colors: ['#f4f1ec', '#1c1c1c'], sizes: S, detail: 'Combed cotton jersey', desc: 'The basic, perfected. A slightly longer body and a softly rounded hem.' },
  { id: 'b1', name: 'Noir Structured Bag', price: 148, cat: 'bags', sub: 'Shoulder', img: u('1614179689702-355944cd0918'), tone: '#dcd7cf', colors: ['#1c1c1c'], detail: 'Full-grain leather, silver hardware', desc: 'A compact shoulder bag with a soft structure and a magnetic flap.', tag: 'Bestseller' },
  { id: 'b2', name: 'Tan Everyday Tote', price: 128, cat: 'bags', sub: 'Totes', img: u('1624687943971-e86af76d57de'), tone: '#e0d6c8', colors: ['#9b6a43'], detail: 'Vegetable-tanned leather', desc: 'Roomy, light and ready to age. Develops a patina that is yours alone.' },
  { id: 'b3', name: 'Stone Crossbody', price: 112, cat: 'bags', sub: 'Crossbody', img: u('1559563458-527698bf5295'), tone: '#d9d9d7', colors: ['#9a9a98'], detail: 'Pebbled leather, brushed brass', desc: 'Hands-free and streamlined. Fits the phone, keys and not much else, on purpose.', tag: 'New' },
  { id: 'b4', name: 'Saddle Satchel', price: 164, cat: 'bags', sub: 'Satchels', img: u('1473188588951-666fce8e7c68'), tone: '#ddd3c5', colors: ['#7a4e2e'], detail: 'Italian calf leather', desc: 'A classic satchel with clean lines and a long, adjustable strap.' },
  { id: 'a1', name: 'Field Chronograph', price: 189, cat: 'accessories', sub: 'Watches', img: u('1584184804426-5e2aa23c2937'), tone: '#e3e1dd', colors: ['#1c1c1c', '#b8b8b8'], detail: '38mm steel case, sapphire glass', desc: 'A restrained chronograph with a matte dial and a quick-release strap.', tag: 'New' },
  { id: 'a2', name: 'Silver Dress Watch', price: 159, cat: 'accessories', sub: 'Watches', img: u('1586924289330-29cdd7363716'), tone: '#e6e4e0', colors: ['#c8c8c8'], detail: '36mm brushed silver case', desc: 'Slim, round and unfussy. Sits quietly beneath a cuff.' },
  { id: 'a3', name: 'Sun & Time Set', price: 215, cat: 'accessories', sub: 'Sets', img: u('1668819584056-6b4f13145988'), tone: '#e5e0d8', colors: ['#1c1c1c'], detail: 'Watch and acetate sunglasses', desc: 'Our best-loved pairing, boxed together for gifting.', tag: 'Set' },
  { id: 'a4', name: 'Frame & Fold Set', price: 98, cat: 'accessories', sub: 'Eyewear', img: u('1629139033414-76f3c0eacf84'), tone: '#e1dfdc', colors: ['#1c1c1c'], detail: 'Acetate frames, leather wallet', desc: 'Black acetate frames with a slim bifold wallet in matching leather.' },
]
