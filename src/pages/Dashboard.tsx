import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AmbientBackground from '@/components/AmbientBackground';
import PatientDashboard from '@/components/dashboard/PatientDashboard';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground />
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 p-4 glass-card rounded-none border-0 border-b border-border/30">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-2 rounded-lg glass-card haptic-glow"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">
                Patient Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">Your complete health overview</p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto">
          <PatientDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;