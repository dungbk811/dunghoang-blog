const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');

console.log('Dịch tiếp các description CFO & CLO còn lẫn tiếng Anh (Part 3)...\n');

const translations = {
  // CFO items
  'Kỹ năng cơ bản track budget vs actual spending, variance analysis, forecast accuracy. Identify và explain deviations':
    'Kỹ năng cơ bản theo dõi ngân sách vs chi tiêu thực tế, phân tích chênh lệch, độ chính xác dự báo. Xác định và giải thích sai lệch',

  'Financial Planning & Analysis basics: budgeting process, rolling forecasts, variance analysis, business partnering':
    'Cơ bản về Kế hoạch Tài chính & Phân tích: quy trình lập ngân sách, dự báo lăn, phân tích chênh lệch, đối tác kinh doanh',

  'Identify và execute cost optimization: zero-based budgeting, vendor consolidation, process efficiency, automation ROI':
    'Xác định và thực hiện tối ưu chi phí: lập ngân sách từ con số không, hợp nhất nhà cung cấp, hiệu quả quy trình, ROI tự động hóa',

  'Phân tích revenue streams, cohort analysis, customer lifetime value, revenue forecasting, growth initiatives evaluation':
    'Phân tích dòng doanh thu, phân tích nhóm khách hàng, giá trị vòng đời khách hàng, dự báo doanh thu, đánh giá sáng kiến tăng trưởng',

  'Select và implement financial systems: ERP, planning tools, BI platforms. Integration, automation, reporting':
    'Lựa chọn và triển khai hệ thống tài chính: ERP, công cụ kế hoạch, nền tảng BI. Tích hợp, tự động hóa, báo cáo',

  'Evolve từ numbers expert sang strategic leader. Partner với CEO/Board on strategy, resource allocation, investment decisions':
    'Phát triển từ chuyên gia số liệu sang lãnh đạo chiến lược. Đối tác với CEO/Hội đồng quản trị về chiến lược, phân bổ nguồn lực, quyết định đầu tư',

  'Lead M&A process: target identification, due diligence, valuation, deal structuring, post-merger integration':
    'Dẫn dắt quy trình M&A: xác định mục tiêu, thẩm định, định giá, cấu trúc giao dịch, tích hợp sau sáp nhập',

  'Develop capital allocation framework: ROIC analysis, portfolio optimization, invest/harvest decisions, shareholder value creation':
    'Phát triển khung phân bổ vốn: phân tích ROIC, tối ưu danh mục đầu tư, quyết định đầu tư/thu hoạch, tạo giá trị cổ đông',

  // CLO items
  'Giới thiệu về IP: patents, trademarks, copyrights, trade secrets. Ownership, licensing, protection basics':
    'Giới thiệu về sở hữu trí tuệ: bằng sáng chế, thương hiệu, bản quyền, bí mật thương mại. Quyền sở hữu, cấp phép, bảo vệ cơ bản',

  'Setup legal ops theo CLOC framework: business intelligence, financial mgmt, vendor mgmt, information governance':
    'Thiết lập vận hành pháp lý theo khung CLOC: thông tin kinh doanh, quản lý tài chính, quản lý nhà cung cấp, quản trị thông tin',

  'Kỹ năng đàm phán nâng cao: BATNA, value creation, multi-party negotiations, cross-cultural negotiation':
    'Kỹ năng đàm phán nâng cao: BATNA, tạo giá trị, đàm phán đa bên, đàm phán xuyên văn hóa',

  'Design và implement compliance program: policies, training, monitoring, reporting, incident response':
    'Thiết kế và triển khai chương trình tuân thủ: chính sách, đào tạo, giám sát, báo cáo, ứng phó sự cố',

  'Implement data privacy program: GDPR, CCPA compliance, privacy policies, breach response, cybersecurity protocols':
    'Triển khai chương trình bảo mật dữ liệu: tuân thủ GDPR, CCPA, chính sách riêng tư, ứng phó vi phạm, giao thức an ninh mạng',

  'Provide strategic legal guidance: M&A, major deals, corporate governance, crisis management, regulatory strategy':
    'Cung cấp hướng dẫn pháp lý chiến lược: M&A, giao dịch lớn, quản trị doanh nghiệp, quản lý khủng hoảng, chiến lược quy định',

  'Master cân bằng 4 roles: Catalyst (competitive advantage), Strategist (legal strategy), Guardian (risk), Operator (efficiency)':
    'Thành thạo cân bằng 4 vai trò: Xúc tác (lợi thế cạnh tranh), Chiến lược gia (chiến lược pháp lý), Người bảo vệ (rủi ro), Người vận hành (hiệu quả)',

  'Lead ESG legal strategy: sustainability disclosures, regulatory compliance, green claims, stakeholder governance':
    'Dẫn dắt chiến lược pháp lý ESG: công bố bền vững, tuân thủ quy định, tuyên bố xanh, quản trị bên liên quan',

  'Develop AI governance framework: AI ethics, algorithmic transparency, regulatory compliance (EU AI Act), risk management':
    'Phát triển khung quản trị AI: đạo đức AI, minh bạch thuật toán, tuân thủ quy định (Đạo luật AI EU), quản lý rủi ro',
};

let content = fs.readFileSync(roadmapPath, 'utf-8');
let updated = 0;

Object.entries(translations).forEach(([oldDesc, newDesc]) => {
  const before = content;
  const escaped = oldDesc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`description: '${escaped}'`, 'g');

  content = content.replace(pattern, `description: '${newDesc}'`);

  if (content !== before) {
    updated++;
    console.log(`✓ Đã dịch: "${oldDesc.substring(0, 60)}..."`);
  } else {
    console.log(`⚠️  Không tìm thấy: "${oldDesc.substring(0, 60)}..."`);
  }
});

fs.writeFileSync(roadmapPath, content, 'utf-8');

console.log(`\n✓ Hoàn thành! Đã dịch ${updated}/${Object.keys(translations).length} descriptions`);
