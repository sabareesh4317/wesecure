import React, { useState, useEffect, useMemo } from 'react';
import { getLearningModuleContent } from '../services/geminiService';
import type { LearningModuleContent, InteractiveQuestion } from '../types';
import { LoadingSpinner, CloseIcon, CheckIcon, XCircleIcon, SparklesIcon } from './icons';

type LessonStage = 'loading' | 'welcome' | 'content' | 'final-quiz' | 'completion' | 'error';

interface LearningModuleProps {
    lessonTopic: string;
    onClose: () => void;
}

const LearningModule: React.FC<LearningModuleProps> = ({ lessonTopic, onClose }) => {
    const [stage, setStage] = useState<LessonStage>('loading');
    const [moduleContent, setModuleContent] = useState<LearningModuleContent | null>(null);
    const [error, setError] = useState('');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // State for interactive quizzes within lessons
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // State for final quiz
    const [finalQuizAnswers, setFinalQuizAnswers] = useState<Record<number, number>>({});
    const [finalScore, setFinalScore] = useState(0);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const jsonString = await getLearningModuleContent(lessonTopic);
                const content = JSON.parse(jsonString);
                setModuleContent(content);
                setStage('welcome');
            } catch (err: any) {
                setError(err.message || 'Failed to load module content.');
                setStage('error');
            }
        };
        fetchContent();
    }, [lessonTopic]);

    const totalSteps = moduleContent?.lessonSteps.length ?? 0;
    const progress = useMemo(() => {
        if (stage === 'welcome') return 0;
        if (stage === 'completion') return 100;
        if (stage === 'content') return ((currentStepIndex + 1) / (totalSteps + 1)) * 100;
        if (stage === 'final-quiz') return (totalSteps / (totalSteps + 1)) * 100;
        return 0;
    }, [stage, currentStepIndex, totalSteps]);

    const currentStep = moduleContent?.lessonSteps[currentStepIndex];
    const currentInteractiveQuestion = currentStep?.interactiveQuestion;

    const handleNextStep = () => {
        setSelectedOption(null);
        setShowFeedback(false);
        if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            setStage('final-quiz');
        }
    };

    const handleOptionSelect = (optionIndex: number) => {
        if (showFeedback) return;
        setSelectedOption(optionIndex);
        setShowFeedback(true);
    };

    const handleFinalQuizAnswer = (questionIndex: number, optionIndex: number) => {
        setFinalQuizAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleSubmitFinalQuiz = () => {
        let score = 0;
        moduleContent?.finalQuiz.questions.forEach((q, index) => {
            if (finalQuizAnswers[index] === q.correctOptionIndex) {
                score++;
            }
        });
        setFinalScore(score);
        setStage('completion');
    };
    
    const renderActionButton = () => {
        switch (stage) {
            case 'welcome':
                return <button onClick={() => setStage('content')} className="btn-run-scan text-base sm:text-lg w-full sm:w-auto h-12 flex items-center justify-center px-6">Begin Lesson</button>;
            case 'content': {
                if (!currentStep) return null;
                const isNextDisabled = currentInteractiveQuestion && !showFeedback;
                return <button onClick={handleNextStep} disabled={isNextDisabled} className="btn-run-scan w-full sm:w-auto h-12 flex items-center justify-center px-6 py-2">{currentStepIndex < totalSteps - 1 ? 'Next →' : 'Go to Final Quiz →'}</button>;
            }
            case 'final-quiz':
                 return <button onClick={handleSubmitFinalQuiz} className="btn-run-scan w-full sm:w-auto sm:max-w-sm text-base sm:text-lg h-12 flex items-center justify-center">Finish & See Score</button>;
            case 'completion':
                return (
                    <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                        <button onClick={onClose} className="btn-run-scan w-full sm:w-auto h-12 px-6 py-2">Finish Module</button>
                        <button className="upgrade-cta-button w-full sm:w-auto h-12 px-6 py-2 flex items-center justify-center gap-2">
                            <SparklesIcon className="w-5 h-5" />
                            Explore Premium
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderContent = () => {
        if (stage === 'loading') {
            return <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4"><LoadingSpinner /><p>Generating your lesson...</p></div>;
        }
        if (stage === 'error') {
            return <div className="text-center p-8 min-h-[calc(100vh-200px)] flex flex-col justify-center items-center"><p className="text-red-400">{error}</p><button onClick={onClose} className="mt-4 btn-run-scan px-4 py-2">Close</button></div>;
        }
        if (!moduleContent) return null;

        if (stage === 'welcome') {
            return (
                <div className="text-center animate-fade-in-section w-full min-h-[calc(100vh-250px)] flex flex-col items-center justify-center">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{moduleContent.title}</h1>
                        <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">{moduleContent.objective}</p>
                    </div>
                </div>
            );
        }

        if (stage === 'content' && currentStep) {
            return (
                <div className="animate-fade-in-section w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">{currentStep.title}</h2>
                    <div className="space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base">
                        {currentStep.content.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                    <div className="my-8 key-takeaways-box">
                        <h4 className="font-bold text-indigo-300 mb-2">Key Takeaways</h4>
                        <ul className="list-disc list-inside space-y-3 text-xs sm:text-sm text-gray-300">
                            {currentStep.keyTakeaways.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                    {currentInteractiveQuestion && (
                        <div className="mt-8 pt-6 border-t border-gray-700/50">
                            <h3 className="font-bold text-base sm:text-lg text-white mb-4">{currentInteractiveQuestion.questionText}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {currentInteractiveQuestion.options.map((opt, i) => {
                                    const isCorrect = i === currentInteractiveQuestion.correctOptionIndex;
                                    const isSelected = selectedOption === i;
                                    let classes = 'quiz-option';
                                    if (showFeedback && isSelected) {
                                        classes += isCorrect ? ' correct' : ' incorrect';
                                    } else if (isSelected) {
                                        classes += ' selected';
                                    }
                                    return <button key={i} onClick={() => handleOptionSelect(i)} disabled={showFeedback} className={classes}>{opt}</button>
                                })}
                            </div>
                            {showFeedback && selectedOption !== null && (
                                <div className={`mt-4 feedback-box ${selectedOption === currentInteractiveQuestion.correctOptionIndex ? 'feedback-box-correct' : 'feedback-box-incorrect'}`}>
                                    <p className="font-semibold flex items-center gap-2 text-sm">
                                        {selectedOption === currentInteractiveQuestion.correctOptionIndex ? <CheckIcon className="text-green-400 w-5 h-5 flex-shrink-0" /> : <XCircleIcon className="text-red-400 w-5 h-5 flex-shrink-0" />}
                                        <span>{selectedOption === currentInteractiveQuestion.correctOptionIndex ? currentInteractiveQuestion.feedbackCorrect : currentInteractiveQuestion.feedbackIncorrect}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        if (stage === 'final-quiz') {
            return (
                <div className="animate-fade-in-section w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Final Knowledge Quiz</h2>
                    <div className="space-y-8">
                        {moduleContent.finalQuiz.questions.map((q, qIndex) => (
                             <div key={qIndex}>
                                <h3 className="font-bold text-base sm:text-lg text-white mb-4">{qIndex + 1}. {q.questionText}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((opt, oIndex) => {
                                        const isSelected = finalQuizAnswers[qIndex] === oIndex;
                                        return <button key={oIndex} onClick={() => handleFinalQuizAnswer(qIndex, oIndex)} className={`quiz-option ${isSelected ? 'selected' : ''}`}>{opt}</button>
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (stage === 'completion') {
            return (
                <div className="text-center animate-fade-in-section w-full min-h-[calc(100vh-250px)] flex flex-col items-center justify-center">
                    <div className="completion-card max-w-lg mx-auto">
                        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-16 h-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path className="completion-checkmark" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{moduleContent.completionScreen.title}</h1>
                        <p className="mt-2 text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                            Your Score: {finalScore} / {moduleContent.finalQuiz.questions.length}
                        </p>
                        <p className="mt-4 text-gray-400 text-sm sm:text-base">{moduleContent.completionScreen.summary}</p>
                    </div>
                </div>
            )
        }

        return null;
    };


    return (
        <div className="learning-module overflow-y-auto">
            <header className="sticky top-0 z-20 flex justify-between items-center p-4 bg-gray-900/50 backdrop-blur-md border-b border-gray-700/50">
                <span className="text-sm font-bold text-indigo-400 truncate max-w-[calc(100%-60px)]">{lessonTopic}</span>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50 transition-colors flex-shrink-0"><CloseIcon /></button>
            </header>
            <main className="flex-grow p-4 sm:p-6 md:p-10 pb-28">
                <div className="max-w-4xl w-full mx-auto">
                    {renderContent()}
                </div>
            </main>
            <footer className="sticky bottom-0 left-0 right-0 z-10">
                <div className="relative h-1">
                    <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                {stage !== 'loading' && stage !== 'error' && (
                    <div className="bg-gray-900/50 backdrop-blur-md border-t border-gray-700/50 p-4">
                        <div className="max-w-4xl mx-auto flex justify-center sm:justify-end">
                            {renderActionButton()}
                        </div>
                    </div>
                )}
            </footer>
        </div>
    );
};

export default LearningModule;