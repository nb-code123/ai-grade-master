import { motion } from "framer-motion";

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreDisplay({
  score,
  maxScore,
  label = "Score",
  size = "md",
}: ScoreDisplayProps) {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return "text-primary";
    if (percentage >= 60) return "text-accent";
    if (percentage >= 40) return "text-yellow-500";
    return "text-destructive";
  };

  const getStrokeColor = () => {
    if (percentage >= 80) return "hsl(var(--primary))";
    if (percentage >= 60) return "hsl(var(--accent))";
    if (percentage >= 40) return "hsl(45, 93%, 47%)";
    return "hsl(var(--destructive))";
  };

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`font-bold ${textSizes[size]} ${getColor()}`}
          >
            {score.toFixed(1)}
          </motion.span>
          <span className="text-xs text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
