
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger,
} from '@/components/ui/accordion';

type FAQItem = {
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    question: "What if the scrapper doesn't arrive for pickup?",
    answer: "If your scheduled scrapper doesn't arrive within 30 minutes of the agreed time, you can report this from your dashboard and we'll immediately reassign a nearby scrapper. You'll also receive priority status for your next pickup."
  },
  {
    question: "How does the pricing work?",
    answer: "We provide transparent pricing based on material type: ₹10/kg for metal, ₹5/kg for paper, and ₹8/kg for plastic. These rates are updated weekly based on market conditions. You can view current rates directly in the app before scheduling a pickup."
  },
  {
    question: "How do I redeem my recycling points?",
    answer: "After accumulating points, visit the 'Points' section in your dashboard where you can exchange points for rewards like discount coupons for eco-friendly products or donate them to environmental charities. Each 10 points/kg recycled adds to your total."
  },
  {
    question: "What types of waste can I recycle through ScrapEasy?",
    answer: "ScrapEasy handles paper, cardboard, plastic bottles and containers, glass bottles and jars, aluminum cans, and small electronics. For special items like large appliances or potentially hazardous materials, please contact us for custom arrangements."
  },
  {
    question: "How is biomedical waste handled?",
    answer: "Biomedical waste requires special handling. When selecting this option during pickup scheduling, only specially trained and certified scrappers will be assigned. Please ensure all biomedical waste is properly contained according to safety guidelines."
  },
  {
    question: "Can I track the scrapper in real-time?",
    answer: "Yes, once a scrapper accepts your request, you can track their location in real-time through our app. You'll also receive notifications when they're 5 minutes away from your location."
  },
  {
    question: "What's the minimum weight for pickup?",
    answer: "Our minimum pickup weight is 7 kg of recyclable material. For smaller amounts, you can use our community drop-off points indicated on the app map or accumulate more recyclables for your next pickup."
  },
  {
    question: "How do I become a scrapper on ScrapEasy?",
    answer: "To become a scrapper, sign up with the 'Scrapper' role, complete our online safety training module, submit necessary identification documents, and complete a brief video interview. Once approved, you can start accepting pickup requests."
  }
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFAQs = searchQuery 
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="scrap-container">
        <h1 className="scrap-heading">Frequently Asked Questions</h1>
        
        {/* Search box */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="scrap-input"
          />
        </div>
        
        {/* FAQ Accordion */}
        <div className="scrap-card mb-8">
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg font-medium text-gray-800 hover:text-scrap-green">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center py-4 text-gray-600">No matching questions found. Try a different search term.</p>
          )}
        </div>
        
        {/* Contact section */}
        <div className="text-center">
          <p className="mb-4 text-lg text-gray-700">Can't find what you're looking for?</p>
          <Link to="/contact">
            <Button className="scrap-btn-primary">
              Contact Support
            </Button>
          </Link>
        </div>
        
        {/* Return link */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-scrap-blue hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
