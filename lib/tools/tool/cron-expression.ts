export interface CronOptions {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface CronPreset {
  name: string;
  expression: string;
  description: string;
  category: 'common' | 'development' | 'maintenance' | 'backup';
}

export interface CronField {
  name: string;
  description: string;
  range: string;
  specialValues: Array<{ value: string; description: string }>;
  examples: string[];
}

export interface CronExpressionBuilder {
  name: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  generate: (options: CronOptions) => string;
  parse: (expression: string) => CronOptions | null;
  validate: (expression: string) => { isValid: boolean; error?: string };
  getNextRuns: (expression: string, count?: number) => Date[];
  getHumanReadable: (expression: string) => string;
  getPresets: () => CronPreset[];
  getFieldInfo: () => CronField[];
}

// Cron field definitions
const cronFields: CronField[] = [
  {
    name: 'Minute',
    description: 'Minute field (0-59)',
    range: '0-59',
    specialValues: [
      { value: '*', description: 'Every minute' },
      { value: '*/5', description: 'Every 5 minutes' },
      { value: '0,15,30,45', description: 'At 0, 15, 30, 45 minutes' },
      { value: '10-20', description: 'Minutes 10 through 20' }
    ],
    examples: ['0', '*/15', '30', '0,30']
  },
  {
    name: 'Hour',
    description: 'Hour field (0-23)',
    range: '0-23',
    specialValues: [
      { value: '*', description: 'Every hour' },
      { value: '*/2', description: 'Every 2 hours' },
      { value: '9-17', description: 'Business hours (9 AM to 5 PM)' },
      { value: '0,12', description: 'Midnight and noon' }
    ],
    examples: ['0', '12', '*/6', '9-17']
  },
  {
    name: 'Day of Month',
    description: 'Day of the month (1-31)',
    range: '1-31',
    specialValues: [
      { value: '*', description: 'Every day' },
      { value: '1', description: 'First day of month' },
      { value: '*/2', description: 'Every 2nd day' },
      { value: '1,15', description: '1st and 15th of month' }
    ],
    examples: ['*', '1', '15', '*/7']
  },
  {
    name: 'Month',
    description: 'Month field (1-12 or JAN-DEC)',
    range: '1-12',
    specialValues: [
      { value: '*', description: 'Every month' },
      { value: '1,7', description: 'January and July' },
      { value: '*/3', description: 'Every 3 months' },
      { value: '3-5', description: 'March through May' }
    ],
    examples: ['*', '1', '*/6', 'JAN,APR,JUL,OCT']
  },
  {
    name: 'Day of Week',
    description: 'Day of the week (0-7 or SUN-SAT, 0 and 7 are Sunday)',
    range: '0-7',
    specialValues: [
      { value: '*', description: 'Every day' },
      { value: '1-5', description: 'Weekdays (Mon-Fri)' },
      { value: '0,6', description: 'Weekends (Sun,Sat)' },
      { value: '1', description: 'Mondays only' }
    ],
    examples: ['*', '1-5', '0', 'MON,WED,FRI']
  }
];

// Common cron presets
const cronPresets: CronPreset[] = [
  // Common
  { name: 'Every minute', expression: '* * * * *', description: 'Runs every minute', category: 'common' },
  { name: 'Every 5 minutes', expression: '*/5 * * * *', description: 'Runs every 5 minutes', category: 'common' },
  { name: 'Every hour', expression: '0 * * * *', description: 'Runs at the top of every hour', category: 'common' },
  { name: 'Daily at midnight', expression: '0 0 * * *', description: 'Runs once a day at midnight', category: 'common' },
  { name: 'Weekly on Sunday', expression: '0 0 * * 0', description: 'Runs every Sunday at midnight', category: 'common' },
  { name: 'Monthly on 1st', expression: '0 0 1 * *', description: 'Runs on the 1st of every month at midnight', category: 'common' },
  
  // Development
  { name: 'Every 30 seconds', expression: '*/30 * * * * *', description: 'For testing and development', category: 'development' },
  { name: 'Weekdays at 9 AM', expression: '0 9 * * 1-5', description: 'Business hours start', category: 'development' },
  { name: 'Every 15 minutes during work hours', expression: '*/15 9-17 * * 1-5', description: 'Frequent checks during work time', category: 'development' },
  
  // Maintenance
  { name: 'Daily at 2 AM', expression: '0 2 * * *', description: 'Ideal for maintenance tasks', category: 'maintenance' },
  { name: 'Weekly maintenance', expression: '0 3 * * 6', description: 'Saturday 3 AM maintenance window', category: 'maintenance' },
  { name: 'Monthly cleanup', expression: '0 1 1 * *', description: 'First day of month cleanup', category: 'maintenance' },
  
  // Backup
  { name: 'Hourly backup', expression: '0 * * * *', description: 'Backup every hour', category: 'backup' },
  { name: 'Daily backup', expression: '0 4 * * *', description: 'Daily backup at 4 AM', category: 'backup' },
  { name: 'Weekly full backup', expression: '0 2 * * 0', description: 'Full backup every Sunday at 2 AM', category: 'backup' }
];

// Validation function
function validateCronExpression(expression: string): { isValid: boolean; error?: string } {
  const parts = expression.trim().split(/\s+/);
  
  if (parts.length !== 5 && parts.length !== 6) {
    return { isValid: false, error: 'Cron expression must have 5 or 6 fields' };
  }

  const fields = parts.length === 6 ? parts : parts; // Handle both 5 and 6 field formats
  const ranges = [
    { min: 0, max: 59, name: 'second' },  // seconds (optional)
    { min: 0, max: 59, name: 'minute' },
    { min: 0, max: 23, name: 'hour' },
    { min: 1, max: 31, name: 'day' },
    { min: 1, max: 12, name: 'month' },
    { min: 0, max: 7, name: 'day of week' }
  ];

  const fieldsToCheck = parts.length === 6 ? fields : fields;
  const rangesToCheck = parts.length === 6 ? ranges : ranges.slice(1);

  for (let i = 0; i < fieldsToCheck.length; i++) {
    const field = fieldsToCheck[i];
    const range = rangesToCheck[i];

    if (field === '*') continue;
    
    // Handle step values (*/n)
    if (field.includes('*/')) {
      const step = field.split('*/')[1];
      if (isNaN(Number(step)) || Number(step) <= 0) {
        return { isValid: false, error: `Invalid step value in ${range.name} field` };
      }
      continue;
    }

    // Handle ranges (n-m)
    if (field.includes('-')) {
      const [start, end] = field.split('-').map(Number);
      if (isNaN(start) || isNaN(end) || start > end) {
        return { isValid: false, error: `Invalid range in ${range.name} field` };
      }
      if (start < range.min || end > range.max) {
        return { isValid: false, error: `Range out of bounds in ${range.name} field` };
      }
      continue;
    }

    // Handle lists (n,m,o)
    if (field.includes(',')) {
      const values = field.split(',').map(Number);
      for (const value of values) {
        if (isNaN(value) || value < range.min || value > range.max) {
          return { isValid: false, error: `Invalid value in ${range.name} field` };
        }
      }
      continue;
    }

    // Handle single values
    const value = Number(field);
    if (isNaN(value) || value < range.min || value > range.max) {
      // Check for named values (JAN, MON, etc.)
      const namedValues = {
        'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
        'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12,
        'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6
      };
      
      if (!namedValues[field.toUpperCase()]) {
        return { isValid: false, error: `Invalid value in ${range.name} field` };
      }
    }
  }

  return { isValid: true };
}

// Parse cron expression
function parseCronExpression(expression: string): CronOptions | null {
  const validation = validateCronExpression(expression);
  if (!validation.isValid) return null;

  const parts = expression.trim().split(/\s+/);
  
  if (parts.length === 5) {
    return {
      minute: parts[0],
      hour: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4]
    };
  }
  
  return null;
}

