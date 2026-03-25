import { Goal } from './types';
import { DollarSign, Youtube, Briefcase, Settings, PenTool } from 'lucide-react';

export const GOALS: Goal[] = [
  {
    id: 'make-money',
    title: 'Make Money Online',
    description: 'Discover tools to build income streams, from e-commerce to freelancing.',
    icon: DollarSign,
    workflowSteps: ['Identify Niche', 'Build Platform', 'Automate Sales', 'Scale Growth']
  },
  {
    id: 'youtube-videos',
    title: 'Create YouTube Videos',
    description: 'Master the art of video creation with AI-powered scripting, editing, and SEO.',
    icon: Youtube,
    workflowSteps: ['Script Generation', 'Video Editing', 'Voiceover', 'Thumbnail & SEO']
  },
  {
    id: 'get-job',
    title: 'Get a Job',
    description: 'Land your dream role with AI resume builders, interview prep, and job matching.',
    icon: Briefcase,
    workflowSteps: ['Resume Optimization', 'Portfolio Building', 'Interview Prep', 'Job Search']
  },
  {
    id: 'automate-business',
    title: 'Automate Business',
    description: 'Streamline your operations and save hours every week with AI automation.',
    icon: Settings,
    workflowSteps: ['Process Audit', 'Tool Integration', 'Workflow Setup', 'Monitoring']
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    description: 'Build a massive following with AI-powered social media and blog content.',
    icon: PenTool,
    workflowSteps: ['Ideation', 'Drafting', 'Visuals', 'Distribution']
  }
];
