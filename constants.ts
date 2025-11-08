import type { AnalysisOption, OutputFormatOption } from './types';

export const ANALYSIS_OPTIONS: AnalysisOption[] = [
  { id: 'ssl', label: 'HTTPS / SSL', description: 'Checks for valid certificate and secure connection settings.' },
  { id: 'headers', label: 'Security Headers', description: 'Analyzes HSTS, CSP, X-Frame-Options, etc.' },
  { id: 'cookies', label: 'Cookie Security', description: 'Assesses Secure, HttpOnly, and SameSite attributes.' },
  { id: 'cms', label: 'CMS Detection', description: 'Identifies content management systems like WordPress and checks for common indicators.' },
  { id: 'tech_stack', label: 'Technology Fingerprint', description: 'Identifies server types, frameworks, and libraries from headers.' }
];

export const DEEP_ANALYSIS_OPTIONS: AnalysisOption[] = [
    ...ANALYSIS_OPTIONS,
    { id: 'ports', label: 'Open Ports & Services', description: 'Passively infers common service ports from headers and known patterns.' },
    { id: 'http_security', label: 'HTTP Security', description: 'Checks for insecure form actions, mixed content, and unsafe redirects.' },
    { id: 'dependency_vulns', label: 'Outdated Dependencies', description: 'Identifies known vulnerabilities in frontend libraries from source.' },
    { id: 'config_audit', label: 'Configuration Audit', description: 'Analyzes server configuration and best practices from response headers.' },
    { id: 'seo_health', label: 'SEO & Health', description: 'Checks for presence and configuration of sitemap.xml and robots.txt.' }
];


export const OUTPUT_FORMAT_OPTIONS: OutputFormatOption[] = [
  { id: 'markdown', label: 'Markdown Report' },
  { id: 'json', label: 'JSON Object' },
  { id: 'bullet_list', label: 'Bulleted List' },
  { id: 'plain_text', label: 'Plain Text' },
  { id: 'html', label: 'HTML Snippet' },
  { id: 'csv', label: 'CSV' }
];