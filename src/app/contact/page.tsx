import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'À Propos & Contact — SAHIH MODE',
  description:
    'Découvrez l’univers de SAHIH MODE, marque marocaine de prêt-à-porter haut de gamme. Contactez-nous directement via WhatsApp.',
}

export default function ContactPage() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212600000000'

  return (
    <div className="bg-white min-h-screen">
      {/* Hero section */}
      <section className="relative py-20 lg:py-28 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4 font-light">
            Maison de Mode Marocaine
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight mb-6">
            L&apos;Élégance Intemporelle
          </h1>
          <p className="text-gray-300 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
            SAHIH MODE incarne la rencontre entre le minimalisme contemporain et
            le raffinement artisanal, créant une garde-robe moderne pour les
            esprits exigeants.
          </p>
        </div>
      </section>

      {/* Brand story */}
      <section className="py-20 lg:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-3 font-medium">
              Notre Philosophie
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-black font-normal mb-6 leading-tight">
              Une vision pure du vestiaire contemporain
            </h2>
            <div className="space-y-4 text-sm text-gray-600 font-light leading-relaxed">
              <p>
                Fondée avec une passion inébranlable pour la précision et les
                matières nobles, <strong>SAHIH MODE</strong> redéfinit le
                prêt-à-porter au Maroc. Chaque pièce est pensée comme une œuvre
                d&apos;équilibre entre coupes impeccables et confort absolu.
              </p>
              <p>
                Nous rejetons l&apos;éphémère au profit de silhouettes durables,
                polyvalentes et sophistiquées. Nos collections monochromes célèbrent
                la puissance du noir et du blanc — un hommage éternel à la
                simplicité élégante.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 p-8 sm:p-10 bg-gray-50/50 space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 border border-black flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-black font-normal mb-1">
                  Matières d&apos;Exception
                </h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Coton peigné lourd, lainages structurés et toiles denses sélectionnés
                  avec la plus grande rigueur.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 border border-black flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-black font-normal mb-1">
                  Service Sur-Mesure
                </h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Conseil personnalisé en direct via WhatsApp pour vous guider sur
                  les tailles, coupes et associations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & WhatsApp CTA */}
      <section className="bg-gray-50 border-y border-gray-200 py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-3">
              Nous Joindre
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-black font-normal mb-4">
              Une Question ? Échangeons Directement
            </h2>
            <p className="text-sm text-gray-600 font-light">
              Notre équipe est à votre disposition 7j/7 pour vous assister et
              prendre vos commandes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-gray-200 p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-serif text-base text-black mb-2 font-normal">
                WhatsApp Ventes
              </h3>
              <p className="text-xs text-gray-500 mb-4 font-light">
                Réponse instantanée pour commande et conseil
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  'Bonjour SAHIH MODE, j’aimerais avoir des renseignements.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-black underline tracking-wider uppercase hover:text-gray-600"
              >
                +{whatsappNumber}
              </a>
            </div>

            <div className="bg-white border border-gray-200 p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-black mb-2 font-normal">
                Disponibilité
              </h3>
              <p className="text-xs text-gray-500 mb-2 font-light">
                Lundi – Dimanche
              </p>
              <p className="text-xs font-semibold text-black tracking-wider">
                09:00 – 22:00 (GMT+1)
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-black mb-2 font-normal">
                Origine & Livraison
              </h3>
              <p className="text-xs text-gray-500 mb-2 font-light">
                Casablanca, Maroc
              </p>
              <p className="text-xs font-semibold text-black tracking-wider">
                Expédition partout au Royaume
              </p>
            </div>
          </div>

          {/* Big WhatsApp Banner */}
          <div className="bg-black text-white p-8 sm:p-12 text-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal mb-4">
              Discutez en direct avec un conseiller SAHIH MODE
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-light max-w-xl mx-auto mb-8">
              Commandez en un clic, demandez des photos réelles ou vérifiez la
              disponibilité d&apos;une taille.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Bonjour SAHIH MODE, je souhaite échanger avec un conseiller.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-gray-100 text-xs uppercase tracking-[0.2em] font-medium transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Démarrer la discussion WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
