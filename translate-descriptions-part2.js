const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');

console.log('Dịch tiếp các description còn lẫn tiếng Anh (Part 2)...\n');

const translations = {
  // Line 1572
  'Identify automation opportunities: testing, deployment, reporting để tăng efficiency':
    'Xác định cơ hội tự động hóa: kiểm thử, triển khai, báo cáo để tăng hiệu suất',

  // Line 1640
  'Khám phá thị trường mới: research, competitor analysis, entry strategy':
    'Khám phá thị trường mới: nghiên cứu, phân tích đối thủ, chiến lược gia nhập',

  // Line 1716
  'Tổ chức all-hands meetings: updates, achievements, Q&A, alignment':
    'Tổ chức họp toàn công ty: cập nhật, thành tựu, hỏi đáp, đồng bộ',

  // Line 1768
  'P&L ownership: closing, variance analysis, forecasting':
    'Sở hữu P&L: khóa sổ, phân tích chênh lệch, dự báo',

  // Line 1818
  'Tracking budget vs actual, variance analysis, controls':
    'Theo dõi ngân sách vs thực tế, phân tích chênh lệch, kiểm soát',

  // Line 1854
  'Pricing decisions: analysis, benchmarking, margins':
    'Quyết định giá: phân tích, so sánh thị trường, biên lợi nhuận',

  // Line 2003
  'Kiểm tra BCP/DR định kỳ: drills, gap analysis, updates':
    'Kiểm tra BCP/DR định kỳ: diễn tập, phân tích khoảng trống, cập nhật',

  // Line 2015
  'Quy trình crisis management: escalation, communication, resolution':
    'Quy trình quản lý khủng hoảng: leo thang, giao tiếp, giải quyết',

  // Line 2094
  'Cải thiện SLA: bottleneck analysis, optimization, automation':
    'Cải thiện SLA: phân tích điểm nghẽn, tối ưu hóa, tự động hóa',

  // Line 2133
  'Root cause analysis: 5 Whys, systemic fixes':
    'Phân tích nguyên nhân gốc rễ: 5 Whys, sửa lỗi hệ thống',

  // Line 2169
  'Service quality initiatives: feedback analysis, process improvements':
    'Sáng kiến chất lượng dịch vụ: phân tích phản hồi, cải tiến quy trình',

  // Line 2209
  'Contract approvals: review, risk assessment, workflows':
    'Phê duyệt hợp đồng: xem xét, đánh giá rủi ro, quy trình',

  // Line 2258
  'Xử lý disputes: assessment, settlement, litigation':
    'Xử lý tranh chấp: đánh giá, thỏa thuận, kiện tụng',

  // Line 2322
  'Planning cho seasonal demand, flexible staffing':
    'Lập kế hoạch cho nhu cầu theo mùa, nhân sự linh hoạt',

  // Line 1305
  'Thiết lập OKRs hàng quý, tracking, alignment giữa teams':
    'Thiết lập OKRs hàng quý, theo dõi, đồng bộ giữa các nhóm',

  // Line 1548
  'Thiết lập quality KPIs, tracking, continuous improvement initiatives':
    'Thiết lập KPIs chất lượng, theo dõi, các sáng kiến cải tiến liên tục',
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
