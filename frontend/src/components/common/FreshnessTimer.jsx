import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const FreshnessTimer = ({ expiryTime, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false, totalHours: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(expiryTime).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true, totalHours: 0 });
        return;
      }

      const totalHours = difference / (1000 * 60 * 60);
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isExpired: false, totalHours });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  if (timeLeft.isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-medium text-rose-600 ${compact ? 'text-xs' : 'text-sm'}`}>
        <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
        <span>Safe window expired</span>
      </div>
    );
  }

  const isCritical = timeLeft.totalHours <= 3;
  const isWarning = timeLeft.totalHours <= 6 && timeLeft.totalHours > 3;

  const colorClass = isCritical
    ? 'text-rose-600 bg-rose-50 border-rose-200 ring-1 ring-rose-400/20'
    : isWarning
    ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${colorClass}`}>
        <Clock className={`w-3 h-3 ${isCritical ? 'animate-spin' : ''}`} />
        <span>
          {timeLeft.hours > 0 ? `${timeLeft.hours}h ` : ''}
          {timeLeft.minutes}m left
        </span>
      </span>
    );
  }

  return (
    <div className={`flex items-center justify-between p-2.5 rounded-lg border ${colorClass}`}>
      <div className="flex items-center gap-2">
        <Clock className={`w-4 h-4 ${isCritical ? 'animate-pulse' : ''}`} />
        <span className="text-xs font-medium">Safe Consumption Window:</span>
      </div>
      <div className="font-bold text-sm tracking-tight">
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    </div>
  );
};
