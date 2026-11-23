export type ChatThinkingMessage = {
  title: string;
  detail: string;
};

export const CHAT_THINKING_MESSAGES: ChatThinkingMessage[] = [
  {
    title:
      "Reviewing the question and relevant HR policies to prepare an accurate, helpful response",
    detail:
      "Parsing the intent behind your query to identify which HR policy areas it touches — leave, benefits, conduct, or compensation. Comparing the phrasing against similar past questions to understand context, tone, and the level of detail expected. Checking whether the question relates to a specific employee scenario or a general policy clarification, since that changes how the answer should be framed. Preparing to pull in the most relevant sections of the employee handbook before drafting a response.",
  },
  {
    title:
      "Cross-checking company guidelines and employee handbook for relevant details",
    detail:
      "Scanning the latest version of the employee handbook for clauses that directly apply to this topic. Verifying whether any recent policy updates or amendments override older guidance, since HR documents are revised periodically. Checking department-specific addendums that might add exceptions or additional steps beyond the general company-wide policy. Making sure the guidance referenced is the most current approved version, not an outdated draft.",
  },
  {
    title: "Analyzing your request to ensure the response is accurate and up to date",
    detail:
      "Breaking the question down into smaller parts to make sure every aspect gets addressed, not just the most obvious one. Cross-referencing dates, eligibility criteria, and thresholds mentioned in the relevant policy to confirm they still apply under current rules. Checking for regional or role-based variations, since some policies differ by location or employment type. Validating that the interpretation being formed matches how HR has answered similar questions before.",
  },
  {
    title: "Fetching the most relevant information from internal HR documents",
    detail:
      "Searching through internal HR documentation, circulars, and policy PDFs for passages that match the topic of your question. Ranking the retrieved sections by relevance so the most applicable information is prioritized over tangential mentions. Filtering out outdated or superseded documents to avoid referencing guidance that's no longer in effect. Consolidating the relevant excerpts into a coherent set of facts to build the response from.",
  },
  {
    title: "Finalizing the response based on the latest available policies",
    detail:
      "Structuring the gathered information into a clear, easy-to-follow answer that directly addresses what was asked. Double-checking figures, timelines, and policy references one final time for accuracy before presenting them. Adjusting tone to stay professional yet approachable, consistent with how HR communicates with employees. Preparing the response for delivery, along with any relevant next steps or contacts if further action is needed.",
  },
];
