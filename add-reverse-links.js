const fs = require('fs');
const path = require('path');

// Mapping: Work Item ID → New Learning IDs to add
const reverseLinks = {
  // CPO-related work items
  'employee-engagement-programs-work': ['emotional-intelligence-hr-learning', 'dei-strategy-learning'],
  'feedback-mechanisms-work': ['emotional-intelligence-hr-learning'],
  'team-building-activities-work': ['emotional-intelligence-hr-learning'],
  'culture-initiatives-work': ['emotional-intelligence-hr-learning', 'dei-strategy-learning', 'change-management-hr-learning'],
  'workforce-analytics-implementation-work': ['hr-data-analytics-learning', 'hr-technology-learning'],
  'performance-management-redesign-work': ['hr-data-analytics-learning', 'hr-technology-learning'],
  'utilization-tracking-work': ['hr-data-analytics-learning'],
  'dei-strategy-leadership-work': ['dei-strategy-learning'],
  'talent-strategy-alignment-work': ['dei-strategy-learning', 'strategic-workforce-planning-learning'],
  'pl-statement-basics-work': ['financial-savvy-hr-learning'],
  'budget-vs-actual-tracking-work': ['financial-savvy-hr-learning'],
  'remote-work-best-practices-work': ['hr-technology-learning'],
  'organizational-design-transformation-work': ['change-management-hr-learning'],
  'strategic-workforce-planning-work': ['strategic-workforce-planning-learning', 'hr-data-analytics-learning'],
  'succession-planning-program-work': ['strategic-workforce-planning-learning'],
  'training-development-work': ['hr-technology-learning', 'change-management-hr-learning'],
  'performance-review-process-work': ['hr-data-analytics-learning'],

  // CFO-related work items
  'pl-ownership-work': ['gaap-ifrs-standards-learning', 'tax-planning-strategy-learning'],
  'financial-metrics-basics-work': ['gaap-ifrs-standards-learning'],
  'annual-budget-planning-work': ['advanced-financial-modeling-learning'],
  'scenario-planning-modeling-work': ['advanced-financial-modeling-learning'],
  'fpa-fundamentals-work': ['advanced-financial-modeling-learning'],
  'cost-optimization-initiatives-work': ['tax-planning-strategy-learning', 'advanced-financial-modeling-learning'],
  'cfo-cost-optimization-strategic-work': ['tax-planning-strategy-learning', 'advanced-financial-modeling-learning'],
  'cash-flow-management-work': ['treasury-cash-management-learning'],
  'cash-flow-basics-work': ['treasury-cash-management-learning'],
  'ma-strategy-execution-work': ['ma-corporate-finance-learning'],
  'capital-allocation-strategy-work': ['ma-corporate-finance-learning'],
  'financial-systems-implementation-work': ['financial-systems-erp-learning'],
  'strategic-financial-leadership-work': ['investor-relations-learning', 'ma-corporate-finance-learning'],
  'revenue-profitability-analysis-work': ['advanced-financial-modeling-learning'],
  'margin-accountability-work': ['advanced-financial-modeling-learning'],
  'project-profitability-analysis-work': ['advanced-financial-modeling-learning'],
  'budget-tracking-control-work': ['financial-systems-erp-learning'],
  'quarterly-revenue-forecast-work': ['advanced-financial-modeling-learning', 'treasury-cash-management-learning'],
  'cost-forecasting-work': ['advanced-financial-modeling-learning'],
  'pricing-approval-work': ['advanced-financial-modeling-learning'],
  'unit-economics-optimization-work': ['advanced-financial-modeling-learning'],

  // CLO-related work items
  'legal-dispute-handling-work': ['litigation-management-learning'],
  'client-dispute-management-work': ['litigation-management-learning', 'crisis-management-legal-learning'],
  'legal-compliance-basics-work': ['corporate-governance-learning', 'regulatory-strategy-learning'],
  'compliance-program-setup-work': ['corporate-governance-learning', 'regulatory-strategy-learning'],
  'crisis-response-protocol-work': ['crisis-management-legal-learning'],
  'crisis-communication-work': ['crisis-management-legal-learning'],
  'contract-negotiation-work': ['business-acumen-legal-learning'],
  'negotiation-strategies-work': ['business-acumen-legal-learning'],
  'client-contract-negotiation-work': ['business-acumen-legal-learning'],
  'terms-conditions-negotiation-work': ['business-acumen-legal-learning'],
  'vendor-contract-negotiation-work': ['business-acumen-legal-learning'],
  'labor-law-compliance-work': ['advanced-employment-law-learning'],
  'data-privacy-implementation-work': ['technology-law-cybersecurity-learning'],
  'ai-compliance-governance-work': ['technology-law-cybersecurity-learning'],
  'gdpr-compliance-work': ['technology-law-cybersecurity-learning'],
  'ip-policy-enforcement-work': ['technology-law-cybersecurity-learning'],
  'contract-basics-fundamentals-work': ['business-acumen-legal-learning'],
  'ip-fundamentals-work': ['technology-law-cybersecurity-learning'],
  'contract-review-work': ['business-acumen-legal-learning'],
  'contract-approval-work': ['business-acumen-legal-learning'],
  'clm-implementation-work': ['business-acumen-legal-learning'],
  'strategic-legal-counsel-work': ['business-acumen-legal-learning', 'corporate-governance-learning'],
  'esg-sustainability-legal-leadership-work': ['corporate-governance-learning', 'regulatory-strategy-learning'],

  // Cross-functional (All C-level)
  'operational-metrics-basics-work': ['data-literacy-leaders-learning'],
  'quarterly-demand-forecast-work': ['data-literacy-leaders-learning'],
  'pipeline-analysis-work': ['data-literacy-leaders-learning'],
  'sla-compliance-tracking-work': ['data-literacy-leaders-learning'],
  'quality-metrics-improvement-work': ['data-literacy-leaders-learning'],
  'customer-health-tracking-work': ['data-literacy-leaders-learning'],
};

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');
let content = fs.readFileSync(roadmapPath, 'utf-8');

