import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  text: string;
  maxMarks: number;
  modelAnswer?: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdate: (id: string, updates: Partial<Question>) => void;
  onRemove: (id: string) => void;
  showModelAnswer?: boolean;
}

export function QuestionCard({
  question,
  index,
  onUpdate,
  onRemove,
  showModelAnswer = false,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            {index + 1}
          </span>
          <h4 className="font-medium">Question {index + 1}</h4>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={100}
              value={question.maxMarks}
              onChange={(e) =>
                onUpdate(question.id, { maxMarks: parseInt(e.target.value) || 0 })
              }
              className="w-20 h-9 text-center"
            />
            <span className="text-sm text-muted-foreground">marks</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(question.id)}
            className="h-9 w-9 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Textarea
        placeholder="Enter question text..."
        value={question.text}
        onChange={(e) => onUpdate(question.id, { text: e.target.value })}
        className="min-h-[80px] resize-none"
      />

      {showModelAnswer && (
        <div className="pt-2 border-t border-border/50">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Model Answer / Evaluation Key
          </label>
          <Textarea
            placeholder="Enter the expected answer or key points..."
            value={question.modelAnswer || ""}
            onChange={(e) => onUpdate(question.id, { modelAnswer: e.target.value })}
            className="min-h-[100px] resize-none"
          />
        </div>
      )}
    </motion.div>
  );
}
