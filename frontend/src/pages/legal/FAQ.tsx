import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { getTranslation, type Language } from '../../translations';
import { LanguageSelector, SEO } from '../../components/shared';

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const t = getTranslation(language);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      question: t.faq.q1,
      answer: t.faq.a1
    },
    {
      question: t.faq.q2,
      answer: (
        <div className="space-y-2">
          <p>{t.faq.a2Title}</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>{t.faq.a2Point1}</strong></li>
            <li><strong>{t.faq.a2Point2}</strong></li>
          </ul>
          <p className="mt-2">{t.faq.a2Example}</p>
        </div>
      )
    },
    {
      question: t.faq.q3,
      answer: t.faq.a3
    },
    {
      question: t.faq.q4,
      answer: t.faq.a4
    },
    {
      question: t.faq.q5,
      answer: t.faq.a5
    },
    {
      question: t.faq.q6,
      answer: t.faq.a6
    },
    {
      question: t.faq.q7,
      answer: t.faq.a7
    },
    {
      question: t.faq.q8,
      answer: t.faq.a8
    },
    {
      question: t.faq.q9,
      answer: (
        <div>
          <p>{t.faq.a9}</p>
          <p className="mt-2">
            <Link to="/privacy" className="text-primary hover:underline font-medium">
              {t.faq.a9Link}
            </Link>
          </p>
        </div>
      )
    },
    {
      question: t.faq.q10,
      answer: t.faq.a10
    },
    {
      question: t.faq.q11,
      answer: t.faq.a11
    },
    {
      question: t.faq.q12,
      answer: t.faq.a12
    },
    {
      question: t.faq.q13,
      answer: t.faq.a13
    },
    {
      question: t.faq.q14,
      answer: (
        <div>
          <p>{t.faq.a14}</p>
          <p className="mt-2">{t.faq.a14Note}</p>
        </div>
      )
    },
    {
      question: t.faq.q15,
      answer: t.faq.a15
    },
    {
      question: t.faq.q16,
      answer: t.faq.a16
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t.faq.title} description="Frequently asked questions about MakanTak - The viral restaurant discount platform." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-primary hover:underline text-sm">
              ← {t.faq.backToHome}
            </Link>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.faq.title}</h1>
          <p className="text-muted-foreground">{t.faq.subtitle}</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
              >
                <h3 className="text-base font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 text-foreground/80 leading-relaxed">
                  {typeof faq.answer === 'string' ? (
                    <p>{faq.answer}</p>
                  ) : (
                    faq.answer
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h2 className="text-xl font-bold text-foreground mb-2">{t.faq.stillHaveQuestions}</h2>
          <p className="text-foreground/80 mb-4">
            {t.faq.stillHaveQuestionsDesc}
          </p>
          <Link
            to="/contact"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            {t.faq.contactSupport}
          </Link>
        </div>
      </div>
    </div>
  );
}
