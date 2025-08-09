// app/tools/ulid-generator/page.tsx
'use client';
import { useState, useEffect } from 'react';
import ulidGenerator, { ULIDOptions } from '@/lib/tools/tool/ulid-generator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Copy, RefreshCcw, Clock, Hash, Calendar as CalendarIcon } from 'lucide-react';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const tool = ulidGenerator;

export default function ULIDGeneratorPage() {
  const [options, setOptions] = useState<ULIDOptions>({
    count: 5,
    uppercase: false,
    time: null,
    entropy: null,
    includeTimestamp: false,
    sortDirection: 'asc',
  });
  
  const [ulids, setULIDs] = useState<string[]>([]);
  const [customEntropy, setCustomEntropy] = useState<string>('');

  const generate = () => {
    const result = tool.generate(options);
    setULIDs(result as string[]);
  };

  useEffect(() => {
    generate();
  }, [options]);

  const handleCopyAll = () => {
    if (ulids.length > 0) {
      navigator.clipboard.writeText(ulids.join('\n'));
      toast.success('All ULIDs copied to clipboard!');
    }
  };

  const handleSetCustomEntropy = () => {
    if (customEntropy) {
      // Validate entropy (should be 16 characters of Crockford's Base32)
      if (/^[0-9A-HJKMNP-TV-Z]{16}$/i.test(customEntropy)) {
        setOptions(prev => ({ ...prev, entropy: customEntropy }));
        toast.success('Custom entropy set!');
      } else {
        toast.error('Entropy must be 16 characters of Crockford\'s Base32');
      }
    } else {
      setOptions(prev => ({ ...prev, entropy: null }));
    }
  };

  return (
    <div className="flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
        <LearnButton
          tool={{
            name: tool.name,
            description: tool.description,
            slug: tool.slug,
            category: tool.category,
            tags: tool.tags,
          }}
          variant="secondary"
          mdFilePath="content/learn/ulid-generator.md"
        />
      </div>

      {/* Grid Layout for Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Count Slider */}
          <div className="flex flex-col gap-2">
            <Label className="mb-1 font-medium">How many ULIDs: {options.count}</Label>
            <Slider
              min={1}
              max={100}
              step={1}
              value={[options.count]}
              onValueChange={([val]) => setOptions(prev => ({ ...prev, count: val }))}
            />
          </div>

          {/* Custom Time Input with Calendar */}
          <div className="flex flex-col gap-2">
            <Label className="font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Custom Time (optional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !options.time && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {options.time ? format(options.time, "PPP HH:mm:ss") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={options.time}
                  onSelect={(date) => setOptions(prev => ({ ...prev, time: date }))}
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setOptions(prev => ({ ...prev, time: null }))}
                    className="w-full"
                  >
                    Clear Date
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {options.time && (
              <p className="text-sm text-muted-foreground">
                Using custom time: {options.time.toLocaleString()}
              </p>
            )}
          </div>

          {/* Sort Direction */}
          <div className="flex flex-col gap-2">
            <Label className="font-medium">Sort Direction</Label>
            <Select 
              value={options.sortDirection} 
              onValueChange={(value) => setOptions(prev => ({ ...prev, sortDirection: value as 'asc' | 'desc' }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending (oldest first)</SelectItem>
                <SelectItem value="desc">Descending (newest first)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Custom Entropy Input */}
          <div className="flex flex-col gap-2">
            <Label className="font-medium flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Custom Entropy (optional)
            </Label>
            <div className="flex gap-2">
              <Input
                value={customEntropy}
                onChange={(e) => setCustomEntropy(e.target.value)}
                placeholder="16 chars of Crockford's Base32"
                maxLength={16}
              />
              <Button onClick={handleSetCustomEntropy} variant="outline">
                {options.entropy ? 'Clear' : 'Set'}
              </Button>
            </div>
            {options.entropy && (
              <p className="text-sm text-muted-foreground">
                Using custom entropy: {options.entropy}
              </p>
            )}
          </div>

          {/* Additional Options */}
          <div className="flex flex-col gap-4">
            <Label className="font-medium">Additional Options</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, uppercase: Boolean(checked) }))
                  }
                />
                <Label htmlFor="uppercase">Uppercase</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeTimestamp"
                  checked={options.includeTimestamp}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, includeTimestamp: Boolean(checked) }))
                  }
                />
                <Label htmlFor="includeTimestamp">Include Timestamp</Label>
              </div>
            </div>
          </div>

          {/* Manual Regenerate Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={generate}
              className="flex gap-2 items-center"
            >
              <RefreshCcw className="w-4 h-4" />
              Regenerate ULIDs
            </Button>
          </div>
        </div>
      </div>

      {/* ULID Output */}
      <div className="flex flex-col gap-2">
        {ulids.length > 0 && (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopyAll}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy All
            </Button>
          </div>
        )}
        <Card className="p-4 font-mono text-sm whitespace-pre-wrap overflow-y-auto max-h-[400px] bg-muted">
          {ulids.join('\n')}
        </Card>
      </div>
    </div>
  );
}