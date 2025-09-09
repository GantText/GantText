export type ISODateString = string;

export type DurationUnit = 'd' | 'h';

export type Task = {
  id: string;
  status: 'open' | 'done';
  title: string;
  duration: { value: number; unit: DurationUnit };
  explicitStart?: ISODateString;
  assignee?: { name: string; email: string };
  description: string[];
  children: Task[];
  start?: Date;
  end?: Date;
  lineNumber?: number;
};

export type Project = {
  tasks: Task[];
  startDate?: Date;
  endDate?: Date;
};

