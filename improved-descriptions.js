// Improved descriptions for short items
// Based on role context and level

const improvedDescriptions = {
  // COO Items
  'annual-operating-plan-work': 'Lập kế hoạch vận hành hàng năm (AOP), thiết lập mục tiêu, phân bổ ngân sách, resource planning, alignment với business strategy',

  'quarterly-okr-work': 'Thiết lập và theo dõi OKRs hàng quý cho toàn tổ chức, đảm bảo alignment giữa các teams, review progress định kỳ',

  'competitive-analysis-work': 'Theo dõi và phân tích đối thủ cạnh tranh, market positioning, pricing strategies, technology trends, opportunities và threats',

  'tech-stack-modernization-work': 'Đánh giá và cập nhật technology stack, migration planning, đảm bảo security, performance, và maintainability của hệ thống',

  'innovation-time-allocation-work': 'Phân bổ dedicated time cho R&D và innovation activities (10-20% time), experimentation với new technologies, pilot projects',

  'quality-metrics-improvement-work': 'Thiết lập quality metrics (defect rate, test coverage, code quality), tracking trends, continuous improvement initiatives',

  'automation-opportunities-work': 'Identify và triển khai automation opportunities: testing automation, deployment pipelines, reporting automation để tăng efficiency',

  'customer-retention-work': 'Phát triển chiến lược giữ chân khách hàng: regular check-ins, satisfaction surveys, addressing concerns proactively, renewal strategies',

  'new-market-exploration-work': 'Khám phá cơ hội mở rộng thị trường mới: market research, competitor analysis, entry strategies, partnership opportunities',

  'proposal-quality-assurance-work': 'Đảm bảo chất lượng proposals: technical review, costing accuracy, compliance check, presentation quality trước khi submit',

  'pre-sales-support-work': 'Hỗ trợ technical pre-sales: solution architecture, demo preparation, POC development, technical Q&A với clients',

  'all-hands-meetings-work': 'Tổ chức all-hands meetings định kỳ (monthly/quarterly): company updates, achievements, challenges, Q&A, team building',

  'risk-mitigation-planning-work': 'Xây dựng risk mitigation plans: identify potential risks, probability assessment, impact analysis, mitigation strategies, contingency planning',

  'operational-risk-management-work': 'Quản lý operational risks: delivery risks, resource risks, quality risks, vendor risks, monitoring và response procedures',

  'bcp-plan-work': 'Xây dựng và maintain Business Continuity Plan: critical functions identification, recovery procedures, backup systems, regular testing',

  'dr-plan-work': 'Xây dựng và maintain Disaster Recovery Plan: RTO/RPO definition, backup strategies, recovery procedures, annual DR drills',

  'bcp-dr-testing-work': 'Kiểm tra BCP/DR plans định kỳ: tabletop exercises, failover testing, identifying gaps, updating procedures based on results',

  'crisis-management-process-work': 'Thiết lập quy trình xử lý khủng hoảng: escalation matrix, communication protocol, decision authority, post-crisis review',

  'escalation-handling-work': 'Xử lý major escalations: rapid response, stakeholder communication, root cause analysis, resolution tracking, preventive measures',

  'crisis-communication-work': 'Triển khai crisis communication: internal announcements, customer notifications, stakeholder updates, media response nếu cần',

  'sla-compliance-tracking-work': 'Theo dõi tuân thủ SLA: monitoring metrics (uptime, response time, resolution time), tracking violations, corrective actions',

  'sla-reporting-work': 'Báo cáo SLA cho khách hàng: monthly reports, performance trends, incidents summary, improvement initiatives, review meetings',

  'sla-performance-improvement-work': 'Cải thiện SLA performance: identify bottlenecks, process optimization, resource allocation, automation opportunities',

  'escalation-process-work': 'Thiết lập quy trình escalation rõ ràng: severity levels, response times, escalation matrix, notification procedures, resolution tracking',

  'customer-emergency-resolution-work': 'Giải quyết urgent issues của khách hàng: rapid triage, war room setup, stakeholder communication, resolution verification',

  'root-cause-analysis-work': 'Phân tích root cause của incidents: 5 Whys, fishbone diagrams, identifying systemic issues, implementing permanent fixes',

  'post-mortem-support-work': 'Hỗ trợ post-mortem reviews: facilitating blameless discussions, documenting learnings, action items tracking, sharing knowledge',

  'customer-health-tracking-work': 'Theo dõi customer health metrics: engagement levels, satisfaction scores, usage patterns, risk indicators, proactive outreach',

  'service-quality-improvement-work': 'Triển khai service quality improvement initiatives: feedback analysis, process refinement, training programs, best practices sharing',

  'quarterly-demand-forecast-work': 'Dự báo capacity needs hàng quý: analyzing sales pipeline, historical trends, seasonality, growth projections, resource planning',

  'pipeline-analysis-work': 'Phân tích project pipeline: probability weighting, resource requirements, timing, dependencies, capacity constraints, risk assessment',

  'seasonal-demand-planning-work': 'Lập kế hoạch capacity cho seasonal fluctuations: historical patterns, holiday impacts, busy periods, flexible staffing strategies',

  'capacity-modeling-work': 'Xây dựng capacity models: utilization targets, bench capacity, growth buffer, scenario planning cho different demand levels',

  'resource-optimization-work': 'Tối ưu nguồn lực dự phòng: balancing bench capacity, cross-training, flexible assignments, cost optimization',

  // CPO Items
  'long-service-awards-work': 'Triển khai long-service recognition program: milestone awards (1, 3, 5, 10 years), meaningful recognition, celebration events',

  'internal-communication-work': 'Xây dựng effective internal communication: regular updates, multiple channels, feedback mechanisms, transparency culture',

  'employee-engagement-programs-work': 'Triển khai employee engagement initiatives: surveys, focus groups, action planning, continuous improvement, culture building',

  'remote-work-management-work': 'Phát triển remote work policies và best practices: collaboration tools, communication norms, productivity tracking, work-life balance',

  'recruitment-forecasting-work': 'Dự báo tuyển dụng based on pipeline: analyzing project wins, ramp-up timelines, skill requirements, lead time planning',

  'hiring-timing-decisions-work': 'Quyết định optimal hiring timing: balancing growth needs, budget constraints, market conditions, onboarding capacity',

  'hiring-pipeline-management-work': 'Quản lý recruitment pipeline: candidate sourcing, screening, interviewing, offer management, onboarding preparation',

  // CFO Items
  'pl-ownership-work': 'Sở hữu P&L statement: monthly closing, variance analysis, profitability tracking by project/client, forecasting, board reporting',

  'revenue-profitability-analysis-work': 'Phân tích revenue và profitability: by service line, client segment, project type, trend analysis, improvement opportunities',

  'margin-responsibility-work': 'Đảm bảo target margins: pricing discipline, cost control, project profitability monitoring, corrective actions for underperforming projects',

  'annual-budget-work': 'Lập ngân sách hàng năm: bottoms-up budgeting, department inputs, growth assumptions, phasing, board approval',

  'budget-tracking-control-work': 'Theo dõi budget vs actual: monthly variance analysis, explanations, reforecasting, spending controls, approval workflows',

  'cost-optimization-work': 'Triển khai cost optimization initiatives: vendor negotiations, process efficiency, headcount optimization, eliminating waste',

  'spending-approval-work': 'Thiết lập spending approval workflow: authority matrix, approval levels, documentation requirements, tracking và audit',

  'pricing-decisions-work': 'Quyết định pricing strategy: cost-plus analysis, market benchmarking, value-based pricing, discount approvals, margin targets',

  'project-profitability-reporting-work': 'Báo cáo project profitability: actual vs estimated costs, margin analysis, lessons learned, pricing adjustments',

  'quarterly-revenue-forecast-work': 'Dự báo revenue hàng quý: pipeline analysis, booking trends, renewal forecasts, growth assumptions, risk adjustments',

  'cost-forecasting-work': 'Dự báo operating costs: headcount planning, vendor costs, infrastructure, overhead, one-time expenses, contingencies',

  'insurance-management-work': 'Quản lý insurance portfolio: coverage assessment, policy renewals, claims management, risk transfer strategies, cost optimization',

  // CLO Items
  'gdpr-compliance-work': 'Đảm bảo GDPR compliance: data mapping, privacy policies, consent management, data subject rights, breach procedures, regular audits',

  'customer-dispute-management-work': 'Giải quyết legal disputes với clients: negotiation, mediation, arbitration, litigation management nếu cần, risk mitigation',

  'customer-contract-negotiation-work': 'Đàm phán client contracts: terms review, risk assessment, liability limits, payment terms, IP rights, approval workflows',

  'terms-conditions-negotiation-work': 'Đàm phán contract terms: scope definitions, deliverables, acceptance criteria, warranties, indemnities, termination clauses',

  'contract-approval-work': 'Review và approve contracts: legal review, risk assessment, compliance check, redlining, final approval workflows',

  'vendor-contract-negotiation-work': 'Đàm phán vendor contracts: pricing, SLAs, liability caps, termination rights, data protection, intellectual property',

  'contract-review-work': 'Review vendor agreements: legal risks, compliance requirements, financial terms, performance obligations, exit clauses',

  'contract-renewal-management-work': 'Quản lý contract renewals: tracking expirations, renegotiation opportunities, auto-renewal clauses, termination notices',

  'legal-dispute-resolution-work': 'Xử lý legal disputes: claim assessment, settlement negotiations, litigation strategy, outside counsel management',

  'ip-policy-enforcement-work': 'Thực thi IP policies: ownership documentation, licensing agreements, infringement monitoring, enforcement actions',

  'labor-law-compliance-work': 'Đảm bảo tuân thủ labor laws: employment contracts, working hours, overtime, leaves, terminations, regulatory updates',
};

console.log(`Total improved descriptions: ${Object.keys(improvedDescriptions).length}`);
console.log('\nSample improvements:');
console.log('Before: "Lập và thực thi Annual Operating Plan" (7 words)');
console.log('After: "' + improvedDescriptions['annual-operating-plan-work'] + '" (' +
  improvedDescriptions['annual-operating-plan-work'].split(/\s+/).length + ' words)');

module.exports = { improvedDescriptions };
