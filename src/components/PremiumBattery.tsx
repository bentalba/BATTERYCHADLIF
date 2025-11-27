import { memo } from "react";

interface PremiumBatteryProps {
  chargeLevel: number;
  isBackground?: boolean;
  opacity?: number;
}

const PremiumBattery = memo(({ chargeLevel, isBackground = false, opacity = 1 }: PremiumBatteryProps) => {
  const glowColor = chargeLevel >= 80 ? '#22c55e' : '#0071E3';
  const chargeWidth = Math.max(0, (chargeLevel / 100) * 186);

  return (
    <div 
      className={`relative ${isBackground ? 'w-full h-full' : 'w-full max-w-sm mx-auto'}`}
      style={{ 
        opacity,
        willChange: isBackground ? 'auto' : 'transform',
      }}
    >
      <svg
        viewBox="0 0 300 180"
        className={`w-full ${isBackground ? 'h-full' : ''}`}
        style={{
          filter: isBackground 
            ? `blur(${Math.max(0, 12 - chargeLevel * 0.08)}px)` 
            : `drop-shadow(0 20px 40px rgba(0, 113, 227, 0.2))`,
        }}
      >
        <defs>
          <linearGradient id="batteryBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>

          <linearGradient id="chargeFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0071E3" />
            <stop offset="100%" stopColor={chargeLevel >= 80 ? '#22c55e' : '#00a8ff'} />
          </linearGradient>
        </defs>

        {/* Ambient glow */}
        {!isBackground && (
          <ellipse 
            cx="150" 
            cy="140" 
            rx="85" 
            ry="15" 
            fill={glowColor}
            opacity="0.12"
          />
        )}

        {/* Battery shell */}
        <rect 
          x="30" 
          y="30" 
          width="210" 
          height="100" 
          rx="20" 
          fill="url(#batteryBody)"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* Inner dark area */}
        <rect 
          x="38" 
          y="38" 
          width="194" 
          height="84" 
          rx="14" 
          fill="#0f172a"
        />

        {/* Charge level */}
        <rect 
          x="42" 
          y="42" 
          width={chargeWidth} 
          height="76" 
          rx="10" 
          fill="url(#chargeFill)"
          style={{ transition: 'width 0.5s ease-out' }}
        />

        {/* Glass highlight */}
        <rect 
          x="38" 
          y="38" 
          width="194" 
          height="30" 
          rx="14" 
          fill="white"
          opacity="0.08"
        />

        {/* Segment lines */}
        <g opacity="0.12" stroke="white" strokeWidth="1">
          <line x1="85" y1="45" x2="85" y2="115" />
          <line x1="125" y1="45" x2="125" y2="115" />
          <line x1="165" y1="45" x2="165" y2="115" />
          <line x1="205" y1="45" x2="205" y2="115" />
        </g>

        {/* Terminal */}
        <rect 
          x="240" 
          y="55" 
          width="18" 
          height="50" 
          rx="6" 
          fill="#94a3b8"
        />
        <rect 
          x="240" 
          y="55" 
          width="18" 
          height="18" 
          rx="6" 
          fill="#cbd5e1"
        />

        {/* Percentage */}
        <text 
          x="135" 
          y="90" 
          textAnchor="middle" 
          fill="white" 
          fontSize="28" 
          fontWeight="600"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {Math.round(chargeLevel)}%
        </text>

        {/* Charging indicator */}
        {chargeLevel < 100 ? (
          <path 
            d="M173 72L165 82H171L169 90L177 80H171L173 72Z" 
            fill="#0071E3"
          />
        ) : (
          <path 
            d="M167 80L171 84L179 76" 
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* Status */}
      {!isBackground && (
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${chargeLevel}%`,
                  background: `linear-gradient(90deg, #0071E3, ${chargeLevel >= 80 ? '#22c55e' : '#00a8ff'})`,
                  transition: 'width 0.5s ease-out',
                }}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <span 
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: chargeLevel < 100 ? '#0071E3' : '#22c55e' }}
            />
            {chargeLevel < 100 ? 'Faites défiler pour charger' : 'Complètement chargé'}
          </p>
        </div>
      )}
    </div>
  );
});

PremiumBattery.displayName = 'PremiumBattery';

export default PremiumBattery;
