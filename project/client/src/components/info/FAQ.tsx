import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export type FaqItem = { q: string; a: string };

export const FAQ = ({ items }: { items: FaqItem[] }) => (
  <Accordion type="single" collapsible className="w-full">
    {items.map((item) => (
      <AccordionItem key={item.q} value={item.q}>
        <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
        <AccordionContent className="text-gray-600">{item.a}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

