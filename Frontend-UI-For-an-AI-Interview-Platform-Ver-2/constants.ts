import { Screen, FeedbackItem, TranscriptItem, SkillProgress, InterviewHistoryItem, ScheduleEvent } from './types';

export const EXTRACTED_SKILLS: string[] = [
    'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Agile', 'CI/CD'
];

export const GLOWS_DATA: FeedbackItem[] = [
    {
        title: "Strong Technical Depth",
        description: "You provided detailed and accurate explanations of complex technical topics.",
        score: 95,
        reviewId: 0,
    },
    {
        title: "Clear Project Explanations",
        description: "You effectively articulated the goals and outcomes of your past projects.",
        score: 92,
        reviewId: 1,
    }
];

export const GROWS_DATA: FeedbackItem[] = [
    {
        title: "STAR Method Application",
        description: "Try to structure behavioral answers using the Situation, Task, Action, Result framework for more impact.",
        score: 78,
        reviewId: 2,
    }
];

export const ANSWER_TRANSCRIPTS: { [key: number]: TranscriptItem } = {
    0: { transcript: "In my last project, we used a microservices architecture with Kubernetes for orchestration to handle high traffic loads...", timestamp: "01:12" },
    1: { transcript: "The main goal was to reduce latency by 30%, which we achieved by implementing a Redis caching layer...", timestamp: "02:45" },
    2: { transcript: "When I had a conflict with a teammate, I scheduled a one-on-one to understand their perspective...", timestamp: "04:31" },
};

export const WIZARD_STEPS = [
    {
      id: 'persona',
      title: 'Choose Your Interviewer',
      content: `
        <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
          <div data-persona="A" class="persona-option text-center cursor-pointer">
            <img src="https://picsum.photos/seed/ava/100" class="rounded-full mx-auto mb-2 border-4 border-purple-500 transition-all">
            <h4 class="font-semibold">Ava</h4>
          </div>
          <div data-persona="B" class="persona-option text-center cursor-pointer opacity-60">
            <img src="https://picsum.photos/seed/kai/100" class="rounded-full mx-auto mb-2 border-4 border-transparent transition-all">
            <h4 class="font-semibold">Kai</h4>
          </div>
        </div>
        <div class="h-12 mt-4 text-sm text-slate-700 dark:text-slate-400">
          <p data-desc="A" class="persona-description">Ava provides a structured, competency-based interview.</p>
          <p data-desc="B" class="persona-description hidden">Kai offers a more conversational and adaptive interview.</p>
        </div>
      `,
      buttonText: 'Next',
    },
    {
      id: 'checks',
      title: 'Technical Checks',
      content: `<div class="space-y-4 text-left"><div class="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg><p>Microphone Detected</p></div><div class="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg><p>Camera Online</p></div></div>`,
      buttonText: "I'm Ready",
      isFinal: true
    },
];

export const INTERVIEW_FLOW = [
  { question: "Tell me about a time you faced a difficult technical challenge and how you overcame it.", followUp: false },
  { question: "That's a great example. Could you elaborate on how you collaborated with your team during that challenge?", followUp: true },
  { question: "Thank you for sharing that. What was the final outcome of the project?", followUp: true }
];

export const STAR_METHOD_DRILL = [
  { question: "Tell me about a time you had to deal with a difficult stakeholder.", followUp: false },
  { question: "Describe a situation where you had to work under a tight deadline.", followUp: false },
  { question: "Give an example of a time you made a mistake at work and how you handled it.", followUp: false },
];

export const CLARITY_DRILL = [
    { question: "Explain a complex technical concept to a non-technical audience.", followUp: false },
    { question: "In 90 seconds, describe the architecture of your most recent project.", followUp: false },
    { question: "Summarize the main goal of your previous role.", followUp: false },
];

export const DRILL_QUESTIONS: { [key: string]: { question: string, followUp: boolean }[] } = {
    'STAR Method': STAR_METHOD_DRILL,
    'Clarity': CLARITY_DRILL,
};


export const SAMPLE_ANSWERS = [
    "Sure. In my previous role, we were tasked with migrating a monolithic legacy system to a microservices architecture. The biggest challenge was ensuring zero downtime during the transition. I took the lead on designing a strangler fig pattern, gradually routing traffic to the new services while the old system was still running. It was complex, involving careful planning and a lot of coordination, but it resulted in a seamless migration.",
    "Collaboration was key. I initiated daily sync-ups with the backend, frontend, and DevOps teams. We used a shared Kanban board to track dependencies and progress. I also created detailed documentation for the new service APIs, which helped the frontend team integrate much faster. Open communication was crucial, and by addressing issues proactively, we avoided any major blockers.",
    "The final outcome was a huge success. We fully decommissioned the old monolith ahead of schedule. The new microservices architecture improved our deployment frequency by 5x, reduced system latency by 30%, and made it much easier for new developers to onboard and contribute to the codebase.",
];

export const USER_QUESTIONS_DATA = [
    {
        question: "What are the biggest challenges the team is currently facing?",
        answer: "That's a great question. Right now, our main challenge is scaling our infrastructure to keep up with our rapid user growth. We're also focused on improving our CI/CD pipeline to increase deployment velocity without sacrificing stability."
    },
    {
        question: "Can you describe the company culture in a few words?",
        answer: "I would describe it as collaborative, innovative, and results-oriented. We value open communication and empower our engineers to take ownership of their projects. We work hard, but we also make sure to celebrate our successes."
    },
    {
        question: "What does success look like for this role in the first 90 days?",
        answer: "In the first 90 days, a successful person in this role would have onboarded onto our tech stack, shipped their first small feature to production, and started to build strong collaborative relationships with their teammates."
    }
];


export const SKILL_PROGRESS_DATA: SkillProgress[] = [
    { session: 'Jan', skills: { 'Technical Depth': 75, 'Clarity': 60, 'STAR Method': 55 } },
    { session: 'Feb', skills: { 'Technical Depth': 80, 'Clarity': 70, 'STAR Method': 65 } },
    { session: 'Mar', skills: { 'Technical Depth': 85, 'Clarity': 72, 'STAR Method': 78 } },
    { session: 'Apr', skills: { 'Technical Depth': 92, 'Clarity': 80, 'STAR Method': 85 } },
];

export const KEY_IMPROVEMENT_AREAS = [
    { skill: 'STAR Method', advice: 'Focus on clearly outlining the Situation, Task, Action, and Result in your behavioral answers.' },
    { skill: 'Clarity', advice: 'Try to be more concise in your explanations to improve clarity.' },
];

export const INTERVIEW_HISTORY_DATA: InterviewHistoryItem[] = [
    { id: 1, role: 'Senior Frontend Engineer', date: '2025-04-15', score: 92 },
    { id: 2, role: 'Senior Frontend Engineer', date: '2025-03-12', score: 85 },
    { id: 3, role: 'Product Manager', date: '2025-02-20', score: 81 },
];

const today = new Date();
const getFutureDate = (days: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + days);
    return date.toISOString().split('T')[0];
};

export const SCHEDULED_EVENTS: ScheduleEvent[] = [
    { id: 1, date: getFutureDate(3), time: '10:00 AM', title: 'Senior Frontend Engineer Interview', company: 'Innovate Inc.', integrations: { google: true, outlook: false, notion: true } },
    { id: 2, date: getFutureDate(7), time: '2:30 PM', title: 'Product Manager Interview', company: 'Dream Company Inc.', integrations: { google: true, outlook: true, notion: false } },
];