let updatedCount = 0;
let notFoundCount = 0;

// Process each work item
for (const [workId, learningIds] of Object.entries(reverseLinks)) {
  // Find the work item block - match from id to closing brace
  // This regex finds an object that contains the specific id
  const idPattern = `id:\\s*'${workId}'`;
  const idIndex = content.indexOf(`id: '${workId}'`);

  if (idIndex === -1) {
    console.log(`❌ Not found: ${workId}`);
    notFoundCount++;
    continue;
  }

  // Find the opening brace before this id
  let openBraceIndex = content.lastIndexOf('{', idIndex);

  // Find the matching closing brace
  let braceCount = 1;
  let closeBraceIndex = openBraceIndex + 1;
  while (braceCount > 0 && closeBraceIndex < content.length) {
    if (content[closeBraceIndex] === '{') braceCount++;
    if (content[closeBraceIndex] === '}') braceCount--;
    closeBraceIndex++;
  }

  const workBlock = content.substring(openBraceIndex, closeBraceIndex);

  // Check if relatedLearningIds already exists
  if (workBlock.includes('relatedLearningIds')) {
    // Extract existing IDs
    const existingMatch = workBlock.match(/relatedLearningIds:\s*\[([^\]]*)\]/s);
    if (existingMatch) {
      const existingIdsStr = existingMatch[1];
      const existingIds = existingIdsStr
        .split(',')
        .map(id => id.trim().replace(/'/g, ''))
        .filter(Boolean);

      // Merge with new IDs (avoid duplicates)
      const allIds = [...new Set([...existingIds, ...learningIds])];
      const newIdsStr = allIds.map(id => `'${id}'`).join(', ');

      // Replace
      const newBlock = workBlock.replace(
        /relatedLearningIds:\s*\[[^\]]*\]/,
        `relatedLearningIds: [${newIdsStr}]`
      );
      content = content.substring(0, openBraceIndex) + newBlock + content.substring(closeBraceIndex);
      updatedCount++;
      console.log(`✅ Updated ${workId}: merged ${learningIds.length} new learning IDs`);
    }
  } else {
    // Add relatedLearningIds before the closing brace
    // Find the last field before closing brace
    const newIdsStr = learningIds.map(id => `'${id}'`).join(', ');

    // Find the position to insert - before the last closing brace
    const lastCommaIndex = workBlock.lastIndexOf(',');
    const insertPosition = lastCommaIndex > 0 ? lastCommaIndex + 1 : workBlock.lastIndexOf('}');

    const beforeInsert = workBlock.substring(0, insertPosition);
    const afterInsert = workBlock.substring(insertPosition);

    // Add the new field
    const newBlock = beforeInsert + `\n    relatedLearningIds: [${newIdsStr}],` + afterInsert;

    content = content.substring(0, openBraceIndex) + newBlock + content.substring(closeBraceIndex);
    updatedCount++;
    console.log(`✅ Added to ${workId}: ${learningIds.length} learning IDs`);
  }
}

// Write back
fs.writeFileSync(roadmapPath, content, 'utf-8');

console.log('\n' + '='.repeat(60));
console.log(`✅ Updated: ${updatedCount} work items`);
console.log(`❌ Not found: ${notFoundCount} work items`);
console.log('='.repeat(60));
