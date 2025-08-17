'use client';
import { useEffect, useState } from 'react';
import type { CronOptions, CronPreset } from '@/lib/tools/tool/cron-expression';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Copy, 
  Info, 
  Play, 
  Clock, 
  Calendar, 
  Zap, 
  AlertCircle, 
  CheckCircle2,
  BookOpen,
  Settings,
  Lightbulb,
  Code
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import cronExpressionBuilder from '@/lib/tools/tool/cron-expression';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';

const tool = cronExpressionBuilder;

export default function CronExpressionBuilderPage() {
  const [options, setOptions] = useState<CronOptions>({
    minute: '0',
    hour: '0',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  });

  const [customExpression, setCustomExpression] = useState('');
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedPreset, setSelectedPreset] = useState<CronPreset | null>(null);
  const [validationResult, setValidationResult] = useState<{isValid: boolean; error?: string} | null>(null);
  const [humanReadable, setHumanReadable] = useState('');
  const [nextRuns, setNextRuns] = useState<Date[]>([]);

  // Generate expression from current options
  const currentExpression = tool.generate(options);

  // Update validation and human readable when expression changes
  useEffect(() => {
    const expression = activeTab === 'builder' ? currentExpression : customExpression;
    if (expression) {
      const validation = tool.validate(expression);
      setValidationResult(validation);
      
      if (validation.isValid) {
        setHumanReadable(tool.getHumanReadable(expression));
        setNextRuns(tool.getNextRuns(expression, 5));
      } else {
        setHumanReadable('');
        setNextRuns([]);
      }
    }
  }, [currentExpression, customExpression, activeTab]);

  const handleCopy = () => {
    const expression = activeTab === 'builder' ? currentExpression : customExpression;
    navigator.clipboard.writeText(expression);
    toast.success('Cron expression copied to clipboard!');
  };

  const handlePresetSelect = (preset: CronPreset) => {
    setSelectedPreset(preset);
    setCustomExpression(preset.expression);
    setActiveTab('manual');
    
    // Try to parse and populate builder fields
    const parsed = tool.parse(preset.expression);
    if (parsed) {
      setOptions(parsed);
    }
  };

  const handleFieldChange = (field: keyof CronOptions, value: string) => {
    setOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fieldInfo = tool.getFieldInfo();
  const presets = tool.getPresets();
  const presetCategories = ['common', 'development', 'maintenance', 'backup'] as const;

  return (
    <TooltipProvider>
      <div className="flex flex-col justify-center p-2 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 justify-between">
          <div className='flex justify-between gap-4 flex-wrap'>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {/* <Clock className="w-6 h-6" /> */}
                {tool.name}
              </h1>
            </div>
            <div className=''>
              <LearnButton 
                tool={{
                  name: tool.name,
                  description: tool.description,
                  slug: tool.slug,
                  category: tool.category,
                  tags: tool.tags
                }}
                variant="secondary"
                mdFilePath="content/learn/cron-expression-generator.md"
              />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">{tool.description}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Builder */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="builder" className="flex items-center gap-2">
                  {/* <Settings className="w-4 h-4" /> */}
                  Builder
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  {/* <BookOpen className="w-4 h-4" /> */}
                  Manual
                </TabsTrigger>
                <TabsTrigger value="presets" className="flex items-center gap-2">
                  {/* <Zap className="w-4 h-4" /> */}
                  Presets
                </TabsTrigger>
              </TabsList>

              {/* Visual Builder Tab */}
              <TabsContent value="builder" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Visual Cron Builder
                    </CardTitle>
                    <CardDescription>
                      Configure each field using the inputs below
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fieldInfo.map((field, index) => (
                      <div key={field.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">{field.name}</Label>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Info className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{field.name} Field Guide</DialogTitle>
                                <DialogDescription>{field.description}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Range: {field.range}</h4>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Special Values:</h4>
                                  <div className="space-y-1">
                                    {field.specialValues.map((special, i) => (
                                      <div key={i} className="flex justify-between text-sm">
                                        <code className="px-2 py-1 bg-muted rounded">{special.value}</code>
                                        <span className="text-muted-foreground">{special.description}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Examples:</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {field.examples.map((example, i) => (
                                      <Badge key={i} variant="secondary">{example}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Input
                          value={options[Object.keys(options)[index] as keyof CronOptions]}
                          onChange={(e) => handleFieldChange(Object.keys(options)[index] as keyof CronOptions, e.target.value)}
                          placeholder={`e.g., ${field.examples[0]}`}
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Manual Input Tab */}
              <TabsContent value="manual" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Manual Expression Input
                    </CardTitle>
                    <CardDescription>
                      Enter a complete cron expression directly
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="custom-expression">Cron Expression</Label>
                        <Input
                          id="custom-expression"
                          value={customExpression}
                          onChange={(e) => setCustomExpression(e.target.value)}
                          placeholder="0 0 * * *"
                          className="font-mono text-lg"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Format: minute hour day-of-month month day-of-week
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Presets Tab */}
              <TabsContent value="presets" className="space-y-4">
                {presetCategories.map(category => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="capitalize flex items-center gap-2">
                        {category === 'common' && <Clock className="w-5 h-5" />}
                        {category === 'development' && <Zap className="w-5 h-5" />}
                        {category === 'maintenance' && <Settings className="w-5 h-5" />}
                        {category === 'backup' && <Calendar className="w-5 h-5" />}
                        {category} Schedules
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {presets.filter(preset => preset.category === category).map((preset, index) => (
                          <div
                            key={index}
                            className="flex justify-between flex-col md:flex-row p-3 gap-2 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => handlePresetSelect(preset)}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{preset.name}</div>
                              <div className="text-sm text-muted-foreground">{preset.description}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="px-2 py-1 bg-muted rounded text-sm">{preset.expression}</code>
                              <Button variant="ghost" size="sm">
                                <Play className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Output & Validation */}
          <div className="space-y-6">
            {/* Current Expression */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-indigo gap-2">
                  <Code className="w-5 h-5" />
                  Generated Expression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg font-mono text-sm">
                    <span className="break-all">
                      {activeTab === 'builder' ? currentExpression : customExpression || 'Enter expression...'}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy Expression</TooltipContent>
                    </Tooltip>
                  </div>
                  
                  {/* Validation Status */}
                  {validationResult && (
                    <Alert variant={validationResult.isValid ? "success" : "destructive"}>
                      {validationResult.isValid ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {validationResult.isValid ? 'Valid Expression' : 'Invalid Expression'}
                      </AlertTitle>
                      <AlertDescription>
                        {validationResult.isValid 
                          ? 'Your cron expression is syntactically correct' 
                          : validationResult.error
                        }
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Human Readable Description */}
            {humanReadable && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-teal gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Human Readable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{humanReadable}</p>
                </CardContent>
              </Card>
            )}

            {/* Next Run Times */}
            {/* {nextRuns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-coral gap-2">
                    <Calendar className="w-5 h-5" />
                    Next Run Times
                  </CardTitle>
                  <CardDescription>
                    Upcoming execution times (simulated)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {nextRuns.map((date, index) => (
                        <div key={index} className="flex justify-between text-sm p-2 rounded border">
                          <span>Run #{index + 1}</span>
                          <span className="font-mono text-muted-foreground">
                            {date.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )} */}

            {/* Quick Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-violet gap-2">
                  <Info className="w-5 h-5" />
                  Quick Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium mb-1">Common Patterns:</div>
                    <div className="space-y-1 text-muted-foreground">
                      <div><code>*</code> - Every value</div>
                      <div><code>*/5</code> - Every 5 units</div>
                      <div><code>1,3,5</code> - Specific values</div>
                      <div><code>1-5</code> - Range of values</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium mb-1">Field Order:</div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>1. Minute (0-59)</div>
                      <div>2. Hour (0-23)</div>
                      <div>3. Day of Month (1-31)</div>
                      <div>4. Month (1-12)</div>
                      <div>5. Day of Week (0-7)</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-1">Tips:</div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>• Use presets for common schedules</div>
                      <div>• Test expressions before deployment</div>
                      <div>• Consider timezone differences</div>
                      <div>• Document complex expressions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Field Format Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-pink gap-2">
                  <BookOpen className="w-5 h-5" />
                  Field Format Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-4 text-xs">
                    {fieldInfo.map((field, index) => (
                      <div key={field.name} className="space-y-2">
                        <div className="font-medium">{field.name}</div>
                        <div className="text-muted-foreground">Range: {field.range}</div>
                        <div className="flex flex-wrap gap-1">
                          {field.examples.map((example, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                        {index < fieldInfo.length - 1 && <hr className="my-2" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Advanced Features */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cron Expression Analyzer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Expression Analyzer
              </CardTitle>
              <CardDescription>
                Analyze any cron expression to understand its behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Paste any cron expression to analyze..."
                  className="font-mono"
                  onBlur={(e) => {
                    if (e.target.value) {
                      setCustomExpression(e.target.value);
                      setActiveTab('manual');
                    }
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  Enter a cron expression above to see detailed analysis, validation, and next run times.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Avoid overlapping jobs</div>
                    <div className="text-muted-foreground text-xs">
                      Ensure previous runs complete before next execution
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Use specific times</div>
                    <div className="text-muted-foreground text-xs">
                      Avoid running jobs exactly on the hour when possible
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Consider system load</div>
                    <div className="text-muted-foreground text-xs">
                      Schedule heavy tasks during low-usage periods
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Log and monitor</div>
                    <div className="text-muted-foreground text-xs">
                      Always implement proper logging for debugging
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}