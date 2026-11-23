export const ui = {
  buttonSave: "btn-save",
  buttonSaveDanger: "btn-save-danger",
  buttonPillDark: "btn-pill-dark",
  buttonBrowse: "btn-browse",
  pageShell: "page-shell",
  adminSearchBar: "admin-search-bar",
  statCard: "stat-card",
  statCardBody: "stat-card-body",
  statValue: "stat-value",
  statUnit: "stat-unit",
  heroPillLink: "hero-pill-link",
  chatSearchBar: "chat-search-bar",
  chatSearchBarLoading: "chat-search-bar-loading",
  chatSearchTextareaScroll: "chat-search-textarea-scroll",
} as const;

export type UiClass = keyof typeof ui;
