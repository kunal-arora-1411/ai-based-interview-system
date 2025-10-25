import React, { useState, useEffect, useRef } from 'react';
import { Screen, ScreenProps } from '../../types';
import { WIZARD_STEPS } from '../../constants';

const WizardScreen: React.FC<ScreenProps> = ({ navigate }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const currentStep = WIZARD_STEPS[currentStepIndex];

    const handleNext = () => {
        if (currentStep.isFinal) {
            navigate(Screen.SystemCheck);
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (currentStep.id === 'persona' && contentRef.current) {
            const personaOptions = contentRef.current.querySelectorAll<HTMLElement>('.persona-option');
            const descriptions = contentRef.current.querySelectorAll<HTMLElement>('.persona-description');

            const handlePersonaClick = (e: Event) => {
                const target = e.currentTarget as HTMLDivElement;
                const selectedPersona = target.dataset.persona;

                personaOptions.forEach(opt => {
                    const img = opt.querySelector('img');
                    if (opt.dataset.persona === selectedPersona) {
                        opt.classList.remove('opacity-60');
                        img?.classList.add('border-amber-500');
                        img?.classList.remove('border-transparent');
                    } else {
                        opt.classList.add('opacity-60');
                        img?.classList.remove('border-amber-500');
                        img?.classList.add('border-transparent');
                    }
                });

                descriptions.forEach(desc => {
                    if (desc.dataset.desc === selectedPersona) {
                        desc.classList.remove('hidden');
                    } else {
                        desc.classList.add('hidden');
                    }
                });
            };

            personaOptions.forEach(option => {
                option.addEventListener('click', handlePersonaClick);
            });

            return () => {
                 personaOptions.forEach(option => {
                    option.removeEventListener('click', handlePersonaClick);
                });
            }
        }
    }, [currentStep.id]);


    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="glass-card shadow-glass-glow text-center w-full max-w-lg p-8 md:p-12">
                <h1 className="text-2xl font-bold mb-4">{currentStep.title}</h1>
                <div 
                    ref={contentRef}
                    className="prose prose-slate dark:prose-invert mx-auto mb-8"
                    dangerouslySetInnerHTML={{ __html: currentStep.content.replace(/border-purple-500/g, 'border-amber-500') }}
                />
                 <div className="flex justify-center gap-2 mb-8">
                    {WIZARD_STEPS.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                index <= currentStepIndex ? 'bg-amber-500' : 'bg-slate-500/40'
                            }`}
                        />
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    className="btn-primary text-lg w-full"
                >
                    {currentStep.buttonText}
                </button>
            </div>
        </div>
    );
};

export default WizardScreen;