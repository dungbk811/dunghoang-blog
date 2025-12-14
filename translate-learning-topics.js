const fs = require('fs');
const path = require('path');

const translations = [
  // CPO
  {
    old: {
      title: 'Diversity, Equity & Inclusion (DEI)',
      description: 'Xây dựng chiến lược DEI: inclusive hiring, unconscious bias, đo lường tiến độ'
    },
    new: {
      title: 'Đa Dạng, Công Bằng & Hòa Nhập (DEI)',
      description: 'Xây dựng chiến lược DEI: tuyển dụng hòa nhập, thiên kiến vô thức, đo lường tiến độ'
    }
  },
  {
    old: {
      title: 'Financial Savvy cho HR Leaders',
      description: 'Hiểu tài chính để có credibility với C-Suite: budget, ROI, headcount planning'
    },
    new: {
      title: 'Hiểu Biết Tài Chính cho Lãnh Đạo HR',
      description: 'Hiểu tài chính để có uy tín với C-Suite: ngân sách, ROI, kế hoạch biên chế'
    }
  },
  {
    old: {
      title: 'HR Technology & Digital Transformation',
      description: 'HRIS systems, ATS, AI trong HR, employee experience platforms'
    },
    new: {
      title: 'Công Nghệ HR & Chuyển Đổi Số',
      description: 'Hệ thống HRIS, ATS, AI trong HR, nền tảng trải nghiệm nhân viên'
    }
  },
  {
    old: {
      title: 'Change Management cho HR',
      description: 'Dẫn dắt thay đổi tổ chức: ADKAR, Kotter, communication strategies'
    },
    new: {
      title: 'Quản Lý Thay Đổi cho HR',
      description: 'Dẫn dắt thay đổi tổ chức: mô hình ADKAR, mô hình Kotter, chiến lược giao tiếp'
    }
  },
  {
    old: {
      title: 'Strategic Workforce Planning',
      description: 'Align talent với business goals: demand forecasting, skills gaps, succession'
    },
    new: {
      title: 'Kế Hoạch Lực Lượng Lao Động Chiến Lược',
      description: 'Căn chỉnh nhân tài với mục tiêu kinh doanh: dự báo nhu cầu, khoảng cách kỹ năng, kế nhiệm'
    }
  },
  // CFO
  {
    old: {
      title: 'GAAP & IFRS Accounting Standards',
      description: 'Hiểu các chuẩn mực kế toán: GAAP principles, IFRS, revenue recognition'
    },
    new: {
      title: 'Chuẩn Mực Kế Toán GAAP & IFRS',
      description: 'Hiểu các chuẩn mực kế toán: nguyên tắc GAAP, IFRS, ghi nhận doanh thu'
    }
  },
  {
    old: {
      title: 'Advanced Financial Modeling',
      description: '3-statement modeling, DCF analysis, scenario planning, Excel best practices'
    },
    new: {
      title: 'Mô Hình Tài Chính Nâng Cao',
      description: 'Mô hình 3 báo cáo tài chính, phân tích DCF, kế hoạch kịch bản, thực hành Excel tốt nhất'
    }
  },
  {
    old: {
      title: 'Tax Planning & Strategy',
      description: 'Tối ưu thuế: corporate tax structures, transfer pricing, R&D credits'
    },
    new: {
      title: 'Kế Hoạch & Chiến Lược Thuế',
      description: 'Tối ưu thuế: cấu trúc thuế doanh nghiệp, giá chuyển nhượng, tín dụng R&D'
    }
  },
  {
    old: {
      title: 'Treasury & Cash Management',
      description: 'Quản lý thanh khoản: cash forecasting, working capital, banking relationships'
    },
    new: {
      title: 'Quản Lý Kho Bạc & Tiền Mặt',
      description: 'Quản lý thanh khoản: dự báo tiền mặt, vốn lưu động, quan hệ ngân hàng'
    }
  },
  {
    old: {
      title: 'M&A & Corporate Finance',
      description: 'Mergers & Acquisitions: valuation, due diligence, deal structuring'
    },
    new: {
      title: 'M&A & Tài Chính Doanh Nghiệp',
      description: 'Sáp nhập & Mua lại: định giá, thẩm định, cấu trúc giao dịch'
    }
  },
  {
    old: {
      title: 'Financial Systems & ERP',
      description: 'Hệ thống ERP: selection, implementation, automation, controls'
    },
    new: {
      title: 'Hệ Thống Tài Chính & ERP',
      description: 'Hệ thống ERP: lựa chọn, triển khai, tự động hóa, kiểm soát'
    }
  },
  {
    old: {
      title: 'Investor Relations & Capital Markets',
      description: 'Gọi vốn & IR: equity vs debt, pitch decks, term sheets, board reporting'
    },
    new: {
      title: 'Quan Hệ Nhà Đầu Tư & Thị Trường Vốn',
      description: 'Gọi vốn & quan hệ nhà đầu tư: vốn cổ phần vs nợ, bản trình bày, điều khoản, báo cáo hội đồng'
    }
  },
  // CLO
  {
    old: {
      title: 'Litigation Management & Strategy',
      description: 'Quản lý kiện tụng: risk assessment, outside counsel, settlements'
    },
    new: {
      title: 'Quản Lý & Chiến Lược Kiện Tụng',
      description: 'Quản lý kiện tụng: đánh giá rủi ro, luật sư bên ngoài, thỏa thuận'
    }
  },
  {
    old: {
      title: 'Corporate Governance',
      description: 'Quản trị doanh nghiệp: board duties, fiduciary responsibilities, best practices'
    },
    new: {
      title: 'Quản Trị Doanh Nghiệp',
      description: 'Quản trị doanh nghiệp: nhiệm vụ hội đồng, trách nhiệm tín thác, thực hành tốt nhất'
    }
  },
  {
    old: {
      title: 'Regulatory Strategy & Government Relations',
      description: 'Chiến lược tuân thủ proactive: monitoring, lobbying, rule-making'
    },
    new: {
      title: 'Chiến Lược Quy Định & Quan Hệ Chính Phủ',
      description: 'Chiến lược tuân thủ chủ động: giám sát, vận động hành lang, xây dựng quy tắc'
    }
  },
  {
    old: {
      title: 'Crisis Management (Legal Perspective)',
      description: 'Quản lý khủng hoảng pháp lý: response protocols, investigations, communications'
    },
    new: {
      title: 'Quản Lý Khủng Hoảng (Góc Độ Pháp Lý)',
      description: 'Quản lý khủng hoảng pháp lý: quy trình phản hồi, điều tra, truyền thông'
    }
  },
  {
    old: {
      title: 'Business Acumen cho Legal Leaders',
      description: 'Hiểu business để align legal với goals: P&L, negotiations, strategy'
    },
    new: {
      title: 'Nhạy Bén Kinh Doanh cho Lãnh Đạo Pháp Lý',
      description: 'Hiểu kinh doanh để căn chỉnh pháp lý với mục tiêu: P&L, đàm phán, chiến lược'
    }
  },
  {
    old: {
      title: 'Employment Law & Labor Relations (Advanced)',
      description: 'Employment law chuyên sâu: wrongful termination, investigations, classification'
    },
    new: {
      title: 'Luật Lao Động & Quan Hệ Lao Động (Nâng Cao)',
      description: 'Luật lao động chuyên sâu: sa thải trái phép, điều tra, phân loại'
    }
  },
  {
    old: {
      title: 'Technology Law & Cybersecurity Legal',
      description: 'Tech law: data breaches, cybersecurity regulations, cloud contracts, AI liability'
    },
    new: {
      title: 'Luật Công Nghệ & An Ninh Mạng Pháp Lý',
      description: 'Luật công nghệ: vi phạm dữ liệu, quy định an ninh mạng, hợp đồng đám mây, trách nhiệm AI'
    }
  },
  // Cross-functional
  {
    old: {
      title: 'Data Literacy cho Leaders',
      description: 'Hiểu & sử dụng data: analytics basics, visualization, data-driven decisions'
    },
    new: {
      title: 'Hiểu Biết Dữ Liệu cho Lãnh Đạo',
      description: 'Hiểu & sử dụng dữ liệu: cơ bản phân tích, trực quan hóa, quyết định dựa trên dữ liệu'
    }
  }
];

const roadmapPath = path.join(__dirname, 'lib/roadmap.ts');
let content = fs.readFileSync(roadmapPath, 'utf-8');

let updatedCount = 0;

// Apply all translations
translations.forEach(({ old, new: newText }) => {
  // Escape special regex characters
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const oldTitle = escapeRegex(old.title);
  const oldDesc = escapeRegex(old.description);

  // Replace title
  const titleRegex = new RegExp(`title: '${oldTitle}'`, 'g');
  if (content.match(titleRegex)) {
    content = content.replace(titleRegex, `title: '${newText.title}'`);
    console.log(`✅ Updated title: ${old.title} → ${newText.title}`);
    updatedCount++;
  }

  // Replace description
  const descRegex = new RegExp(`description: '${oldDesc}'`, 'g');
  if (content.match(descRegex)) {
    content = content.replace(descRegex, `description: '${newText.description}'`);
    console.log(`✅ Updated description for: ${newText.title}`);
  }
});

// Write back
fs.writeFileSync(roadmapPath, content, 'utf-8');

console.log('\n' + '='.repeat(60));
console.log(`✅ Total updated: ${updatedCount} learning topics`);
console.log('='.repeat(60));
