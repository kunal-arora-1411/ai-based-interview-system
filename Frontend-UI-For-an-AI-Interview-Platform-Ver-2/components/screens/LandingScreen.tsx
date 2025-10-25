import React, { useEffect, useState, useRef } from 'react';
import { Screen, ScreenProps } from '../../types';
import AiAvatar from '../ui/AiAvatar';

// --- Hero Background Mouse Animation ---
const HeroBackground = () => {
    const bgRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!bgRef.current) return;
            bgRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
            bgRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return <div ref={bgRef} className="hero-background"></div>;
};

// --- Animated Statistic ---
const AnimatedStat = ({ finalValue, suffix, text, decimals = 0 }: { finalValue: number; suffix: string, text: string, decimals?: number }) => {
    const [currentValue, setCurrentValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(element);
            }
        }, { threshold: 0.2 });

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);
    
    useEffect(() => {
        if (isVisible) {
            const duration = 2000;
            const startTime = performance.now();

            const animate = (time: number) => {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuad easing function for a smooth acceleration
                const easedProgress = progress * (2 - progress);
                const value = easedProgress * finalValue;
                
                setCurrentValue(value);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setCurrentValue(finalValue); // Ensure it ends on the final value
                }
            };
            requestAnimationFrame(animate);
        }
    }, [isVisible, finalValue]);

    return (
        <div ref={ref} className={`text-center scroll-triggered-animation ${isVisible ? 'is-visible' : ''}`}>
            <p className="text-5xl md:text-6xl font-extrabold text-gradient">
                {currentValue.toFixed(decimals)}{suffix}
            </p>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 mt-2">{text}</p>
        </div>
    );
};


// --- Features Data ---
const features = {
    tailored: {
        title: "Tailored Questions, Not Generic Scripts",
        description: "Upload your CV and the job description. Our AI analyzes them to create interview questions that are hyper-relevant to your skills and the role you're targeting.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.5 2H8.6c-.4 0-.8.2-1 .5l-6 6c-.3.3-.5.7-.5 1v8.4c0 .8.7 1.5 1.5 1.5h12.8c.8 0 1.5-.7 1.5-1.5V3.5c0-.8-.7-1.5-1.5-1.5z" /><path d="M3 8h18" /><path d="M12 20v-8" /></svg>,
        image: "https://images.unsplash.com/photo-1583321500443-eb7b593a2f60?q=80&w=800&auto=format&fit=crop"
    },
    feedback: {
        title: "Instant, Actionable Feedback",
        description: "Don't just practice, improve. Get immediate, detailed feedback on your answers, focusing on clarity, structure (like the STAR method), and technical depth.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z" /><path d="m7.5 12.5 2 2 4-4" /></svg>,
        image: "https://images.unsplash.com/photo-1554224155-8d04421cd6c3?q=80&w=800&auto=format&fit=crop"
    },
    progress: {
        title: "Track Your Progress Over Time",
        description: "Visualize your improvement with competency charts and session history. Watch your scores go up as you build confidence and master the art of the interview.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
        image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=800&auto=format&fit=crop"
    }
};
type FeatureKey = keyof typeof features;

// --- Testimonials Data ---
const testimonials = [
    { name: "Sarah K.", role: "Software Engineer", quote: "This tool was a game-changer. The AI's questions were tougher than my actual interviews. I felt so prepared and confident.", stars: 5 },
    { name: "Michael B.", role: "Product Manager", quote: "I struggled with structuring my answers. The STAR method feedback was invaluable. I finally nailed my behavioral interviews and landed a great offer.", stars: 5 },
    { name: "Jessica L.", role: "UX Designer", quote: "As a designer, I need to articulate my process clearly. Practicing with the AI helped me refine my portfolio presentation and storytelling.", stars: 5 }
];

// --- Section Component for Animation ---
const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(element);
            }
        }, { threshold: 0.1 });
        observer.observe(element);
        return () => {
            if(element) {
                observer.unobserve(element);
            }
        };
    }, []);
    return <div ref={ref} className={`scroll-triggered-animation ${isVisible ? 'is-visible' : ''} ${className}`}>{children}</div>;
};