// Generate human-readable description
function getHumanReadableDescription(expression: string): string {
  const validation = validateCronExpression(expression);
  if (!validation.isValid) return 'Invalid cron expression';

  const parts = expression.trim().split(/\s+/);
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  let description = 'Runs ';

  // Frequency determination
  if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return 'Runs every minute';
  }

  if (minute !== '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    if (minute.startsWith('*/')) {
      return `Runs every ${minute.slice(2)} minutes`;
    }
    return `Runs at minute ${minute} of every hour`;
  }

  if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `Runs daily at ${formatTime(hour, minute)}`;
  }

  if (dayOfWeek !== '*' && dayOfMonth === '*') {
    const days = formatDayOfWeek(dayOfWeek);
    return `Runs ${days} at ${formatTime(hour, minute)}`;
  }

  if (dayOfMonth !== '*' && dayOfWeek === '*') {
    const day = formatDayOfMonth(dayOfMonth);
    return `Runs ${day} at ${formatTime(hour, minute)}`;
  }

  return `Custom schedule: ${expression}`;
}

function formatTime(hour: string, minute: string): string {
  if (hour === '*') return 'every hour';
  if (minute === '*') return `every minute of hour ${hour}`;
  
  const h = parseInt(hour);
  const m = parseInt(minute);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  
  return `${displayHour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatDayOfWeek(dayOfWeek: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayMap: { [key: string]: string } = {
    'SUN': 'Sunday', 'MON': 'Monday', 'TUE': 'Tuesday', 'WED': 'Wednesday',
    'THU': 'Thursday', 'FRI': 'Friday', 'SAT': 'Saturday'
  };

  if (dayOfWeek === '1-5') return 'weekdays (Mon-Fri)';
  if (dayOfWeek === '0,6' || dayOfWeek === '6,0') return 'weekends';
  if (dayOfWeek.includes(',')) {
    return dayOfWeek.split(',').map(d => days[parseInt(d)] || dayMap[d] || d).join(', ');
  }
  if (dayOfWeek.includes('-')) {
    const [start, end] = dayOfWeek.split('-');
    return `${days[parseInt(start)]}-${days[parseInt(end)]}`;
  }
  
  return days[parseInt(dayOfWeek)] || dayMap[dayOfWeek] || `day ${dayOfWeek}`;
}

function formatDayOfMonth(dayOfMonth: string): string {
  if (dayOfMonth === '1') return 'on the 1st of every month';
  if (dayOfMonth === '*/7') return 'every 7th day';
  if (dayOfMonth.includes(',')) return `on days ${dayOfMonth} of every month`;
  return `on day ${dayOfMonth} of every month`;
}

// Get next run times (simplified simulation)
function getNextRuns(expression: string, count: number = 5): Date[] {
  const validation = validateCronExpression(expression);
  if (!validation.isValid) return [];

  const runs: Date[] = [];
  const now = new Date();
  let current = new Date(now);
  
  // Simplified next run calculation (for demo purposes)
  // In a real implementation, you'd use a proper cron parser library
  for (let i = 0; i < count; i++) {
    current = new Date(current.getTime() + (i + 1) * 60000); // Add minutes for demo
    runs.push(new Date(current));
  }

  return runs;
}

// Main cron expression builder object
const cronExpressionBuilder: CronExpressionBuilder = {
    name: "Cron Expression Generator",
    slug: "cron-expression-generator",
    description: "Advanced cron expression builder with visual editor and next run times",
    category: "Generator",
    tags: ["cron", "scheduler", "automation", "devops"],

  generate: (options: CronOptions): string => {
    return `${options.minute} ${options.hour} ${options.dayOfMonth} ${options.month} ${options.dayOfWeek}`;
  },

  parse: parseCronExpression,
  validate: validateCronExpression,
  getNextRuns,
  getHumanReadable: getHumanReadableDescription,
  getPresets: () => cronPresets,
  getFieldInfo: () => cronFields
};

export default cronExpressionBuilder;