import { memo, useState, useEffect } from "react";
import { Zap, Activity, Thermometer, Gauge } from "lucide-react";

interface VoltageAnimationProps {
  chargeLevel: number;
}

const VoltageAnimation = memo(({ chargeLevel }: VoltageAnimationProps) => {
  const [displayVoltage, setDisplayVoltage] = useState(10.5);
  const [waveOffset, setWaveOffset] = useState(0);
  
  // Calculate voltage based on charge level (10.5V dead - 12.8V full)
  const targetVoltage = 10.5 + (chargeLevel / 100) * 2.3;
  
  // Animate voltage display smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayVoltage(prev => {
        const diff = targetVoltage - prev;
        if (Math.abs(diff) < 0.01) return targetVoltage;
        return prev + diff * 0.08;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [targetVoltage]);
  
  // Animate wave
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 2) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const amperage = (chargeLevel / 100) * 45 + 5;
  const watts = displayVoltage * amperage;
  const statusColor = displayVoltage >= 12.4 ? '#22c55e' : displayVoltage >= 11.8 ? '#0071E3' : '#ef4444';
  const statusText = displayVoltage >= 12.4 ? 'OPTIMAL' : displayVoltage >= 11.8 ? 'CHARGING' : 'LOW';
  
  return (
    <div className="relative">
      {/* Main Display Panel */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          {/* Circuit pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100">
            <pattern id="circuit" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10h8v2h4v-4h2v4h4v-2h2" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
          
          {/* Glowing orbs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0071E3]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
        </div>
        
        {/* Header */}
        <div className="relative px-5 py-3 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0071E3] to-cyan-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-medium text-white">VOLT MONITOR</div>
              <div className="text-[10px] text-slate-500">Real-time diagnostics</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-500 font-mono">LIVE</span>
          </div>
        </div>
        
        {/* Main Voltage Display */}
        <div className="relative px-5 py-6">
          {/* Voltage Gauge */}
          <div className="text-center mb-6">
            <div className="inline-block relative">
              {/* Animated Ring */}
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                {/* Background ring */}
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                />
                {/* Progress ring */}
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={statusColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${chargeLevel * 2.64} 264`}
                  transform="rotate(-90 50 50)"
                  style={{
                    filter: `drop-shadow(0 0 8px ${statusColor})`,
                    transition: 'stroke-dasharray 0.5s ease-out'
                  }}
                />
                {/* Inner glow */}
                <circle
                  cx="50" cy="50" r="35"
                  fill="none"
                  stroke={statusColor}
                  strokeWidth="1"
                  opacity="0.3"
                />
              </svg>
              
              {/* Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div 
                  className="text-4xl font-bold font-mono tracking-tight"
                  style={{ 
                    color: statusColor,
                    textShadow: `0 0 20px ${statusColor}50`
                  }}
                >
                  {displayVoltage.toFixed(1)}
                </div>
                <div className="text-sm font-medium text-slate-400">VOLTS</div>
              </div>
            </div>
          </div>
          
          {/* Waveform Display */}
          <div className="mb-5 bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3" /> Signal
              </span>
              <span className="text-[10px] font-mono text-cyan-400">{chargeLevel.toFixed(0)}%</span>
            </div>
            <svg className="w-full h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={statusColor} stopOpacity="0.5"/>
                  <stop offset="100%" stopColor={statusColor} stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Wave fill */}
              <path
                d={`M0,20 ${Array.from({length: 20}, (_, i) => {
                  const x = i * 10 + waveOffset % 10;
                  const y = 20 + Math.sin((i + waveOffset/10) * 0.8) * (8 + chargeLevel/10);
                  return `L${x},${y}`;
                }).join(' ')} L200,20 L200,40 L0,40 Z`}
                fill="url(#waveGrad)"
              />
              {/* Wave line */}
              <path
                d={`M0,20 ${Array.from({length: 21}, (_, i) => {
                  const x = i * 10 + waveOffset % 10;
                  const y = 20 + Math.sin((i + waveOffset/10) * 0.8) * (8 + chargeLevel/10);
                  return `L${x},${y}`;
                }).join(' ')}`}
                fill="none"
                stroke={statusColor}
                strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 4px ${statusColor})` }}
              />
            </svg>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Amperage */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3" /> AMP
              </div>
              <div className="text-lg font-bold text-[#0071E3] font-mono">
                {amperage.toFixed(0)}
              </div>
              <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0071E3] to-cyan-400 transition-all duration-300"
                  style={{ width: `${(amperage / 50) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Watts */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> WATT
              </div>
              <div className="text-lg font-bold text-[#FF6B00] font-mono">
                {watts.toFixed(0)}
              </div>
              <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF6B00] to-yellow-400 transition-all duration-300"
                  style={{ width: `${Math.min((watts / 640) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            {/* Temperature */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <Thermometer className="w-3 h-3" /> TEMP
              </div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                25°
              </div>
              <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: '40%' }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Status */}
        <div className="relative px-5 py-3 border-t border-slate-700/50 flex items-center justify-between bg-slate-800/30">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: statusColor,
                boxShadow: `0 0 8px ${statusColor}`
              }}
            />
            <span className="text-xs font-medium" style={{ color: statusColor }}>
              {statusText}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            CCA: {Math.round(400 + chargeLevel * 3)}
          </div>
        </div>
      </div>
    </div>
  );
});

VoltageAnimation.displayName = 'VoltageAnimation';

export default VoltageAnimation;
