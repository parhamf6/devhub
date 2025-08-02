'use client';

import { useEffect, useState } from 'react';
import type { TokenOptions } from '@/lib/tools/tool/token-generator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Info, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import tokenGenerator from '@/lib/tools/tool/token-generator';
import { Card, CardContent } from '@/components/ui/card';
import { LearnButton } from '@/features/dashboard/tools/components/learn-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const tool = tokenGenerator

export default function TokenGeneratorPage() {
    const [options, setOptions] = useState<TokenOptions>({
        length: 16,
        useLower: true,
        useUpper: true,
        useNumber: true,
        useSymbol: false,
    });
    const [open, setOpen] = useState(false);
    const [token, setToken] = useState('');

    const generate = () => {
        if (tool?.generate) {
        const result = tool.generate(options);
        setToken(result as string);
        }
    };

    useEffect(() => {
        generate(); // auto-generate on input change
    }, [options]);

    const handleCopy =  () => {
        navigator.clipboard.writeText(token);
        toast.success('Token copied to clipboard!');
    };

    return (
        <div className="flex flex-col justify-center p-6 space-y-6 ">
            <div className="flex flex-col gap-4 justify-between">
                <div className='flex justify-between  gap-4 flex-wrap'>
                    <div>
                        <h1 className="text-2xl font-bold">{tool?.name}</h1>
                    </div>
                    
                    <div className=''>
                        <LearnButton 
                            tool={{
                                name: tool?.name || '',
                                description: tool?.description || '',
                                slug: tool?.slug || 'token-generator',
                                category: tool?.category || 'Secuirty',
                                // icon: tool?.icon,
                                // version: tool?.version,
                                // rating: tool?.rating,
                                tags: tool?.tags
                            }}
                            variant="secondary"
                            mdFilePath="content/learn/token-generator.md"  // ← Manual path
                        />
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground">{tool?.description}</p>
                </div>
            </div>

        <div className='flex flex-col gap-2'>
            <Label className=" mb-2 font-medium">Token Length: {options.length}</Label>
            <Slider
            min={4}
            max={64}
            step={1}
            value={[options.length]}
            onValueChange={([val]) => setOptions((prev) => ({ ...prev, length: val }))}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            {[
            { label: 'Lowercase', key: 'useLower' },
            { label: 'Uppercase', key: 'useUpper' },
            { label: 'Numbers', key: 'useNumber' },
            { label: 'Symbols', key: 'useSymbol' },
            ].map(({ label, key }) => (
            <div key={key} className="flex items-center gap-2">
                <Checkbox
                id={key}
                checked={options[key as keyof TokenOptions]}
                onCheckedChange={(checked) =>
                    setOptions((prev) => ({
                    ...prev,
                    [key]: Boolean(checked),
                    }))
                }
                />
                <Label htmlFor={key}>{label}</Label>
            </div>
            ))}
        </div>

        <Card className="relative w-full overflow-x-scroll   sm:overflow-hidden flex items-center justify-between gap-2 p-4 font-mono text-sm">
            <div className="flex gap-1 shrink-0">
                <Tooltip>
                    <TooltipTrigger asChild >
                        <Button size="icon" variant="ghost" onClick={generate}>
                            <RefreshCcw className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Generate Token</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild >
                        <Button size="icon" variant="ghost" onClick={handleCopy}>
                            <Copy className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Token</TooltipContent>
                </Tooltip>
            </div>
            <span className="break-words text-wrap">{token || 'Please select at least one character type'}</span>
        </Card>
        </div>
    );
}
