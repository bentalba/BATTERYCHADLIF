import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "Livrez-vous partout à Kénitra ?",
    answer: "Oui, nous couvrons tout Kénitra et ses environs incluant le Centre Ville, Maamora, Bir Rami, Saknia, Mehdia et Ouled Oujih. La livraison et l'installation sont gratuites à domicile ou sur votre lieu de travail."
  },
  {
    question: "Combien de temps pour être dépanné ?",
    answer: "En mode 'Urgence', nos techniciens arrivent généralement en moins de 30 à 45 minutes selon votre position. Pour une commande standard programmée, nous garantissons une livraison dans la journée."
  },
  {
    question: "Comment fonctionne la reprise de l'ancienne batterie ?",
    answer: "C'est simple : lors de l'installation de la nouvelle batterie, nous récupérons l'ancienne. En échange, nous déduisons immédiatement jusqu'à 200 DH du prix de votre nouvelle batterie (selon la taille/ampérage)."
  },
  {
    question: "Acceptez-vous le paiement à la livraison ?",
    answer: "Oui, vous ne payez qu'une fois la batterie installée et testée. Nous acceptons les espèces et les virements instantanés."
  },
  {
    question: "Que couvre la garantie de 2 ans ?",
    answer: "La garantie couvre tout défaut de fabrication ou défaillance prématurée de la batterie. Si la batterie lâche, nous la remplaçons gratuitement. Notez que la garantie ne couvre pas les décharges dues à un oubli de phares ou un alternateur défectueux."
  },
  {
    question: "L'installation est-elle vraiment gratuite ?",
    answer: "Oui, à 100%. Le prix affiché comprend la batterie, la livraison, l'installation professionnelle et la vérification de votre circuit de charge. Aucuns frais cachés."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] text-sm font-medium mb-4">
            Support Client
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-gray-500">
            Tout ce que vous devez savoir sur nos services de batterie à Kenitra
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div 
          className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border-b border-gray-200 last:border-0 px-2"
              >
                <AccordionTrigger className="text-base md:text-lg font-semibold text-gray-900 hover:text-[#0071E3] hover:no-underline transition-colors py-5 md:py-6 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* WhatsApp CTA */}
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-500 text-sm mb-3">
            Pas de réponse à votre question ?
          </p>
          <a 
            href="https://wa.me/212537XXXXXX?text=Bonjour,%20j'ai%20une%20question%20concernant%20vos%20batteries" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#25D366] font-semibold hover:underline transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Posez-la sur WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
