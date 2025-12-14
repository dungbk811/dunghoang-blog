const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');

console.log('Dịch các description còn lẫn tiếng Anh...\n');

// Mapping from English/mixed to Vietnamese
const translations = {
  // Line 2430
  'Kỹ năng cơ bản về process mapping: value stream mapping, flowcharts, identifying bottlenecks trong operational workflows':
    'Kỹ năng cơ bản về ánh xạ quy trình: sơ đồ giá trị, lưu đồ, xác định điểm nghẽn trong quy trình vận hành',

  // Line 2443
  'Hiểu các operational metrics cơ bản: throughput, cycle time, utilization rate, defect rate, on-time delivery':
    'Hiểu các chỉ số vận hành cơ bản: năng suất, thời gian chu kỳ, tỷ lệ sử dụng, tỷ lệ lỗi, giao hàng đúng hạn',

  // Line 2456
  'Thiết lập quality control checkpoints tại các giai đoạn quan trọng của delivery process để ensure standards':
    'Thiết lập các điểm kiểm soát chất lượng tại các giai đoạn quan trọng của quy trình giao hàng để đảm bảo tiêu chuẩn',

  // Line 2469
  'Sử dụng people analytics để identify patterns, predict turnover risks, optimize talent allocation. Build data-driven HR decisions':
    'Sử dụng phân tích nhân sự để xác định xu hướng, dự đoán rủi ro thôi việc, tối ưu phân bổ nhân tài. Xây dựng quyết định HR dựa trên dữ liệu',

  // Line 2482
  'Chuyển từ reactive sang proactive succession planning. Identify và develop future leaders ở tất cả levels, không chỉ executive':
    'Chuyển từ lập kế hoạch kế nhiệm bị động sang chủ động. Xác định và phát triển lãnh đạo tương lai ở tất cả cấp độ, không chỉ cấp điều hành',

  // Line 2495
  'Modernize performance reviews: continuous feedback, competency frameworks, behavioral insights, alignment với business goals':
    'Hiện đại hóa đánh giá hiệu suất: phản hồi liên tục, khung năng lực, thông tin hành vi, phù hợp với mục tiêu kinh doanh',

  // Line 2508
  'Xây dựng strategic workforce plan với horizon 3-5 năm. Skills-based planning, scenario modeling, alignment với business strategy':
    'Xây dựng kế hoạch lực lượng lao động chiến lược với tầm nhìn 3-5 năm. Kế hoạch dựa trên kỹ năng, mô hình kịch bản, phù hợp với chiến lược kinh doanh',

  // Line 2522
  'Lead organizational redesign để adapt với AI, remote work, changing business models. Restructure roles, reporting lines, team topology':
    'Dẫn dắt tái thiết kế tổ chức để thích ứng với AI, làm việc từ xa, mô hình kinh doanh thay đổi. Tái cấu trúc vai trò, đường báo cáo, cấu trúc nhóm',

  // Line 2536
  'Develop và execute talent strategy aligned với business objectives. Integrate talent acquisition, development, retention vào business planning':
    'Phát triển và thực thi chiến lược nhân tài phù hợp với mục tiêu kinh doanh. Tích hợp tuyển dụng, phát triển, giữ chân nhân tài vào kế hoạch kinh doanh',

  // Line 2550
  'Lead diversity, equity & inclusion strategy. Embedding DEI vào talent processes, culture initiatives, measuring impact':
    'Dẫn dắt chiến lược đa dạng, công bằng và hòa nhập. Nhúng DEI vào quy trình nhân tài, sáng kiến văn hóa, đo lường tác động',
};

let content = fs.readFileSync(roadmapPath, 'utf-8');
let updated = 0;

Object.entries(translations).forEach(([oldDesc, newDesc]) => {
  const before = content;
  // Escape special regex characters in the old description
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
