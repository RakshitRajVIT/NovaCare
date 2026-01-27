import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, User, Shield, Bell } from 'lucide-react';
import GlassWidget from '@/components/GlassWidget';
import DataRibbon from '@/components/DataRibbon';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to Nova Care',
    description: 'Your personal AI-powered health companion. Let\'s get you set up for the best experience.',
    icon: Heart,
  },
  {
    id: 2,
    title: 'Create Your Profile',
    description: 'Tell us about yourself so we can personalize your health insights and recommendations.',
    icon: User,
  },
  {
    id: 3,
    title: 'Privacy & Security',
    description: 'Your health data is encrypted and protected. You\'re always in control of your information.',
    icon: Shield,
  },
  {
    id: 4,
    title: 'Enable Notifications',
    description: 'Stay informed with health reminders, medication alerts, and important updates.',
    icon: Bell,
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-2xl px-6">
        {/* Progress indicators with data ribbons */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index <= currentStep
                    ? 'bg-primary shadow-lg'
                    : 'bg-muted'
                }`}
                style={{
                  boxShadow: index <= currentStep
                    ? '0 0 15px hsl(180 60% 55% / 0.5)'
                    : 'none',
                }}
                animate={{
                  scale: index === currentStep ? 1.3 : 1,
                }}
              />
              {index < steps.length - 1 && (
                <div className="w-16 mx-2 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ 
                      scaleX: index < currentStep ? 1 : 0,
                      opacity: index < currentStep ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="origin-left"
                  >
                    <DataRibbon />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="relative h-[400px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <GlassWidget floating={false} className="w-full p-8">
                <div className="flex flex-col items-center text-center">
                  {/* Icon with glow */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2 
                    }}
                    className="relative mb-8"
                  >
                    <div 
                      className="absolute inset-0 rounded-full animate-pulse-glow"
                      style={{
                        background: 'radial-gradient(circle, hsl(180 60% 55% / 0.3), transparent 70%)',
                        transform: 'scale(2)',
                      }}
                    />
                    <div className="relative p-6 rounded-2xl glass-card">
                      <CurrentIcon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-display font-bold text-gradient-primary mb-4"
                  >
                    {steps[currentStep].title}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-lg max-w-md leading-relaxed"
                  >
                    {steps[currentStep].description}
                  </motion.p>

                  {/* Step indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-sm text-muted-foreground"
                  >
                    Step {currentStep + 1} of {steps.length}
                  </motion.div>
                </div>
              </GlassWidget>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`glass-card px-6 py-3 flex items-center gap-2 transition-all duration-300 ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'haptic-glow cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStep}
            className="glass-card px-8 py-3 flex items-center gap-2 haptic-glow cursor-pointer border-glow"
          >
            <span className="text-sm font-medium text-foreground">
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            </span>
            <ChevronRight className="w-5 h-5 text-primary" />
          </motion.button>
        </div>

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onComplete}
          className="absolute top-4 right-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip setup
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OnboardingFlow;