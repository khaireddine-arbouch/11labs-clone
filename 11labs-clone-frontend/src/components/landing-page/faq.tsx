import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"

export default function Faq() {
  const faqs = [
    {
      question: "How realistic are the AI-generated voices?",
      answer:
        "Our AI-generated voices are highly realistic and often indistinguishable from human voices. We use advanced neural networks trained on thousands of hours of professional voice recordings to ensure natural intonation, emotion, and speech patterns.",
    },
    {
      question: "Can I create a custom voice that sounds like me?",
      answer:
        "Yes! With our Voice Converter feature, you can upload samples of your voice and create a digital voice clone. This is available on our Pro and Enterprise plans, with varying levels of customization options.",
    },
    {
      question: "What file formats do you support for export?",
      answer:
        "We support exporting audio in multiple formats including MP3, WAV, FLAC, and OGG. You can choose the format and quality settings that best suit your needs.",
    },
    {
      question: "Is there an API available for integration?",
      answer:
        "Yes, we offer a comprehensive API for Enterprise customers. This allows you to integrate our voice technology directly into your applications, websites, or workflows.",
    },
    {
      question: "How do you handle data privacy and security?",
      answer:
        "We take data privacy very seriously. All voice data is encrypted both in transit and at rest. We do not use customer voice data to train our models without explicit permission, and you can request deletion of your voice data at any time.",
    },
  ]

  return (
    <section id="faq" className="w-full bg-muted/50 py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about our AI voice platform.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl py-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
