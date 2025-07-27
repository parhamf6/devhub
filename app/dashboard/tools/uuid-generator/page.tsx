'use client';

import { useState, useEffect } from 'react';
import uuidGenerator, { UUIDOptions } from '@/lib/tools/tool/uuid-generator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, RefreshCcw } from 'lucide-react';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';

const tool = uuidGenerator;

export default function UUIDGeneratorPage() {
    const [options, setOptions] = useState<UUIDOptions>({
        version: 'v4',
        uppercase: false,
        removeHyphens: false,
        count: 5,
    });

    const [uuids, setUUIDs] = useState<string[]>([]);

    const generate = () => {
        const result = tool.generate(options);
        setUUIDs(result as string[]);
    };

    useEffect(() => {
        generate();
    }, [options]);

    const handleCopyAll = () => {
        if (uuids.length > 0) {
        navigator.clipboard.writeText(uuids.join('\n'));
        toast.success('All UUIDs copied to clipboard!');
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
            mdFilePath="content/learn/uuid-generator.md"
            />
        </div>

      {/* Count Slider */}
        <div className="flex flex-col gap-2">
        <Label className="mb-1 font-medium">How many UUIDs: {options.count}</Label>
        <Slider
            min={1}
            max={100}
            step={1}
            value={[options.count]}
            onValueChange={([val]) => setOptions(prev => ({ ...prev, count: val }))}
        />
        </div>

      {/* Version Selector (only one allowed) */}
        <div className="flex gap-6">
            {['v1', 'v4'].map((ver) => (
            <div key={ver} className="flex items-center gap-2">
                <Checkbox
                id={ver}
                checked={options.version === ver}
                onCheckedChange={() => setOptions(prev => ({ ...prev, version: ver as 'v1' | 'v4' }))}
                />
                <Label htmlFor={ver}>Version {ver.toUpperCase()}</Label>
            </div>
            ))}
        </div>

      {/* Other Options */}
        <div className="flex gap-6">
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
                id="removeHyphens"
                checked={options.removeHyphens}
                onCheckedChange={(checked) =>
                setOptions((prev) => ({ ...prev, removeHyphens: Boolean(checked) }))
                }
            />
            <Label htmlFor="removeHyphens">Remove Hyphens</Label>
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
            Regenerate UUIDs
            </Button>
        </div>

      {/* UUID Output */}
        <div className="flex flex-col gap-2">
            {uuids.length > 0 && (
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
            {uuids.join('\n')}
            </Card>
        </div>
        </div>
    );
}
