'use client';

import { useState, useRef, useEffect } from 'react';
import LuxuryButton from '@/components/ui/LuxuryButton';

type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  projectCards?: ProjectCard[];
};

type ProjectCard = {
  title: string;
  price: string;
  image: string;
  slug: string;
  developer: string;
  location: string;
};

type Props = {
  locale?: 'ar' | 'en';
};

export default function AIConcierge({ locale = 'en' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined smart questions
  const smartQuestions = {
    en: [
      "Show me ready projects in Dubai Hills",
      "What's the expected ROI for Safa One?",
      "Find luxury villas under 5M AED",
      "Compare projects by Emaar vs DAMAC",
      "Show me off-plan projects with payment plans"
    ],
    ar: [
      "أرني المشاريع الجاهزة في دبي هيلز",
      "ما العائد الاستثماري المتوقع لمشروع صفا ون؟",
      "ابحث عن فلل فاخرة تحت 5 مليون درهم",
      "قارن مشاريع إعمار مع داماك",
      "أرني المشاريع تحت الإنشاء مع خطط السداد"
    ]
  };

  // AI Response Logic (simulated with local JSON data)
  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let projectCards: ProjectCard[] = [];

    // Simple keyword matching for demo
    if (lowerMessage.includes('dubai hills') || lowerMessage.includes('دبي هيلز')) {
      response = locale === 'ar' 
        ? 'وجدت 3 مشاريع متميزة في دبي هيلز. إليك أفضل الخيارات المتاحة:'
        : 'I found 3 exceptional projects in Dubai Hills. Here are the best available options:';
      
      projectCards = [
        {
          title: 'Golf Suites',
          price: 'من 2.1 مليون درهم',
          image: '/images/projects/golf-suites.jpg',
          slug: 'golf-suites',
          developer: 'Emaar',
          location: 'Dubai Hills Estate'
        },
        {
          title: 'Parkway Vistas',
          price: 'من 1.8 مليون درهم',
          image: '/images/projects/parkway-vistas.jpg',
          slug: 'parkway-vistas',
          developer: 'Emaar',
          location: 'Dubai Hills Estate'
        }
      ];
      
      suggestions = locale === 'ar' 
        ? ['عرض خريطة المنطقة', 'مقارنة الأسعار', 'جدولة زيارة']
        : ['Show area map', 'Compare prices', 'Schedule visit'];
        
    } else if (lowerMessage.includes('safa one') || lowerMessage.includes('صفا ون')) {
      response = locale === 'ar'
        ? 'مشروع صفا ون يحقق عائد استثماري متوقع 6.4% سنوياً. يُعتبر هذا العائد مرتفعاً ضمن سوق الخليج لعقارات 2025.'
        : 'Safa One project offers an expected ROI of 6.4% annually. This return is considered high within the Gulf market for 2025 properties.';
        
      suggestions = locale === 'ar'
        ? ['احسب عائدك الشخصي', 'عرض تفاصيل المشروع', 'مقارنة مع مشاريع أخرى']
        : ['Calculate your personal ROI', 'View project details', 'Compare with other projects'];
        
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('فاخر')) {
      response = locale === 'ar'
        ? 'إليك مجموعة من أفضل المشاريع الفاخرة المتاحة حالياً:'
        : 'Here are some of the finest luxury projects currently available:';
        
      projectCards = [
        {
          title: 'One Za\'abeel',
          price: 'من 4.5 مليون درهم',
          image: '/images/projects/one-zaabeel.jpg',
          slug: 'one-zaabeel',
          developer: 'Ithra Dubai',
          location: 'Za\'abeel'
        }
      ];
      
    } else {
      response = locale === 'ar'
        ? 'أفهم استفسارك. دعني أساعدك في العثور على أفضل الخيارات العقارية. يمكنك استخدام الأسئلة المقترحة أدناه:'
        : 'I understand your inquiry. Let me help you find the best real estate options. You can use the suggested questions below:';
        
      suggestions = smartQuestions[locale].slice(0, 3);
    }

    setIsTyping(false);
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions,
      projectCards
    };
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate AI response
    const aiResponse = await generateAIResponse(messageText);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: locale === 'ar' 
          ? 'مرحباً! أنا مساعدك العقاري الذكي. كيف يمكنني مساعدتك اليوم؟'
          : 'Hello! I\'m your AI real estate concierge. How can I assist you today?',
        timestamp: new Date(),
        suggestions: smartQuestions[locale].slice(0, 3)
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, locale]);

  return (
    <>
      {/* Floating Button */}
      <div className={`fixed bottom-6 ${locale === 'ar' ? 'left-6' : 'right-6'} z-50`}>
        <LuxuryButton
          variant="primary"
          size="lg"
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-all duration-300 relative animate-bounce p-0"
        >
          🤖
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </LuxuryButton>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md h-[600px] liquid-glass rounded-t-2xl border border-yellow-400/30 flex flex-col transform transition-transform duration-300 ease-out"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
              {/* Header */}
              <div className="p-4 border-b border-yellow-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-lg">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-bold gold-gradient">
                        {locale === 'ar' ? 'المساعد العقاري' : 'AI Concierge'}
                      </h3>
                      <p className="text-xs text-white/60">
                        {locale === 'ar' ? 'متصل الآن' : 'Online now'}
                      </p>
                    </div>
                  </div>
                  <LuxuryButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 hover:text-white text-xl p-2 min-w-0"
                  >
                    ×
                  </LuxuryButton>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-yellow-400 text-black'
                          : 'bg-black/40 text-white border border-yellow-400/20'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      
                      {/* Project Cards */}
                      {message.projectCards && message.projectCards.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.projectCards.map((project, index) => (
                            <div key={index} className="bg-black/60 rounded-lg p-3 border border-yellow-400/20">
                              <h4 className="font-semibold text-yellow-400 text-sm">{project.title}</h4>
                              <p className="text-xs text-white/80">{project.developer} • {project.location}</p>
                              <p className="text-sm font-bold text-white mt-1">{project.price}</p>
                              <a
                                href={`/${locale}/projects/${project.slug}`}
                                className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-black rounded-full text-xs hover:bg-yellow-300 transition-colors"
                              >
                                {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <LuxuryButton
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendMessage(suggestion)}
                              className="rounded-full text-xs"
                            >
                              {suggestion}
                            </LuxuryButton>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-black/40 text-white border border-yellow-400/20 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-yellow-400/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={locale === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                    className="flex-1 bg-black/40 border border-yellow-400/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400/50"
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <LuxuryButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed p-0"
                  >
                    {locale === 'ar' ? '←' : '→'}
                  </LuxuryButton>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}