import { motion } from 'framer-motion';
import { Heart, Activity, Brain, Droplets, TrendingUp, Calendar, FileText, Clock } from 'lucide-react';
import GlassWidget from '@/components/GlassWidget';
import VitalIcon from '@/components/VitalIcon';
import EKGLine from '@/components/EKGLine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const healthData = [
  { day: 'Mon', heartRate: 72, bloodPressure: 120, oxygen: 98, steps: 8500 },
  { day: 'Tue', heartRate: 75, bloodPressure: 118, oxygen: 97, steps: 9200 },
  { day: 'Wed', heartRate: 70, bloodPressure: 122, oxygen: 98, steps: 7800 },
  { day: 'Thu', heartRate: 73, bloodPressure: 119, oxygen: 99, steps: 10100 },
  { day: 'Fri', heartRate: 71, bloodPressure: 121, oxygen: 98, steps: 8900 },
  { day: 'Sat', heartRate: 68, bloodPressure: 117, oxygen: 98, steps: 11200 },
  { day: 'Sun', heartRate: 69, bloodPressure: 118, oxygen: 99, steps: 6500 },
];

const medicalHistory = [
  { date: '2025-01-20', event: 'Annual Check-up', type: 'checkup', doctor: 'Dr. Sarah Chen' },
  { date: '2025-01-15', event: 'Blood Work Results', type: 'lab', doctor: 'Lab Services' },
  { date: '2025-01-10', event: 'Flu Vaccination', type: 'vaccine', doctor: 'Dr. Michael Ross' },
  { date: '2024-12-28', event: 'Cardiology Consultation', type: 'specialist', doctor: 'Dr. Emily Park' },
  { date: '2024-12-15', event: 'Prescription Renewal', type: 'prescription', doctor: 'Dr. Sarah Chen' },
];

const typeColors: Record<string, string> = {
  checkup: 'hsl(180 60% 55%)',
  lab: 'hsl(200 70% 65%)',
  vaccine: 'hsl(160 70% 50%)',
  specialist: 'hsl(280 60% 65%)',
  prescription: 'hsl(45 90% 55%)',
};

const PatientDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gradient-primary">
            Health Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, Alex. Here's your health overview.</p>
        </div>
        <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Last updated: Today, 2:30 PM</span>
        </div>
      </motion.div>

      {/* Vital Signs Row */}
      <motion.div variants={itemVariants}>
        <GlassWidget floating={false} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Current Vitals</h2>
            <EKGLine width={150} height={40} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <VitalIcon type="heart" />
              <div>
                <div className="text-2xl font-display font-bold text-foreground">72</div>
                <div className="text-xs text-muted-foreground">BPM • Normal</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <VitalIcon type="activity" />
              <div>
                <div className="text-2xl font-display font-bold text-foreground">120/80</div>
                <div className="text-xs text-muted-foreground">mmHg • Optimal</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <VitalIcon type="oxygen" />
              <div>
                <div className="text-2xl font-display font-bold text-foreground">98%</div>
                <div className="text-xs text-muted-foreground">SpO2 • Excellent</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <VitalIcon type="temperature" />
              <div>
                <div className="text-2xl font-display font-bold text-foreground">36.6°</div>
                <div className="text-xs text-muted-foreground">Celsius • Normal</div>
              </div>
            </div>
          </div>
        </GlassWidget>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <motion.div variants={itemVariants}>
          <GlassWidget floating={false} className="p-6 h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Heart Rate Trend</h3>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Stable</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(180 60% 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(180 60% 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 20% 20%)" />
                <XAxis dataKey="day" stroke="hsl(200 15% 60%)" fontSize={12} />
                <YAxis domain={[60, 85]} stroke="hsl(200 15% 60%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(210 25% 12% / 0.9)',
                    border: '1px solid hsl(200 30% 40% / 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                  }}
                  labelStyle={{ color: 'hsl(200 20% 95%)' }}
                />
                <Area
                  type="monotone"
                  dataKey="heartRate"
                  stroke="hsl(180 60% 55%)"
                  strokeWidth={2}
                  fill="url(#heartRateGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassWidget>
        </motion.div>

        {/* Activity Chart */}
        <motion.div variants={itemVariants}>
          <GlassWidget floating={false} className="p-6 h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                <h3 className="font-display font-semibold text-foreground">Daily Steps</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Avg: <span className="text-foreground font-medium">8,886</span> steps
              </div>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(200 70% 65%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(200 70% 65%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 20% 20%)" />
                <XAxis dataKey="day" stroke="hsl(200 15% 60%)" fontSize={12} />
                <YAxis stroke="hsl(200 15% 60%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(210 25% 12% / 0.9)',
                    border: '1px solid hsl(200 30% 40% / 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                  }}
                  labelStyle={{ color: 'hsl(200 20% 95%)' }}
                />
                <Area
                  type="monotone"
                  dataKey="steps"
                  stroke="hsl(200 70% 65%)"
                  strokeWidth={2}
                  fill="url(#stepsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassWidget>
        </motion.div>
      </div>

      {/* Medical History Timeline */}
      <motion.div variants={itemVariants}>
        <GlassWidget floating={false} className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Medical History</h3>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div 
              className="absolute left-[19px] top-2 bottom-2 w-0.5"
              style={{
                background: 'linear-gradient(180deg, hsl(180 60% 55%), hsl(200 70% 65%))',
              }}
            />
            
            <div className="space-y-6">
              {medicalHistory.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  {/* Timeline dot */}
                  <div 
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${typeColors[item.type]}20`,
                      boxShadow: `0 0 15px ${typeColors[item.type]}40`,
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ background: typeColors[item.type] }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 glass-card p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground">{item.event}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {item.date}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.doctor}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassWidget>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Health Score', value: '92', suffix: '/100', icon: Heart, trend: '+3' },
          { label: 'Sleep Quality', value: '7.5', suffix: 'hrs', icon: Brain, trend: '+0.5' },
          { label: 'Hydration', value: '2.1', suffix: 'L', icon: Droplets, trend: '+0.3' },
          { label: 'Active Days', value: '5', suffix: '/7', icon: Activity, trend: '+1' },
        ].map((stat, index) => (
          <GlassWidget key={index} floating={false} className="p-4">
            <div className="flex items-start justify-between">
              <stat.icon className="w-5 h-5 text-primary" />
              <span className="text-xs text-green-400">↑ {stat.trend}</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-display font-bold text-foreground">
                {stat.value}
                <span className="text-sm text-muted-foreground font-normal">{stat.suffix}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          </GlassWidget>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PatientDashboard;