// --- Main Landing Screen Component ---
const LandingScreen: React.FC<ScreenProps> = ({ navigate }) => {
    const [activeFeature, setActiveFeature] = useState<FeatureKey>('tailored');

    const splitTextByWord = (text: string, delayOffset: number = 0) => text.split(' ').map((word, index) => (
        <span key={index} className="inline-block overflow-hidden pb-1">
            <span className="inline-block animate-word-in" style={{ animationDelay: `${delayOffset + index * 100}ms` }}>
                {word}&nbsp;
            </span>
        </span>
    ));

    return (
        <div className="w-full min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
                <div className="relative w-full flex flex-col items-center text-center">
                    <HeroBackground />
                    <div className="relative mx-auto mb-8 w-72 h-72 md:w-96 md:h-96 animate-hero-avatar-float pointer-events-none" style={{ animationDelay: '500ms' }}>
                        <AiAvatar state="idle" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gradient mb-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
                            AI Copilot
                        </h1>
                        <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
                            {splitTextByWord("Ace Your Next Interview", 500)}
                        </h2>
                        <p className="text-lg md:text-xl text-slate-800 dark:text-slate-300 max-w-2xl mx-auto mt-4 animate-fade-in" style={{ animationDelay: '1100ms' }}>
                            Land your dream job with perfect practice. Get tailored questions from an AI that feels human and receive instant, actionable feedback.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 animate-fade-in text-left max-w-5xl" style={{ animationDelay: '1200ms' }}>
                            <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-600/10 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">AI-Tailored Questions</h3>
                                    <p className="text-sm text-slate-700 dark:text-slate-400">Questions are generated based on your unique CV and the specific job description.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-600/10 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z" /><path d="m7.5 12.5 2 2 4-4" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Instant, Actionable Feedback</h3>
                                    <p className="text-sm text-slate-700 dark:text-slate-400">Get immediate, detailed feedback on the clarity and structure of your answers.</p>
                                </div>
                            </div>
                             <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-600/10 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Track Your Improvement</h3>
                                    <p className="text-sm text-slate-700 dark:text-slate-400">Visualize your progress over time and watch your confidence grow.</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => navigate(Screen.SignUp)} className="btn-primary text-lg animate-fade-in" style={{ animationDelay: '1400ms' }}>
                            Start Practicing for Free
                        </button>
                        <p className="text-xs text-slate-700 dark:text-slate-400 mt-3 animate-fade-in" style={{ animationDelay: '1500ms' }}>
                            100% free to start. No credit card required.
                        </p>
                    </div>
                </div>
            </section>

             {/* Social Proof */}
            <AnimatedSection className="py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm font-bold tracking-widest uppercase text-slate-700 dark:text-slate-400">
                        TRUSTED BY ENGINEERS & MANAGERS AT
                    </p>
                    <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
                        {['Google', 'Amazon', 'Meta', 'Netflix', 'Stripe'].map((name, index) => (
                             <div key={name} className="staggered-fade-in bg-slate-500/5 dark:bg-slate-500/10 px-4 py-2 rounded-lg" style={{ animationDelay: `${100 * index}ms` }}>
                                 <span className="font-bold text-lg sm:text-xl tracking-wider text-gradient opacity-90">
                                    {name}
                                 </span>
                             </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Features Section */}
            <AnimatedSection className="py-20 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
                    <p className="text-lg text-slate-800 dark:text-slate-300 max-w-2xl mx-auto mb-12">Stop guessing. Start preparing with intelligent tools designed to make you shine.</p>
                    <div className="glass-card shadow-glass-glow p-4 sm:p-6">
                        <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-2 bg-slate-500/10 p-2 rounded-full mb-6">
                            {(Object.keys(features) as FeatureKey[]).map(key => (
                                <button
                                    key={key}
                                    onClick={() => setActiveFeature(key)}
                                    className={`flex-1 text-sm sm:text-base font-semibold px-4 py-2 rounded-full transition-colors duration-300 ${activeFeature === key ? 'feature-tab-active' : 'text-slate-700 dark:text-slate-400 hover:bg-slate-500/10'}`}
                                >
                                    {features[key].title.split(',')[0]}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                           <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                                <img key={activeFeature} src={features[activeFeature].image} alt={features[activeFeature].title} className="w-full h-full object-cover animate-fade-in"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3">{features[activeFeature].title}</h3>
                                <p className="text-slate-800 dark:text-slate-300">{features[activeFeature].description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
            
             {/* Stats Section */}
            <AnimatedSection className="py-20 px-4">
                 <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="glass-card p-6 no-hover-effect">
                        <AnimatedStat finalValue={91} suffix="%" text="Average Score Improvement" />
                    </div>
                    <div className="glass-card p-6 no-hover-effect">
                        <AnimatedStat finalValue={2} suffix="x" text="More Confident in Interviews" />
                    </div>
                    <div className="glass-card p-6 no-hover-effect">
                        <AnimatedStat finalValue={75} suffix="%" text="Users Hired Within 2 Months" />
                    </div>
                </div>
            </AnimatedSection>

            {/* Testimonials Section */}
            <AnimatedSection className="py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't Just Take Our Word For It</h2>
                    <p className="text-lg text-slate-800 dark:text-slate-300 max-w-2xl mx-auto mb-12">See how AI Copilot has helped professionals land their dream jobs.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {testimonials.map((t, i) => (
                             <div key={i} className="glass-card shadow-glass-glow p-6 flex flex-col" style={{ animationDelay: `${i*150}ms`}}>
                                <p className="text-3xl text-amber-400">★★★★★</p>
                                <p className="flex-1 my-4 text-slate-800 dark:text-slate-200">"{t.quote}"</p>
                                <div>
                                    <p className="font-bold">{t.name}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-400">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Final CTA */}
            <AnimatedSection className="py-24 px-4 text-center">
                 <div className="relative max-w-3xl mx-auto">
                    <div className="absolute inset-0.5 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full blur-xl opacity-50 -z-10"></div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gradient mb-4">
                        Ready to Nail Your Next Interview?
                    </h2>
                     <p className="text-lg md:text-xl text-slate-800 dark:text-slate-300 max-w-2xl mx-auto mt-4 mb-8">
                        Stop leaving it to chance. Start your free practice session today and walk into any interview with the confidence to succeed.
                    </p>
                    <button onClick={() => navigate(Screen.SignUp)} className="btn-primary text-xl px-8 py-4">
                        Get Started For Free
                    </button>
                 </div>
            </AnimatedSection>
        </div>
    );
};

export default LandingScreen;