export type ChatSuggestion = {
  label: string;
  query: string;
};

export const CHAT_SUGGESTIONS: ChatSuggestion[] = [
  { label: "Leave Policy", query: "What is the leave policy?" },
  { label: "Company News", query: "What are the latest company announcements?" },
  { label: "Apply Leave", query: "How do I apply for annual leave?" },
  { label: "WFH Policy", query: "What is the work from home policy?" },
  { label: "Holiday Calendar 2026", query: "What are the public holidays for 2026?" },
  { label: "Insurance Policy", query: "What is the medical insurance coverage limit?" },
  {
    label: "Network Hospitals",
    query: "Which hospitals are in the insurance network?",
  },
  { label: "Reimbursements", query: "How do I submit a reimbursement request?" },
  {
    label: "Parental Leave",
    query: "What is the maternity and paternity leave policy?",
  },
  { label: "HR Updates", query: "Are there any new HR policy updates?" },
  {
    label: "Attendance Policy",
    query: "What is the attendance and late arrival policy?",
  },
  { label: "Policy Documents", query: "How do I access company policy documents?" },
  { label: "Employee Benefits", query: "What employee benefits am I eligible for?" },
  { label: "Latest Update", query: "What was announced in the latest company update?" },
  { label: "Dress Code", query: "What is the dress code policy?" },
  {
    label: "Dependent Enrollment",
    query: "How do I enroll my dependents in insurance?",
  },
];

export const CHAT_SUGGESTION_DISPLAY_COUNT = 4;
