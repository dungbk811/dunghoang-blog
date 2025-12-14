const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');

console.log('Applying concise descriptions...\n');

// Shorter, more concise descriptions (10-12 words ideal)
const improvements = [
  // COO
  { id: 'annual-operating-plan-work', newDesc: 'Lập kế hoạch vận hành hàng năm, mục tiêu, ngân sách, resources' },
  { id: 'quarterly-okr-work', newDesc: 'Thiết lập OKRs hàng quý, tracking, alignment giữa teams' },
  { id: 'competitive-analysis-work', newDesc: 'Phân tích đối thủ, market trends, opportunities và threats' },
  { id: 'tech-stack-modernization-work', newDesc: 'Đánh giá và nâng cấp tech stack, security, performance' },
  { id: 'innovation-time-allocation-work', newDesc: 'Phân bổ 10-20% time cho R&D, innovation, pilot projects' },
  { id: 'quality-metrics-improvement-work', newDesc: 'Thiết lập quality KPIs, tracking, continuous improvement initiatives' },
  { id: 'automation-opportunities-work', newDesc: 'Identify automation opportunities: testing, deployment, reporting để tăng efficiency' },
  { id: 'customer-retention-work', newDesc: 'Chiến lược giữ chân khách hàng: satisfaction tracking, proactive support' },
  { id: 'new-market-exploration-work', newDesc: 'Khám phá thị trường mới: research, competitor analysis, entry strategy' },
  { id: 'proposal-quality-assurance-work', newDesc: 'QA cho proposals: technical review, costing, compliance check' },
  { id: 'pre-sales-support-work', newDesc: 'Hỗ trợ pre-sales: solution design, demos, POCs, Q&A' },
  { id: 'all-hands-meetings-work', newDesc: 'Tổ chức all-hands meetings: updates, achievements, Q&A, alignment' },
  { id: 'risk-mitigation-planning-work', newDesc: 'Xây dựng risk mitigation plans, contingency strategies' },
  { id: 'operational-risk-management-work', newDesc: 'Quản lý operational risks: delivery, resources, quality, vendor' },
  { id: 'bcp-plan-work', newDesc: 'Xây dựng Business Continuity Plan, recovery procedures, testing' },
  { id: 'dr-plan-work', newDesc: 'Xây dựng Disaster Recovery Plan, RTO/RPO, backup strategies' },
  { id: 'bcp-dr-testing-work', newDesc: 'Kiểm tra BCP/DR định kỳ: drills, gap analysis, updates' },
  { id: 'crisis-management-process-work', newDesc: 'Quy trình crisis management: escalation, communication, resolution' },
  { id: 'escalation-handling-work', newDesc: 'Xử lý major escalations: rapid response, root cause, prevention' },
  { id: 'crisis-communication-work', newDesc: 'Crisis communication: internal/external notifications, stakeholder updates' },
  { id: 'sla-compliance-tracking-work', newDesc: 'Tracking SLA compliance, violations, corrective actions' },
  { id: 'sla-reporting-work', newDesc: 'Báo cáo SLA cho clients: performance, incidents, improvements' },
  { id: 'sla-performance-improvement-work', newDesc: 'Cải thiện SLA: bottleneck analysis, optimization, automation' },
  { id: 'escalation-process-work', newDesc: 'Quy trình escalation: severity levels, timelines, responsibilities' },
  { id: 'customer-emergency-resolution-work', newDesc: 'Giải quyết urgent issues: triage, war room, resolution' },
  { id: 'root-cause-analysis-work', newDesc: 'Root cause analysis: 5 Whys, systemic fixes' },
  { id: 'post-mortem-support-work', newDesc: 'Post-mortem facilitation: learnings, action items, knowledge sharing' },
  { id: 'customer-health-tracking-work', newDesc: 'Tracking customer health: satisfaction, usage, risk signals' },
  { id: 'service-quality-improvement-work', newDesc: 'Service quality initiatives: feedback analysis, process improvements' },
  { id: 'quarterly-demand-forecast-work', newDesc: 'Dự báo capacity hàng quý: pipeline, trends, growth' },
  { id: 'pipeline-analysis-work', newDesc: 'Phân tích pipeline: probability, resources, timing, risks' },
  { id: 'seasonal-demand-planning-work', newDesc: 'Planning cho seasonal demand, flexible staffing' },
  { id: 'capacity-modeling-work', newDesc: 'Modeling capacity: utilization targets, buffer, scenarios' },
  { id: 'resource-optimization-work', newDesc: 'Tối ưu bench capacity, cross-training, cost efficiency' },

  // CPO
  { id: 'long-service-awards-work', newDesc: 'Recognition cho long service: milestones, awards, celebrations' },
  { id: 'internal-communication-work', newDesc: 'Internal communication strategy: channels, cadence, transparency' },
  { id: 'employee-engagement-programs-work', newDesc: 'Employee engagement: surveys, initiatives, culture building' },
  { id: 'remote-work-management-work', newDesc: 'Remote work policies: tools, norms, work-life balance' },
  { id: 'recruitment-forecasting-work', newDesc: 'Dự báo hiring needs từ pipeline, timelines' },
  { id: 'hiring-timing-decisions-work', newDesc: 'Quyết định hiring timing: growth, budget, capacity' },
  { id: 'hiring-pipeline-management-work', newDesc: 'Quản lý recruitment: sourcing, screening, offers, onboarding' },

  // CFO
  { id: 'pl-ownership-work', newDesc: 'P&L ownership: closing, variance analysis, forecasting' },
  { id: 'revenue-profitability-analysis-work', newDesc: 'Phân tích revenue, profitability by project/client' },
  { id: 'margin-responsibility-work', newDesc: 'Đảm bảo margins: pricing, cost control, monitoring' },
  { id: 'annual-budget-work', newDesc: 'Lập ngân sách hàng năm: inputs, assumptions, approval' },
  { id: 'budget-tracking-control-work', newDesc: 'Tracking budget vs actual, variance analysis, controls' },
  { id: 'cost-optimization-work', newDesc: 'Cost optimization: vendor negotiations, efficiency, waste reduction' },
  { id: 'spending-approval-work', newDesc: 'Spending approvals: authority matrix, workflows, tracking' },
  { id: 'pricing-decisions-work', newDesc: 'Pricing decisions: analysis, benchmarking, margins' },
  { id: 'project-profitability-reporting-work', newDesc: 'Báo cáo project profitability, lessons learned' },
  { id: 'quarterly-revenue-forecast-work', newDesc: 'Dự báo revenue hàng quý: pipeline, trends' },
  { id: 'cost-forecasting-work', newDesc: 'Dự báo costs: headcount, vendors, overhead' },
  { id: 'insurance-management-work', newDesc: 'Quản lý insurance: coverage, renewals, claims' },

  // CLO
  { id: 'gdpr-compliance-work', newDesc: 'GDPR compliance: data mapping, policies, rights, audits' },
  { id: 'customer-dispute-management-work', newDesc: 'Giải quyết disputes: negotiation, mediation, litigation' },
  { id: 'customer-contract-negotiation-work', newDesc: 'Đàm phán client contracts: terms, risks, IP' },
  { id: 'terms-conditions-negotiation-work', newDesc: 'Đàm phán T&C: scope, liabilities, warranties' },
  { id: 'contract-approval-work', newDesc: 'Contract approvals: review, risk assessment, workflows' },
  { id: 'vendor-contract-negotiation-work', newDesc: 'Đàm phán vendor contracts: pricing, SLAs, exit' },
  { id: 'contract-review-work', newDesc: 'Review vendor agreements: risks, compliance, terms' },
  { id: 'contract-renewal-management-work', newDesc: 'Quản lý renewals: tracking, renegotiation, notices' },
  { id: 'legal-dispute-resolution-work', newDesc: 'Xử lý disputes: assessment, settlement, litigation' },
  { id: 'ip-policy-enforcement-work', newDesc: 'IP enforcement: ownership, licensing, monitoring' },
  { id: 'labor-law-compliance-work', newDesc: 'Labor law compliance: contracts, regulations, updates' },
];

let content = fs.readFileSync(roadmapPath, 'utf-8');
let updated = 0;

improvements.forEach(imp => {
  const pattern = new RegExp(
    `(id: '${imp.id}',\\s*[\\s\\S]*?description: ')[^']+(',[\\s\\S]*?)`,
    'g'
  );

  if (content.match(pattern)) {
    content = content.replace(pattern, `$1${imp.newDesc}$2`);
    updated++;
    console.log(`✓ Updated: ${imp.id}`);
  } else {
    console.log(`⚠️  Not found: ${imp.id}`);
  }
});

fs.writeFileSync(roadmapPath, content, 'utf-8');

console.log(`\n✓ Done! Updated ${updated}/${improvements.length} descriptions`);
console.log('\nSample:');
console.log('  Before: "Lập và thực thi Annual Operating Plan" (7 words)');
console.log('  After: "' + improvements[0].newDesc + '" (' + improvements[0].newDesc.split(/\s+/).length + ' words)');
