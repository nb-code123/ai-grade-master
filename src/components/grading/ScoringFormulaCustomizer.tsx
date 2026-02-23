import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, RotateCcw, Sliders } from "lucide-react";
import { ScoringFormula, DEFAULT_FORMULA } from "@/lib/scoringFormula";

interface ScoringFormulaCustomizerProps {
    onFormulaChange: (formula: ScoringFormula) => void;
    initialFormula?: ScoringFormula;
}

export function ScoringFormulaCustomizer({
    onFormulaChange,
    initialFormula = DEFAULT_FORMULA
}: ScoringFormulaCustomizerProps) {
    const [formula, setFormula] = useState<ScoringFormula>(initialFormula);
    const [isExpanded, setIsExpanded] = useState(false);

    const total = formula.weights.keywords + formula.weights.semantic +
        formula.weights.diagram + formula.weights.grammar;
    const isValid = Math.abs(total - 100) < 0.1;

    // Use useEffect without onFormulaChange in deps to avoid infinite loops
    useEffect(() => {
        onFormulaChange(formula);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formula]);

    const handleWeightChange = useCallback((category: keyof typeof formula.weights, value: number) => {
        const numValue = Math.max(0, Math.min(100, value)); // Clamp between 0-100
        setFormula(prev => ({
            ...prev,
            weights: {
                ...prev.weights,
                [category]: numValue,
            },
        }));
    }, []);

    const handleReset = useCallback(() => {
        setFormula(DEFAULT_FORMULA);
    }, []);

    const handleToggleCustom = useCallback((useCustom: boolean) => {
        setFormula(prev => ({
            ...prev,
            useCustom,
        }));
    }, []);

    return (
        <Card className="glass border-primary/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <Sliders className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Scoring Formula</CardTitle>
                            <CardDescription>Customize evaluation weights</CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? "Collapse" : "Expand"}
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-6">
                    {/* Mode Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div>
                            <Label htmlFor="custom-mode" className="font-medium">Use Custom Formula</Label>
                            <p className="text-sm text-muted-foreground">
                                {formula.useCustom ? "Using custom weights" : "Using predefined weights (30/40/20/10)"}
                            </p>
                        </div>
                        <Switch
                            id="custom-mode"
                            checked={formula.useCustom}
                            onCheckedChange={handleToggleCustom}
                        />
                    </div>

                    {/* Weight Inputs */}
                    <div className="space-y-4">
                        {/* Keywords */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <Label className="text-sm font-medium">Keywords Matching</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={formula.weights.keywords}
                                    onChange={(e) => handleWeightChange('keywords', Number(e.target.value))}
                                    disabled={!formula.useCustom}
                                    className="w-20 h-9 text-center"
                                />
                                <span className="text-sm font-semibold text-primary w-6">%</span>
                            </div>
                        </div>

                        {/* Semantic */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <Label className="text-sm font-medium">Semantic Analysis</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={formula.weights.semantic}
                                    onChange={(e) => handleWeightChange('semantic', Number(e.target.value))}
                                    disabled={!formula.useCustom}
                                    className="w-20 h-9 text-center"
                                />
                                <span className="text-sm font-semibold text-accent w-6">%</span>
                            </div>
                        </div>

                        {/* Diagram */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <Label className="text-sm font-medium">Diagram Detection</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={formula.weights.diagram}
                                    onChange={(e) => handleWeightChange('diagram', Number(e.target.value))}
                                    disabled={!formula.useCustom}
                                    className="w-20 h-9 text-center"
                                />
                                <span className="text-sm font-semibold w-6" style={{ color: 'hsl(142, 76%, 36%)' }}>%</span>
                            </div>
                        </div>

                        {/* Grammar */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                            <Label className="text-sm font-medium">Grammar & Clarity</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={formula.weights.grammar}
                                    onChange={(e) => handleWeightChange('grammar', Number(e.target.value))}
                                    disabled={!formula.useCustom}
                                    className="w-20 h-9 text-center"
                                />
                                <span className="text-sm font-semibold w-6" style={{ color: 'hsl(25, 95%, 53%)' }}>%</span>
                            </div>
                        </div>
                    </div>

                    {/* Total Display */}
                    <motion.div
                        animate={{
                            borderColor: isValid ? "hsl(var(--border))" : "hsl(var(--destructive))",
                        }}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${isValid ? "bg-primary/5" : "bg-destructive/5"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Total Weight:</span>
                            {!isValid && formula.useCustom && (
                                <AlertCircle className="w-4 h-4 text-destructive" />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${isValid ? "text-primary" : "text-destructive"
                                }`}>
                                {total.toFixed(0)}%
                            </span>
                            {isValid ? (
                                <span className="text-sm text-muted-foreground">✓ Valid</span>
                            ) : (
                                <span className="text-sm text-destructive">Must equal 100%</span>
                            )}
                        </div>
                    </motion.div>

                    {/* Reset Button */}
                    {formula.useCustom && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleReset}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset to Default Formula
                        </Button>
                    )}

                    {/* Info */}
                    <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                        <p className="font-medium mb-1">Default Formula:</p>
                        <ul className="space-y-0.5 ml-4">
                            <li>• Keywords: 30%</li>
                            <li>• Semantic: 40%</li>
                            <li>• Diagram: 20%</li>
                            <li>• Grammar: 10%</li>
                        </ul>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
