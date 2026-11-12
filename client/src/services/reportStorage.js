export const reportStoragePrefix = 'arena-research-report:'

export function getReportStorageKey(subject) {
  return `${reportStoragePrefix}${encodeURIComponent(subject.trim().toLowerCase())}`
}

function getLegacyReportStorageKey(subject) {
  return `${reportStoragePrefix}${subject.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

export function loadSavedReport(subject) {
  try {
    const saved = window.localStorage.getItem(getReportStorageKey(subject)) || window.localStorage.getItem(getLegacyReportStorageKey(subject))
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function saveResearchContext(research) {
  try {
    window.localStorage.setItem('arena-research-latest', JSON.stringify(research))
  } catch {
    // Local storage may be unavailable in private browsing or restricted environments.
  }
}

export function loadLatestResearch() {
  try {
    const saved = window.localStorage.getItem('arena-research-latest')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}