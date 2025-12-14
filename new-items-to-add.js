// New items to add based on internet research
// Research sources: Industry best practices 2025 from MIT, Wharton, McKinsey, Deloitte, SHRM, etc.

const newItems = [
  // ========================================
  // COO BEGINNER (need 3-5 more items)
  // ========================================
  {
    id: 'sop-documentation-basics-work',
    title: 'Cơ bản về tài liệu hóa SOP',
    description: 'Học cách tạo Standard Operating Procedures (SOP) cho các quy trình chính. SOP giúp đảm bảo consistency, giảm lỗi, và cải thiện onboarding',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Cải Tiến Quy Trình',
    status: 'not-started',
    level: 'beginner',
    role: 'COO',
    hidden: true,
    tags: ['sop', 'documentation', 'process', 'standardization'],
    notes: 'Research từ 2025: SOPs tăng hiệu suất 30% qua reduced waste. Viết về best practices tạo SOP, digital transformation in documentation',
  },
  {
    id: 'process-mapping-basics-work',
    title: 'Ánh xạ quy trình cơ bản',
    description: 'Kỹ năng cơ bản về process mapping: value stream mapping, flowcharts, identifying bottlenecks trong operational workflows',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Cải Tiến Quy Trình',
    status: 'not-started',
    level: 'beginner',
    role: 'COO',
    hidden: true,
    tags: ['process-mapping', 'workflow', 'optimization', 'bottleneck'],
    notes: 'Nền tảng cho continuous improvement. Có thể viết về tools (Lucidchart, Miro), khi nào dùng BPMN vs flowchart',
  },
  {
    id: 'operational-metrics-basics-work',
    title: 'Metrics vận hành cơ bản',
    description: 'Hiểu các operational metrics cơ bản: throughput, cycle time, utilization rate, defect rate, on-time delivery',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Vận Hành Dự Án',
    status: 'not-started',
    level: 'beginner',
    role: 'COO',
    hidden: true,
    tags: ['metrics', 'kpi', 'measurement', 'operations'],
    notes: 'Foundation cho data-driven operations. Viết về cách chọn right metrics, common pitfalls, dashboarding',
  },
  {
    id: 'quality-control-checkpoints-work',
    title: 'Thiết lập quality checkpoints',
    description: 'Thiết lập quality control checkpoints tại các giai đoạn quan trọng của delivery process để ensure standards',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Vận Hành Dự Án',
    status: 'not-started',
    level: 'beginner',
    role: 'COO',
    hidden: true,
    tags: ['quality', 'qa', 'checkpoints', 'standards'],
    notes: 'Cơ bản cho quality assurance. Viết về designing effective checkpoints, avoiding bottlenecks',
  },

  // ========================================
  // CPO ADVANCED (need 3-4 items)
  // ========================================
  {
    id: 'workforce-analytics-implementation-work',
    title: 'Triển khai workforce analytics',
    description: 'Sử dụng people analytics để identify patterns, predict turnover risks, optimize talent allocation. Build data-driven HR decisions',
    category: 'Con Người & Văn Hóa',
    subcategory: 'Quản Lý Hiệu Suất',
    status: 'not-started',
    level: 'advanced',
    role: 'CPO',
    hidden: true,
    tags: ['analytics', 'data-driven', 'predictive', 'workforce'],
    notes: 'Research 2025: Modern CPOs must demonstrate ROI through analytics. Viết về tools, metrics that matter, privacy concerns',
  },
  {
    id: 'succession-planning-program-work',
    title: 'Xây dựng chương trình succession planning',
    description: 'Chuyển từ reactive sang proactive succession planning. Identify và develop future leaders ở tất cả levels, không chỉ executive',
    category: 'Đào Tạo & Phát Triển',
    subcategory: 'Phát Triển Lãnh Đạo',
    status: 'not-started',
    level: 'advanced',
    role: 'CPO',
    hidden: true,
    tags: ['succession', 'leadership', 'talent-pipeline', 'development'],
    notes: 'Trend 2025: Succession planning expanding beyond executives. Viết về identification criteria, development plans, metrics',
  },
  {
    id: 'performance-management-redesign-work',
    title: 'Thiết kế lại hệ thống performance management',
    description: 'Modernize performance reviews: continuous feedback, competency frameworks, behavioral insights, alignment với business goals',
    category: 'Con Người & Văn Hóa',
    subcategory: 'Quản Lý Hiệu Suất',
    status: 'not-started',
    level: 'advanced',
    role: 'CPO',
    hidden: true,
    tags: ['performance', 'feedback', 'competencies', 'modern-hr'],
    notes: 'Move away from annual reviews. Viết về continuous feedback culture, OKRs vs KPIs, calibration sessions',
  },

  // ========================================
  // CPO EXPERT (need 3-4 items)
  // ========================================
  {
    id: 'strategic-workforce-planning-work',
    title: 'Strategic workforce planning (3-5 năm)',
    description: 'Xây dựng strategic workforce plan với horizon 3-5 năm. Skills-based planning, scenario modeling, alignment với business strategy',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Kế Hoạch Hàng Năm & Quý',
    status: 'not-started',
    level: 'expert',
    role: 'CPO',
    hidden: true,
    targetDate: '2026-06-30',
    tags: ['workforce-planning', 'strategy', 'skills-based', 'scenario'],
    notes: 'Research: 40% CHROs cite this as top priority. Viết về framework, ROI (reduced hiring costs, succession pipeline)',
  },
  {
    id: 'organizational-design-transformation-work',
    title: 'Organizational design & restructuring',
    description: 'Lead organizational redesign để adapt với AI, remote work, changing business models. Restructure roles, reporting lines, team topology',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Chuyển Đổi Kinh Doanh',
    status: 'not-started',
    level: 'expert',
    role: 'CPO',
    hidden: true,
    targetDate: '2026-12-31',
    tags: ['org-design', 'restructuring', 'transformation', 'ai-impact'],
    notes: 'AI reshaping work structure. Viết về org design principles, change management, communication strategy',
  },
  {
    id: 'talent-strategy-alignment-work',
    title: 'Talent strategy alignment với business',
    description: 'Develop và execute talent strategy aligned với business objectives. Integrate talent acquisition, development, retention vào business planning',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Kế Hoạch Hàng Năm & Quý',
    status: 'not-started',
    level: 'expert',
    role: 'CPO',
    hidden: true,
    targetDate: '2026-06-30',
    tags: ['talent-strategy', 'alignment', 'business-partner', 'strategic-hr'],
    notes: 'CPO as strategic partner to CEO. Viết về building business case, metrics, board reporting',
  },
  {
    id: 'dei-strategy-leadership-work',
    title: 'Lãnh đạo chiến lược DEI',
    description: 'Lead diversity, equity & inclusion strategy. Embedding DEI vào talent processes, culture initiatives, measuring impact',
    category: 'Văn Hóa & Giao Tiếp Nội Bộ',
    subcategory: 'Văn Hóa Công Ty',
    status: 'not-started',
    level: 'expert',
    role: 'CPO',
    hidden: true,
    tags: ['dei', 'diversity', 'inclusion', 'culture'],
    notes: 'Key CPO responsibility 2025. Viết về measurement, embedding in processes, authentic vs performative DEI',
  },

  // ========================================
  // CFO BEGINNER (need 4-5 items)
  // ========================================
  {
    id: 'pl-statement-basics-work',
    title: 'Hiểu cơ bản về P&L statement',
    description: 'Nắm vững cấu trúc P&L: revenue, COGS, gross margin, operating expenses, EBITDA, net income. Đọc và phân tích P&L reports',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Quản Lý P&L',
    status: 'not-started',
    level: 'beginner',
    role: 'CFO',
    hidden: true,
    tags: ['pl', 'financials', 'fundamentals', 'accounting'],
    notes: 'Foundation cho financial literacy. Viết về common mistakes, how to spot issues, industry benchmarks',
  },
  {
    id: 'budget-vs-actual-tracking-work',
    title: 'Theo dõi budget vs actual',
    description: 'Kỹ năng cơ bản track budget vs actual spending, variance analysis, forecast accuracy. Identify và explain deviations',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Ngân Sách & Kiểm Soát Chi Phí',
    status: 'not-started',
    level: 'beginner',
    role: 'CFO',
    hidden: true,
    tags: ['budget', 'variance', 'tracking', 'forecasting'],
    notes: 'Essential CFO skill. Viết về variance analysis techniques, when to reforecast, communication to stakeholders',
  },
  {
    id: 'pricing-models-fundamentals-work',
    title: 'Cơ bản về pricing models',
    description: 'Hiểu các pricing models: cost-plus, value-based, competitive, tiered. Calculate break-even, contribution margin',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Định Giá & Lợi Nhuận',
    status: 'not-started',
    level: 'beginner',
    role: 'CFO',
    hidden: true,
    tags: ['pricing', 'margin', 'break-even', 'models'],
    notes: 'Critical for profitability. Viết về khi nào dùng model nào, psychological pricing, common pitfalls',
  },
  {
    id: 'cash-flow-basics-work',
    title: 'Cash flow management cơ bản',
    description: 'Hiểu cash flow statement, working capital, cash conversion cycle. Distinguish between profit vs cash',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Dự Báo Tài Chính',
    status: 'not-started',
    level: 'beginner',
    role: 'CFO',
    hidden: true,
    tags: ['cash-flow', 'working-capital', 'liquidity', 'fundamentals'],
    notes: 'Cash is king. Viết về why profitable companies fail, managing receivables/payables, cash runway',
  },
  {
    id: 'financial-metrics-basics-work',
    title: 'Financial metrics & ratios cơ bản',
    description: 'Nắm vững key financial ratios: gross margin, operating margin, ROI, ROE, current ratio, quick ratio, debt-to-equity',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Quản Lý P&L',
    status: 'not-started',
    level: 'beginner',
    role: 'CFO',
    hidden: true,
    tags: ['metrics', 'ratios', 'financial-analysis', 'fundamentals'],
    notes: 'Language of business. Viết về industry benchmarks, ratio analysis interpretation, red flags',
  },

  // ========================================
  // CFO INTERMEDIATE (need 4-5 items)
  // ========================================
  {
    id: 'fpa-fundamentals-work',
    title: 'FP&A fundamentals',
    description: 'Financial Planning & Analysis basics: budgeting process, rolling forecasts, variance analysis, business partnering',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Dự Báo Tài Chính',
    status: 'not-started',
    level: 'intermediate',
    role: 'CFO',
    hidden: true,
    tags: ['fpa', 'planning', 'forecasting', 'business-partner'],
    notes: 'Trend 2025: FP&A shifting to strategic partner. Viết về agile planning, real-time reporting',
  },
  {
    id: 'scenario-planning-modeling-work',
    title: 'Scenario planning & modeling',
    description: 'Xây dựng scenario models: best case, base case, worst case. Probability-weighted forecasts, sensitivity analysis',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Dự Báo Tài Chính',
    status: 'not-started',
    level: 'intermediate',
    role: 'CFO',
    hidden: true,
    tags: ['scenario', 'modeling', 'forecasting', 'risk'],
    notes: 'Essential for volatile environment. Viết về Monte Carlo, decision trees, communicating scenarios',
  },
  {
    id: 'cost-optimization-initiatives-work',
    title: 'Cost optimization initiatives',
    description: 'Identify và execute cost optimization: zero-based budgeting, vendor consolidation, process efficiency, automation ROI',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Ngân Sách & Kiểm Soát Chi Phí',
    status: 'not-started',
    level: 'intermediate',
    role: 'CFO',
    hidden: true,
    tags: ['cost', 'optimization', 'efficiency', 'zbb'],
    notes: 'Balancing cost cuts vs growth investment. Viết về sustainable cost reduction, change management',
  },
  {
    id: 'revenue-analysis-planning-work',
    title: 'Revenue analysis & growth planning',
    description: 'Phân tích revenue streams, cohort analysis, customer lifetime value, revenue forecasting, growth initiatives evaluation',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Quản Lý P&L',
    status: 'not-started',
    level: 'intermediate',
    role: 'CFO',
    hidden: true,
    tags: ['revenue', 'growth', 'analysis', 'planning'],
    notes: 'Growth-focused finance. Viết về unit economics, cohort retention curves, SaaS metrics',
  },
  {
    id: 'financial-systems-implementation-work',
    title: 'Triển khai hệ thống financial systems',
    description: 'Select và implement financial systems: ERP, planning tools, BI platforms. Integration, automation, reporting',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Ngân Sách & Kiểm Soát Chi Phí',
    status: 'not-started',
    level: 'intermediate',
    role: 'CFO',
    hidden: true,
    tags: ['systems', 'erp', 'automation', 'digitalization'],
    notes: 'Technology enabling finance. Viết về vendor selection, implementation pitfalls, change management',
  },

  // ========================================
  // CFO EXPERT (need 3-4 items)
  // ========================================
  {
    id: 'strategic-financial-leadership-work',
    title: 'Strategic financial leadership',
    description: 'Evolve từ numbers expert sang strategic leader. Partner với CEO/Board on strategy, resource allocation, investment decisions',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Kế Hoạch Hàng Năm & Quý',
    status: 'not-started',
    level: 'expert',
    role: 'CFO',
    hidden: true,
    targetDate: '2026-06-30',
    tags: ['strategic', 'leadership', 'board', 'ceo-partner'],
    notes: 'CFO 2025: Strategic partner not just comptroller. Viết về boardroom communication, influencing strategy',
  },
  {
    id: 'ma-strategy-execution-work',
    title: 'M&A strategy & execution',
    description: 'Lead M&A process: target identification, due diligence, valuation, deal structuring, post-merger integration',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Chuyển Đổi Kinh Doanh',
    status: 'not-started',
    level: 'expert',
    role: 'CFO',
    hidden: true,
    targetDate: '2027-12-31',
    tags: ['ma', 'acquisition', 'due-diligence', 'integration'],
    notes: 'Growth through M&A. Viết về valuation methods, cultural integration, common failure reasons',
  },
  {
    id: 'capital-allocation-strategy-work',
    title: 'Capital allocation strategy',
    description: 'Develop capital allocation framework: ROIC analysis, portfolio optimization, invest/harvest decisions, shareholder value creation',
    category: 'Quản Lý Tài Chính',
    subcategory: 'Quản Lý P&L',
    status: 'not-started',
    level: 'expert',
    role: 'CFO',
    hidden: true,
    targetDate: '2026-12-31',
    tags: ['capital', 'allocation', 'roic', 'value-creation'],
    notes: 'Core CFO responsibility. Viết về capital allocation frameworks, trade-offs, shareholder communication',
  },

  // ========================================
  // CLO BEGINNER (need 3-4 items)
  // ========================================
  {
    id: 'contract-basics-fundamentals-work',
    title: 'Cơ bản về hợp đồng',
    description: 'Hiểu cấu trúc hợp đồng cơ bản: parties, terms, conditions, warranties, termination. Key clauses và risk areas',
    category: 'Hợp Đồng & Pháp Lý',
    subcategory: 'Hợp Đồng Khách Hàng',
    status: 'not-started',
    level: 'beginner',
    role: 'CLO',
    hidden: true,
    tags: ['contract', 'fundamentals', 'clauses', 'legal'],
    notes: 'Foundation for legal ops. Viết về common contract types, red flags, plain language contracting',
  },
  {
    id: 'ip-fundamentals-work',
    title: 'Intellectual Property fundamentals',
    description: 'Giới thiệu về IP: patents, trademarks, copyrights, trade secrets. Ownership, licensing, protection basics',
    category: 'Hợp Đồng & Pháp Lý',
    subcategory: 'Tuân Thủ Pháp Lý',
    status: 'not-started',
    level: 'beginner',
    role: 'CLO',
    hidden: true,
    tags: ['ip', 'intellectual-property', 'patents', 'trademarks'],
    notes: 'Critical for tech companies. Viết về IP strategy, work-for-hire, open source risks',
  },
  {
    id: 'legal-compliance-basics-work',
    title: 'Legal compliance cơ bản',
    description: 'Hiểu về regulatory compliance: labor laws, data protection, industry regulations. Compliance framework basics',
    category: 'Hợp Đồng & Pháp Lý',
    subcategory: 'Tuân Thủ Pháp Lý',
    status: 'not-started',
    level: 'beginner',
    role: 'CLO',
    hidden: true,
    tags: ['compliance', 'regulations', 'labor-law', 'fundamentals'],
    notes: 'Avoid legal pitfalls. Viết về common compliance failures, creating compliance culture',
  },
  {
    id: 'contract-review-process-work',
    title: 'Contract review process',
    description: 'Thiết lập quy trình review hợp đồng: intake, triage, review checklist, approval workflow, repository',
    category: 'Hợp Đồng & Pháp Lý',
    subcategory: 'Hợp Đồng Khách Hàng',
    status: 'not-started',
    level: 'beginner',
    role: 'CLO',
    hidden: true,
    tags: ['contract', 'review', 'process', 'workflow'],
    notes: 'Efficient legal ops. Viết về SLAs for legal, playbooks, self-service',
  },

  // ========================================
  // CLO INTERMEDIATE (need 4-5 items)
  // ========================================
  {
    id: 'clm-implementation-work',
    title: 'Contract Lifecycle Management (CLM) implementation',
    description: 'Triển khai CLM system: vendor selection, implementation, workflows automation, AI integration, analytics',
    category: 'Hợp Đồng & Pháp Lý',
    subcategory: 'Hợp Đồng Khách Hàng',
    status: 'not-started',
    level: 'intermediate',
    role: 'CLO',
    hidden: true,
    tags: ['clm', 'technology', 'automation', 'ai'],
    notes: 'Trend 2025: CLM critical for legal ops. Viết về vendor evaluation, AI use cases, ROI',
  },
  {
    id: 'legal-operations-setup-work',
    title: 'Xây dựng legal operations function',
    description: 'Setup legal ops theo CLOC framework: business intelligence, financial mgmt, vendor mgmt, information governance',
    category: 'Hợp Đồng & Pháp Lý',
    subcategory: 'Tuân Thủ Pháp Lý',
    status: 'not-started',
    level: 'intermediate',
    role: 'CLO',
    hidden: true,
    tags: ['legal-ops', 'cloc', 'efficiency', 'operations'],
    notes: 'Modernizing legal function. Viết về legal ops maturity model, metrics, career path',
  },
  {
    id: 'negotiation-strategies-work',
    title: 'Advanced negotiation strategies',
    description: 'Kỹ năng đàm phán nâng cao: BATNA, value creation, multi-party negotiations, cross-cultural negotiation',
    category: 'Hợp Đồng & Pháp Lý',
    subcategory: 'Hợp Đồng Khách Hàng',
    status: 'not-started',
    level: 'intermediate',
    role: 'CLO',
    hidden: true,
    tags: ['negotiation', 'strategy', 'batna', 'deal-making'],
    notes: 'Essential CLO skill. Viết về negotiation frameworks, common tactics, deal killers',
  },
  {
    id: 'compliance-program-setup-work',
    title: 'Thiết lập compliance program',
    description: 'Design và implement compliance program: policies, training, monitoring, reporting, incident response',
    category: 'Hợp Đồng & Pháp Lý',
    subcategory: 'Tuân Thủ Pháp Lý',
    status: 'not-started',
    level: 'intermediate',
    role: 'CLO',
    hidden: true,
    tags: ['compliance', 'program', 'governance', 'risk'],
    notes: '78% CLOs responsible for compliance. Viết về program design, effectiveness metrics',
  },
  {
    id: 'data-privacy-implementation-work',
    title: 'Data privacy & cybersecurity implementation',
    description: 'Implement data privacy program: GDPR, CCPA compliance, privacy policies, breach response, cybersecurity protocols',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Kiểm Toán & Tuân Thủ',
    status: 'not-started',
    level: 'intermediate',
    role: 'CLO',
    hidden: true,
    tags: ['privacy', 'gdpr', 'cybersecurity', 'data-protection'],
    notes: 'Critical 2025 responsibility. Viết về privacy by design, incident response, cross-border data',
  },

  // ========================================
  // CLO EXPERT (need 3-4 items)
  // ========================================
  {
    id: 'strategic-legal-counsel-work',
    title: 'Strategic legal counsel to board & CEO',
    description: 'Provide strategic legal guidance: M&A, major deals, corporate governance, crisis management, regulatory strategy',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Kế Hoạch Hàng Năm & Quý',
    status: 'not-started',
    level: 'expert',
    role: 'CLO',
    hidden: true,
    targetDate: '2026-06-30',
    tags: ['strategic', 'board', 'governance', 'counsel'],
    notes: '81% CLOs report to CEO. Viết về boardroom presence, risk communication, strategic influence',
  },
  {
    id: 'four-faces-mastery-work',
    title: 'Four Faces CLO mastery',
    description: 'Master cân bằng 4 roles: Catalyst (competitive advantage), Strategist (legal strategy), Guardian (risk), Operator (efficiency)',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Kế Hoạch Hàng Năm & Quý',
    status: 'not-started',
    level: 'expert',
    role: 'CLO',
    hidden: true,
    targetDate: '2026-12-31',
    tags: ['leadership', 'strategy', 'four-faces', 'deloitte'],
    notes: 'Deloitte framework 2025. Goal: 60-70% catalyst/strategist, 30-40% guardian/operator',
  },
  {
    id: 'esg-sustainability-legal-leadership-work',
    title: 'ESG & sustainability legal leadership',
    description: 'Lead ESG legal strategy: sustainability disclosures, regulatory compliance, green claims, stakeholder governance',
    category: 'Quản Lý Rủi Ro & Khủng Hoảng',
    subcategory: 'Quản Lý Rủi Ro',
    status: 'not-started',
    level: 'expert',
    role: 'CLO',
    hidden: true,
    targetDate: '2027-06-30',
    tags: ['esg', 'sustainability', 'governance', 'regulatory'],
    notes: 'Emerging CLO responsibility 2025. Viết về ESG reporting, greenwashing risks, stakeholder expectations',
  },
  {
    id: 'ai-compliance-governance-work',
    title: 'AI compliance & governance',
    description: 'Develop AI governance framework: AI ethics, algorithmic transparency, regulatory compliance (EU AI Act), risk management',
    category: 'Hợp Đồng & Pháp Lý',
    subcategory: 'Tuân Thủ Pháp Lý',
    status: 'not-started',
    level: 'expert',
    role: 'CLO',
    hidden: true,
    targetDate: '2026-12-31',
    tags: ['ai', 'governance', 'compliance', 'ethics'],
    notes: '42% legal leaders cite AI compliance as top priority 2024. Viết về EU AI Act, responsible AI framework',
  },
];

console.log('=== NEW ITEMS TO ADD ===');
console.log(`Total new items: ${newItems.length}`);
console.log('');

const byRole = {};
const byLevel = {};

newItems.forEach(item => {
  if (!byRole[item.role]) byRole[item.role] = [];
  if (!byLevel[item.level]) byLevel[item.level] = [];
  byRole[item.role].push(item);
  byLevel[item.level].push(item);
});

console.log('BY ROLE:');
Object.entries(byRole).forEach(([role, items]) => {
  console.log(`  ${role}: ${items.length} items`);
  const levels = {};
  items.forEach(i => {
    levels[i.level] = (levels[i.level] || 0) + 1;
  });
  Object.entries(levels).forEach(([level, count]) => {
    console.log(`    - ${level}: ${count}`);
  });
});

console.log('\nBY LEVEL:');
Object.entries(byLevel).forEach(([level, items]) => {
  console.log(`  ${level}: ${items.length} items`);
});

console.log('\n=== AFTER ADDING (PROJECTED) ===');
console.log('Current: 90 items');
console.log(`New: ${newItems.length} items`);
console.log(`Total: ${90 + newItems.length} items`);

module.exports = { newItems };
