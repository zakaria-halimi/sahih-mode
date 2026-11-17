import Link from 'next/link'

const BOUTIQUE_LINKS = [
  { href: '/boutique', label: 'Toute la boutique' },
  { href: '/boutique?category=femme', label: 'Femme' },
  { href: '/boutique?category=homme', label: 'Homme' },
  { href: '/boutique?category=accessoires', label: 'Accessoires' },
  { href: '/boutique?featured=true', label: 'Coups de cœur' },
]

const INFO_LINKS = [
  { href: '/a-propos', label: 'À propos' },
  { href: '/livraison', label: 'Livraison & retours' },
  { href: '/faq', label: 'FAQ' },
  { href: '/mentions-legales', label: 'Mentions légales' },
]

const CONTACT_LINKS = [
  { href: '/contact', label: 'Contactez-nous' },
  { href: 'https://instagram.com/sahihmode', label: 'Instagram', external: true },
  { href: 'https://wa.me/212600000000', label: 'WhatsApp', external: true },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      {/* Top section */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col gap-5">
            <Link
              href="/"
              className="font-serif text-xl tracking-[0.3em] uppercase font-semibold text-black select-none hover:text-gray-700 transition-colors duration-200"
            >
              SAHIH MODE
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed tracking-wide max-w-[200px]">
              Mode authentique et luxueuse, soigneusement sélectionnée pour vous.
            </p>
          </div>

          {/* Boutique */}
          <FooterColumn title="Boutique" links={BOUTIQUE_LINKS} />

          {/* Informations */}
          <FooterColumn title="Informations" links={INFO_LINKS} />

          {/* Contact */}
          <FooterColumn title="Contact" links={CONTACT_LINKS} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400 tracking-widest uppercase">
            &copy; {year} SAHIH MODE. Tous droits réservés.
          </p>
          <p className="text-[11px] text-gray-400 tracking-wider">
            Maroc · Livraison nationale
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Helper ──────────────────────────────────────────────────────────── */

interface FooterLink {
  href: string
  label: string
  external?: boolean
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: FooterLink[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black">
        {title}
      </h3>
      <ul className="flex flex-col gap-3 list-none m-0 p-0">
        {links.map(({ href, label, external }) => (
          <li key={href}>
            <Link
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="text-xs text-gray-500 tracking-wide hover:text-black transition-colors duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
