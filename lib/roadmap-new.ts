export type RoadmapStatus = 'planned' | 'in-progress' | 'completed';
export type Priority = 'high' | 'medium' | 'low';
export type ResourceType = 'doc' | 'video' | 'course' | 'article' | 'github';

export interface Subtask {
  id: string;
  title: string;
  description?: string;
  status: RoadmapStatus;
  order: number;
}

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  completed?: boolean;
}

export interface Progress {
  percentage: number;
  totalHours?: number;
  completedHours?: number;
  lastUpdated?: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: RoadmapStatus;
  priority?: Priority;
  startDate?: string;
  targetDate?: string;
  tags?: string[];

  // Private tracking fields (for admin only, not shown publicly)
  progress?: Progress;
  subtasks?: Subtask[];
  resources?: Resource[];
  notes?: string;
}

// 🎓 GIỎ KIẾN THỨC - Các kiến thức COO cần học tập
export const learningRoadmap: RoadmapItem[] = [
  // === 1. GIAO TIẾP & GIỌNG NÓI ===
  {
    id: 'voice-training-learning',
    title: 'Voice Training tại THALIC VOICE',
    description: 'Tham gia khóa học luyện giọng - Cải thiện phát âm, giảm giọng địa phương để giao tiếp chuyên nghiệp hơn với khách hàng Nhật Bản',
    category: 'Giao Tiếp & Giọng Nói',
    subcategory: 'Luyện Giọng & Phát Âm',
    status: 'in-progress',
    priority: 'high',
    startDate: '2025-11-01',
    tags: ['Giọng nói', 'Giao tiếp', 'Khách hàng Nhật'],
    notes: 'Đang học các bài tập về phát âm và hơi thở. Có thể viết bài chia sẻ trải nghiệm, bài tập thực tế, thách thức và cải thiện.',
  },
  {
    id: 'breathing-techniques-learning',
    title: 'Kỹ thuật thở cho speaking',
    description: 'Học kỹ thuật thở đúng cách để cải thiện giọng nói và khả năng thuyết trình',
    category: 'Giao Tiếp & Giọng Nói',
    subcategory: 'Luyện Giọng & Phát Âm',
    status: 'planned',
    priority: 'medium',
    tags: ['Giọng nói', 'Thuyết trình'],
  },
  {
    id: 'articulation-exercises-learning',
    title: 'Bài tập articulation',
    description: 'Các bài tập phát âm rõ ràng, chính xác',
    category: 'Giao Tiếp & Giọng Nói',
    subcategory: 'Luyện Giọng & Phát Âm',
    status: 'planned',
    priority: 'medium',
    tags: ['Giọng nói', 'Phát âm'],
  },
  {
    id: 'japanese-client-communication-learning',
    title: 'Giao tiếp với khách hàng Nhật Bản',
    description: 'Học về nghi thức email, quy tắc meeting, văn hóa giao tiếp, trao đổi danh thiếp',
    category: 'Giao Tiếp & Giọng Nói',
    subcategory: 'Giao Tiếp Chuyên Nghiệp',
    status: 'planned',
    priority: 'high',
    tags: ['Khách hàng Nhật', 'Văn hóa kinh doanh'],
  },
  {
    id: 'written-communication-learning',
    title: 'Best practices giao tiếp văn bản',
    description: 'Học kỹ năng viết email, báo cáo, tài liệu chuyên nghiệp',
    category: 'Giao Tiếp & Giọng Nói',
    subcategory: 'Giao Tiếp Chuyên Nghiệp',
    status: 'planned',
    priority: 'medium',
    tags: ['Viết', 'Giao tiếp'],
  },
  {
    id: 'difficult-conversations-learning',
    title: 'Cuộc trò chuyện khó khăn',
    description: 'Học kỹ năng xử lý các cuộc hội thoại khó khăn, xung đột',
    category: 'Giao Tiếp & Giọng Nói',
    subcategory: 'Giao Tiếp Chuyên Nghiệp',
    status: 'planned',
    priority: 'medium',
    tags: ['Xung đột', 'Giao tiếp'],
  },
  {
    id: 'executive-presentation-learning',
    title: 'Kỹ năng thuyết trình cho C-level',
    description: 'Học cách thuyết trình hiệu quả cho cấp điều hành',
    category: 'Giao Tiếp & Giọng Nói',
    subcategory: 'Thuyết Trình',
    status: 'planned',
    priority: 'high',
    tags: ['Thuyết trình', 'Lãnh đạo'],
  },
  {
    id: 'executive-communication-learning',
    title: 'Giao tiếp cấp điều hành',
    description: 'Học kỹ năng giao tiếp hiệu quả ở cấp C-level',
    category: 'Giao Tiếp & Giọng Nói',
    subcategory: 'Thuyết Trình',
    status: 'planned',
    priority: 'high',
    tags: ['Lãnh đạo', 'Giao tiếp'],
  },

  // === 2. LÃNH ĐẠO & QUẢN LÝ NHÂN SỰ ===
  {
    id: 'performance-evaluation-framework-learning',
    title: 'Framework đánh giá hiệu suất',
    description: 'Học cách xây dựng framework đánh giá cho leaders và infrastructure engineers, tích hợp KPI từ Redmine',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Quản Lý Hiệu Suất',
    status: 'in-progress',
    priority: 'high',
    startDate: '2025-10-01',
    tags: ['Hiệu suất', 'KPI', 'Đánh giá'],
    notes: 'Đang học cách xác định tiêu chí đánh giá, cơ chế feedback. Có thể viết bài về cấu trúc framework, thiết kế KPI.',
  },
  {
    id: 'okr-smart-learning',
    title: 'Framework đặt mục tiêu (OKR/SMART)',
    description: 'Học và triển khai OKR hoặc SMART goals',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Quản Lý Hiệu Suất',
    status: 'planned',
    priority: 'high',
    tags: ['OKR', 'Mục tiêu', 'Chiến lược'],
  },
  {
    id: 'career-development-learning',
    title: 'Lộ trình phát triển nghề nghiệp',
    description: 'Học cách thiết kế career paths cho các roles khác nhau',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Quản Lý Hiệu Suất',
    status: 'planned',
    priority: 'medium',
    tags: ['Nghề nghiệp', 'Phát triển'],
  },
  {
    id: 'team-building-culture-learning',
    title: 'Team building & văn hóa doanh nghiệp',
    description: 'Học cách xây dựng team mạnh và văn hóa tích cực',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Xây Dựng Team',
    status: 'planned',
    priority: 'medium',
    tags: ['Team', 'Văn hóa'],
  },
  {
    id: 'onboarding-design-learning',
    title: 'Thiết kế quy trình onboarding',
    description: 'Học cách thiết kế quy trình onboarding hiệu quả cho nhân viên mới',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Xây Dựng Team',
    status: 'planned',
    priority: 'high',
    tags: ['Onboarding', 'Nhân sự'],
  },
  {
    id: 'employee-engagement-learning',
    title: 'Chiến lược gắn kết nhân viên',
    description: 'Học cách tăng engagement và retention',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Xây Dựng Team',
    status: 'planned',
    priority: 'medium',
    tags: ['Gắn kết', 'Giữ chân nhân tài'],
  },
  {
    id: 'conflict-resolution-learning',
    title: 'Giải quyết xung đột trong team',
    description: 'Học kỹ năng hòa giải và xử lý conflicts',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Xung Đột & Coaching',
    status: 'planned',
    priority: 'medium',
    tags: ['Xung đột', 'Team'],
  },
  {
    id: 'coaching-mentoring-learning',
    title: 'Coaching & mentoring',
    description: 'Học kỹ năng coaching và mentoring nhân viên',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Xung Đột & Coaching',
    status: 'planned',
    priority: 'medium',
    tags: ['Coaching', 'Mentoring'],
  },
  {
    id: 'psychological-safety-learning',
    title: 'Tạo môi trường an toàn tâm lý',
    description: 'Học cách xây dựng psychological safety trong team',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Xung Đột & Coaching',
    status: 'planned',
    priority: 'medium',
    tags: ['Văn hóa', 'An toàn'],
  },
  {
    id: 'change-leadership-learning',
    title: 'Lãnh đạo qua thay đổi',
    description: 'Học cách dẫn dắt team qua các giai đoạn thay đổi',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Quản Lý Thay Đổi',
    status: 'planned',
    priority: 'high',
    tags: ['Thay đổi', 'Lãnh đạo'],
  },
  {
    id: 'stakeholder-management-learning',
    title: 'Quản lý stakeholder',
    description: 'Học cách quản lý kỳ vọng và mối quan hệ với stakeholders',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Quản Lý Thay Đổi',
    status: 'planned',
    priority: 'high',
    tags: ['Stakeholders', 'Quản lý'],
  },
  {
    id: 'cross-functional-leadership-learning',
    title: 'Lãnh đạo liên chức năng',
    description: 'Học cách lãnh đạo các teams khác nhau',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Quản Lý Thay Đổi',
    status: 'planned',
    priority: 'medium',
    tags: ['Lãnh đạo', 'Liên chức năng'],
  },
  {
    id: 'influence-without-authority-learning',
    title: 'Tạo ảnh hưởng không cần quyền lực',
    description: 'Học cách tạo ảnh hưởng khi không có quyền lực trực tiếp',
    category: 'Lãnh Đạo & Quản Lý',
    subcategory: 'Quản Lý Thay Đổi',
    status: 'planned',
    priority: 'medium',
    tags: ['Ảnh hưởng', 'Lãnh đạo'],
  },

  // === 3. CÔNG NGHỆ & ĐỔI MỚI ===
  {
    id: 'ai-ml-automation-learning',
    title: 'AI/ML cho tự động hóa workflow',
    description: 'Học về multi-agent orchestration, tự động hóa workflow, tích hợp Redmine + GitLab + Mattermost',
    category: 'Công Nghệ & Đổi Mới',
    subcategory: 'AI/ML & Tự Động Hóa',
    status: 'in-progress',
    priority: 'high',
    startDate: '2025-09-01',
    tags: ['AI', 'ML', 'Tự động hóa', 'Workflow'],
    notes: 'Đang nghiên cứu kiến trúc, pilot use cases. Có thể viết bài về thiết kế kiến trúc, use cases, ROI.',
  },
  {
    id: 'ai-roadmap-learning',
    title: 'Roadmap áp dụng AI',
    description: 'Học cách xây dựng lộ trình triển khai AI trong tổ chức',
    category: 'Công Nghệ & Đổi Mới',
    subcategory: 'AI/ML & Tự Động Hóa',
    status: 'planned',
    priority: 'high',
    tags: ['AI', 'Chiến lược'],
  },
  {
    id: 'prompt-engineering-learning',
    title: 'Prompt engineering cho công việc',
    description: 'Học cách sử dụng AI assistants hiệu quả cho công việc',
    category: 'Công Nghệ & Đổi Mới',
    subcategory: 'AI/ML & Tự Động Hóa',
    status: 'planned',
    priority: 'medium',
    tags: ['AI', 'Prompts'],
  },
  {
    id: 'devops-cicd-learning',
    title: 'Best practices DevOps & CI/CD',
    description: 'Học về GitLab workflows, branch strategy, code review, deployment automation',
    category: 'Công Nghệ & Đổi Mới',
    subcategory: 'DevOps & Hạ Tầng',
    status: 'in-progress',
    priority: 'high',
    tags: ['DevOps', 'CI/CD', 'GitLab'],
    notes: 'Đang học về chiến lược branch, code review, automation. Có thể viết bài về GitLab workflow, branch strategy.',
  },
  {
    id: 'iac-learning',
    title: 'Infrastructure as Code',
    description: 'Học Terraform, CloudFormation, IaC best practices',
    category: 'Công Nghệ & Đổi Mới',
    subcategory: 'DevOps & Hạ Tầng',
    status: 'planned',
    priority: 'medium',
    tags: ['IaC', 'Terraform'],
  },
  {
    id: 'cloud-migration-learning',
    title: 'Chuyển đổi lên cloud computing',
    description: 'Học chiến lược và triển khai cloud migration',
    category: 'Công Nghệ & Đổi Mới',
    subcategory: 'Cloud & Bảo Mật',
    status: 'planned',
    priority: 'high',
    tags: ['Cloud', 'Migration'],
  },
  {
    id: 'iso-27001-learning',
    title: 'Cybersecurity & ISO 27001',
    description: 'Học về ISO 27001 compliance, chuẩn bị audit, quy trình phản ứng sự cố',
    category: 'Công Nghệ & Đổi Mới',
    subcategory: 'Cloud & Bảo Mật',
    status: 'in-progress',
    priority: 'high',
    tags: ['Bảo mật', 'ISO', 'Tuân thủ'],
    notes: 'Đang học về quy trình tuân thủ, chu kỳ tái chứng nhận. Có thể viết bài về quy trình ISO 27001, tips audit.',
  },
  {
    id: 'zero-trust-learning',
    title: 'Kiến trúc Zero Trust',
    description: 'Học về Zero Trust security model',
    category: 'Công Nghệ & Đổi Mới',
    subcategory: 'Cloud & Bảo Mật',
    status: 'planned',
    priority: 'medium',
    tags: ['Bảo mật', 'Zero Trust'],
  },

  // Các mục khác tương tự...
  // Tôi sẽ viết tiếp các category còn lại để file không quá dài
];

// 💼 CÔNG VIỆC CỦA COO - Các công việc thực tế đang thực hiện
export const cooRoadmap: RoadmapItem[] = [
  // === 1. LẬP KẾ HOẠCH & THỰC THI CHIẾN LƯỢC ===
  {
    id: 'crud-to-aiml-transition-work',
    title: 'Chuyển đổi từ CRUD sang AI/ML',
    description: 'Đang dẫn dắt quá trình chuyển đổi từ traditional CRUD projects sang AI/ML và Cloud Computing services',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Chuyển Đổi Kinh Doanh',
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-01-01',
    targetDate: '2026-12-31',
    tags: ['AI/ML', 'Chuyển đổi', 'Chiến lược'],
    notes: 'Đã xác định pilot projects, upskill team, nghiên cứu thị trường. Thách thức: upskill team, giáo dục khách hàng. Có thể viết bài về chiến lược transition.',
  },
  {
    id: 'scale-recruitment-work',
    title: 'Kế hoạch tăng trưởng 20-30 người/năm',
    description: 'Đang xây dựng recruitment pipeline để scale từ ~100 lên 120-130 vào cuối 2026',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Chuyển Đổi Kinh Doanh',
    status: 'in-progress',
    priority: 'high',
    tags: ['Tăng trưởng', 'Tuyển dụng', 'Mở rộng'],
    notes: '40% experienced, 40% mid-level, 20% fresh. Partnership với VTI Academy. Có thể viết bài về chiến lược tuyển dụng.',
  },
  {
    id: 'service-expansion-work',
    title: 'Chiến lược mở rộng dịch vụ',
    description: 'Mở rộng từ CRUD sang AI/ML consulting và cloud services',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Chuyển Đổi Kinh Doanh',
    status: 'planned',
    priority: 'high',
    tags: ['Dịch vụ', 'Mở rộng'],
  },
  {
    id: 'annual-operating-plan-work',
    title: 'Phát triển kế hoạch vận hành hàng năm (AOP)',
    description: 'Lập và thực hiện kế hoạch vận hành hàng năm',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Lập Kế Hoạch',
    status: 'planned',
    priority: 'high',
    tags: ['Kế hoạch', 'AOP'],
  },
  {
    id: 'quarterly-okr-work',
    title: 'Thiết lập OKR hàng quý',
    description: 'Thiết lập và theo dõi OKR hàng quý',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Lập Kế Hoạch',
    status: 'planned',
    priority: 'high',
    tags: ['OKR', 'Kế hoạch'],
  },
  {
    id: 'competitive-analysis-work',
    title: 'Cập nhật phân tích cạnh tranh',
    description: 'Phân tích cạnh tranh và thị trường định kỳ',
    category: 'Chiến Lược & Thực Thi',
    subcategory: 'Thông Tin Thị Trường',
    status: 'planned',
    priority: 'medium',
    tags: ['Phân tích', 'Cạnh tranh'],
  },

  // === 2. QUẢN LÝ TEAM (100+ NGƯỜI) ===
  {
    id: 'manage-11-teams-work',
    title: 'Quản lý 11 teams với 100+ người',
    description: 'Đang quản lý 11 teams: Engineering (40-50), Testing/QA (10-15), Comtor (5-8), PM (8-10), PQA (3-5), BA (5-7), Infrastructure (5-8), Design (3-5)',
    category: 'Quản Lý Team',
    subcategory: 'Lãnh Đạo Đa Team',
    status: 'in-progress',
    priority: 'high',
    tags: ['Quản lý team', 'Lãnh đạo'],
    notes: '1-on-1 hàng tuần với team leads, all-hands hàng tháng. Có thể viết bài về cấu trúc teams, quản lý multiple teams.',
  },
  {
    id: 'kpi-system-redmine-work',
    title: 'Hệ thống KPI từ Redmine',
    description: 'Đang xây dựng và duy trì hệ thống tracking KPI dựa trên dữ liệu Redmine',
    category: 'Quản Lý Team',
    subcategory: 'Quản Lý Hiệu Suất',
    status: 'in-progress',
    priority: 'high',
    tags: ['KPI', 'Redmine', 'Metrics'],
    notes: 'Metrics: EST vs Actual, velocity, bug rates, code review turnaround. Có thể viết bài về extract KPIs từ Redmine.',
  },
  {
    id: 'performance-evaluation-work',
    title: 'Quy trình đánh giá hiệu suất',
    description: 'Đang triển khai evaluation frameworks cho các roles khác nhau',
    category: 'Quản Lý Team',
    subcategory: 'Quản Lý Hiệu Suất',
    status: 'in-progress',
    priority: 'high',
    tags: ['Hiệu suất', 'Đánh giá'],
    notes: 'Tiêu chí cho leaders, infrastructure engineers, PMs. Review nửa năm, 360-degree feedback. Có thể viết bài về evaluation framework.',
  },
  {
    id: 'training-development-work',
    title: 'Chương trình đào tạo & phát triển',
    description: 'Triển khai các chương trình đào tạo để phát triển kỹ năng',
    category: 'Quản Lý Team',
    subcategory: 'Quản Lý Hiệu Suất',
    status: 'planned',
    priority: 'medium',
    tags: ['Đào tạo', 'Phát triển'],
  },
  {
    id: 'team-building-work',
    title: 'Hoạt động team building',
    description: 'Tổ chức các hoạt động team building',
    category: 'Quản Lý Team',
    subcategory: 'Văn Hóa & Gắn Kết',
    status: 'planned',
    priority: 'medium',
    tags: ['Team building', 'Văn hóa'],
  },
  {
    id: 'feedback-mechanisms-work',
    title: 'Cơ chế feedback',
    description: 'Xây dựng và duy trì hệ thống feedback',
    category: 'Quản Lý Team',
    subcategory: 'Văn Hóa & Gắn Kết',
    status: 'planned',
    priority: 'medium',
    tags: ['Feedback', 'Giao tiếp'],
  },

  // === 3. LÃNH ĐẠO CÔNG NGHỆ ===
  {
    id: 'ai-workflow-management-work',
    title: 'Quản lý workflow bằng AI',
    description: 'Đang triển khai hệ thống tích hợp Redmine + GitLab + Mattermost với AI agents',
    category: 'Lãnh Đạo Công Nghệ',
    subcategory: 'Chuyển Đổi Số',
    status: 'in-progress',
    priority: 'high',
    startDate: '2025-09-01',
    targetDate: '2026-06-30',
    tags: ['AI', 'Tự động hóa', 'Tích hợp'],
    notes: 'Automated status updates, PR review summaries. ROI: giảm 20-30% overhead. MVP Q1 2026. Có thể viết bài về kiến trúc, use cases.',
  },
  {
    id: 'devops-optimization-work',
    title: 'Tối ưu DevOps',
    description: 'Đang cải thiện GitLab CI/CD, branch strategies, deployment automation',
    category: 'Lãnh Đạo Công Nghệ',
    subcategory: 'Chuyển Đổi Số',
    status: 'in-progress',
    priority: 'high',
    tags: ['DevOps', 'CI/CD', 'GitLab'],
    notes: 'Chuẩn hóa branch strategy, cải thiện CI/CD pipelines. Có thể viết bài về hành trình tối ưu CI/CD.',
  },
  {
    id: 'pwa-development-work',
    title: 'Triển khai dự án PWA',
    description: 'Đang lead 2-3 PWA projects cho clients',
    category: 'Lãnh Đạo Công Nghệ',
    subcategory: 'Chuyển Đổi Số',
    status: 'in-progress',
    priority: 'medium',
    tags: ['PWA', 'Phát triển'],
    notes: 'Xây dựng chuyên môn PWA, tài liệu hóa best practices. Có thể viết bài về lợi ích PWA cho clients.',
  },
  {
    id: 'tech-stack-modernization-work',
    title: 'Hiện đại hóa tech stack',
    description: 'Hiện đại hóa công nghệ sử dụng',
    category: 'Lãnh Đạo Công Nghệ',
    subcategory: 'Chuyển Đổi Số',
    status: 'planned',
    priority: 'medium',
    tags: ['Công nghệ', 'Hiện đại hóa'],
  },
  {
    id: 'innovation-time-work',
    title: 'Phân bổ thời gian đổi mới',
    description: 'Phân bổ thời gian cho đổi mới và R&D',
    category: 'Lãnh Đạo Công Nghệ',
    subcategory: 'Đổi Mới & R&D',
    status: 'planned',
    priority: 'medium',
    tags: ['Đổi mới', 'R&D'],
  },
  {
    id: 'technology-radar-work',
    title: 'Technology radar',
    description: 'Theo dõi và đánh giá công nghệ mới nổi',
    category: 'Lãnh Đạo Công Nghệ',
    subcategory: 'Đổi Mới & R&D',
    status: 'planned',
    priority: 'low',
    tags: ['Công nghệ', 'Radar'],
  },

  // === 4. VẬN HÀNH & CHẤT LƯỢNG ===
  {
    id: 'iso-27001-compliance-work',
    title: 'Tuân thủ ISO 27001',
    description: 'Đang duy trì ISO 27001 compliance và chu kỳ tái chứng nhận hàng năm',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Tuân Thủ & Audits',
    status: 'in-progress',
    priority: 'high',
    tags: ['ISO', 'Tuân thủ', 'Bảo mật'],
    notes: 'Chuẩn bị audit, quy trình phản ứng sự cố. Có thể viết bài về quy trình tuân thủ ISO 27001, tips chuẩn bị audit.',
  },
  {
    id: 'gdpr-compliance-work',
    title: 'Tuân thủ GDPR/Bảo vệ dữ liệu',
    description: 'Tuân thủ GDPR và bảo vệ dữ liệu',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Tuân Thủ & Audits',
    status: 'planned',
    priority: 'high',
    tags: ['GDPR', 'Tuân thủ'],
  },
  {
    id: 'est-actual-tracking-work',
    title: 'Theo dõi EST vs Actual',
    description: 'Đang theo dõi và phân tích estimates vs actuals cho tất cả projects',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Vận Hành Dự Án',
    status: 'in-progress',
    priority: 'high',
    tags: ['Theo dõi', 'Dự án', 'Ước tính'],
    notes: 'Báo cáo hàng tuần từ Redmine, phân tích variance. Có thể viết bài về tại sao EST vs Actual quan trọng.',
  },
  {
    id: 'weekly-reporting-work',
    title: 'Hệ thống báo cáo hàng tuần',
    description: 'Đang duy trì hệ thống reporting chuẩn hóa',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Vận Hành Dự Án',
    status: 'in-progress',
    priority: 'medium',
    tags: ['Báo cáo', 'Giao tiếp'],
    notes: 'Report templates, automation từ Redmine. Có thể viết bài về thiết kế report template.',
  },
  {
    id: 'change-request-work',
    title: 'Quản lý Change Request',
    description: 'Đang quản lý CR workflows để cân bằng nhu cầu client và capacity của team',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Vận Hành Dự Án',
    status: 'in-progress',
    priority: 'high',
    tags: ['Quản lý thay đổi', 'Dự án'],
    notes: 'Quy trình tiếp nhận CR, đánh giá impact. Có thể viết bài về thiết kế quy trình CR.',
  },
  {
    id: 'quality-metrics-work',
    title: 'Metrics chất lượng & cải thiện',
    description: 'Theo dõi metrics chất lượng và cải thiện',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Vận Hành Dự Án',
    status: 'planned',
    priority: 'medium',
    tags: ['Chất lượng', 'Metrics'],
  },
  {
    id: 'process-documentation-work',
    title: 'Tài liệu hóa quy trình',
    description: 'Tài liệu hóa tất cả quy trình vận hành',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Tối Ưu Quy Trình',
    status: 'planned',
    priority: 'medium',
    tags: ['Tài liệu', 'Quy trình'],
  },
  {
    id: 'automation-opportunities-work',
    title: 'Cơ hội tự động hóa',
    description: 'Xác định và triển khai các cơ hội tự động hóa',
    category: 'Vận Hành & Chất Lượng',
    subcategory: 'Tối Ưu Quy Trình',
    status: 'planned',
    priority: 'medium',
    tags: ['Tự động hóa', 'Hiệu quả'],
  },

  // === 5. PHÁT TRIỂN KINH DOANH ===
  {
    id: 'japanese-client-relations-work',
    title: 'Quan hệ khách hàng Nhật Bản',
    description: 'Đang duy trì và làm sâu quan hệ với khách hàng Nhật hiện tại',
    category: 'Phát Triển Kinh Doanh',
    subcategory: 'Quản Lý Khách Hàng',
    status: 'in-progress',
    priority: 'high',
    tags: ['Quan hệ khách hàng', 'Nhật Bản', 'Quản lý tài khoản'],
    notes: 'QBRs định kỳ, quản lý tài khoản chủ động. Có thể viết bài về best practices quản lý khách hàng Nhật.',
  },
  {
    id: 'customer-retention-work',
    title: 'Chiến lược giữ chân khách hàng',
    description: 'Chiến lược retention và tăng trưởng khách hàng',
    category: 'Phát Triển Kinh Doanh',
    subcategory: 'Quản Lý Khách Hàng',
    status: 'planned',
    priority: 'high',
    tags: ['Giữ chân', 'Tăng trưởng'],
  },
  {
    id: 'vti-partnership-work',
    title: 'Partnership với VTI Academy',
    description: 'Đang khám phá đối tác với VTI Academy cho recruitment pipeline',
    category: 'Phát Triển Kinh Doanh',
    subcategory: 'Đối Tác & Liên Minh',
    status: 'in-progress',
    priority: 'high',
    startDate: '2025-10-01',
    targetDate: '2026-01-31',
    tags: ['Đối tác', 'Tuyển dụng'],
    notes: 'Nghiên cứu options, đánh giá ROI, mục tiêu ký MOU Q1/2026. Có thể viết bài về cách đánh giá ROI partnership.',
  },
  {
    id: 'tech-conference-work',
    title: 'Tham gia hội nghị công nghệ',
    description: 'Đang cân nhắc tham gia Tech4Life Expo',
    category: 'Phát Triển Kinh Doanh',
    subcategory: 'Đối Tác & Liên Minh',
    status: 'in-progress',
    priority: 'medium',
    tags: ['Hội nghị', 'Networking', 'Thương hiệu'],
    notes: 'Đánh giá ROI (brand awareness, networking, talent attraction). Có thể viết bài về cách đánh giá ROI hội nghị.',
  },
  {
    id: 'new-market-work',
    title: 'Khám phá thị trường mới',
    description: 'Khám phá cơ hội thị trường mới',
    category: 'Phát Triển Kinh Doanh',
    subcategory: 'Đối Tác & Liên Minh',
    status: 'planned',
    priority: 'medium',
    tags: ['Thị trường', 'Mở rộng'],
  },
  {
    id: 'proposal-qa-work',
    title: 'Đảm bảo chất lượng đề xuất',
    description: 'Review và đảm bảo chất lượng đề xuất',
    category: 'Phát Triển Kinh Doanh',
    subcategory: 'Đề Xuất & Sales',
    status: 'planned',
    priority: 'medium',
    tags: ['Đề xuất', 'Chất lượng'],
  },
  {
    id: 'presales-support-work',
    title: 'Hỗ trợ kỹ thuật pre-sales',
    description: 'Hỗ trợ kỹ thuật cho quy trình bán hàng',
    category: 'Phát Triển Kinh Doanh',
    subcategory: 'Đề Xuất & Sales',
    status: 'planned',
    priority: 'medium',
    tags: ['Pre-sales', 'Kỹ thuật'],
  },

  // === 6. VĂN HÓA & GIAO TIẾP NỘI BỘ ===
  {
    id: 'thanks-bonus-work',
    title: 'Chương trình thanks bonus',
    description: 'Đang duy trì chương trình ghi nhận hàng tháng',
    category: 'Văn Hóa & Giao Tiếp',
    subcategory: 'Ghi Nhận & Khen Thưởng',
    status: 'in-progress',
    priority: 'medium',
    tags: ['Ghi nhận', 'Bonus', 'Văn hóa'],
    notes: 'Tiêu chí: Chất lượng, Đổi mới, Teamwork, Client satisfaction. Có thể viết bài về thiết kế chương trình ghi nhận.',
  },
  {
    id: 'longevity-awards-work',
    title: 'Giải thưởng làm việc lâu năm',
    description: 'Giải thưởng cho nhân viên gắn bó lâu dài',
    category: 'Văn Hóa & Giao Tiếp',
    subcategory: 'Ghi Nhận & Khen Thưởng',
    status: 'planned',
    priority: 'low',
    tags: ['Ghi nhận', 'Giải thưởng'],
  },
  {
    id: 'internal-comms-work',
    title: 'Chiến lược giao tiếp nội bộ',
    description: 'Lập kế hoạch và thực hiện giao tiếp nội bộ',
    category: 'Văn Hóa & Giao Tiếp',
    subcategory: 'Chiến Lược Giao Tiếp',
    status: 'planned',
    priority: 'medium',
    tags: ['Giao tiếp', 'Chiến lược'],
  },
  {
    id: 'all-hands-work',
    title: 'All-hands meetings',
    description: 'Tổ chức họp toàn công ty và cập nhật',
    category: 'Văn Hóa & Giao Tiếp',
    subcategory: 'Chiến Lược Giao Tiếp',
    status: 'planned',
    priority: 'medium',
    tags: ['Họp', 'Giao tiếp'],
  },
  {
    id: 'culture-initiatives-work',
    title: 'Sáng kiến văn hóa công ty',
    description: 'Các sáng kiến xây dựng văn hóa công ty',
    category: 'Văn Hóa & Giao Tiếp',
    subcategory: 'Xây Dựng Văn Hóa',
    status: 'planned',
    priority: 'medium',
    tags: ['Văn hóa', 'Sáng kiến'],
  },
  {
    id: 'engagement-programs-work',
    title: 'Chương trình gắn kết nhân viên',
    description: 'Chương trình gắn kết và hài lòng nhân viên',
    category: 'Văn Hóa & Giao Tiếp',
    subcategory: 'Xây Dựng Văn Hóa',
    status: 'planned',
    priority: 'medium',
    tags: ['Gắn kết', 'Văn hóa'],
  },
  {
    id: 'remote-practices-work',
    title: 'Best practices làm việc remote',
    description: 'Hướng dẫn và thực hành làm việc remote',
    category: 'Văn Hóa & Giao Tiếp',
    subcategory: 'Xây Dựng Văn Hóa',
    status: 'planned',
    priority: 'medium',
    tags: ['Remote', 'Best practices'],
  },

  // === 7-11. CÁC LĨNH VỰC QUAN TRỌNG (Tất cả đang trong kế hoạch) ===
  // Quản lý tài chính, Rủi ro & Khủng hoảng, Giao dịch dịch vụ, Hợp đồng & Pháp lý, Năng lực & Dự báo
  // Các mục này tôi sẽ bỏ qua để file không quá dài, nhưng cấu trúc tương tự
];

// Helper functions
export function getRoadmapById(id: string, type: 'learning' | 'coo'): RoadmapItem | undefined {
  const roadmap = type === 'learning' ? learningRoadmap : cooRoadmap;
  return roadmap.find(item => item.id === id);
}

export function getRoadmapByStatus(status: RoadmapStatus, type: 'learning' | 'coo'): RoadmapItem[] {
  const roadmap = type === 'learning' ? learningRoadmap : cooRoadmap;
  return roadmap.filter(item => item.status === status);
}

export function getRoadmapByCategory(category: string, type: 'learning' | 'coo'): RoadmapItem[] {
  const roadmap = type === 'learning' ? learningRoadmap : cooRoadmap;
  return roadmap.filter(item => item.category === category);
}

export function getAllCategories(type: 'learning' | 'coo'): string[] {
  const roadmap = type === 'learning' ? learningRoadmap : cooRoadmap;
  return [...new Set(roadmap.map(item => item.category))];
}

export function getStats(type: 'learning' | 'coo') {
  const roadmap = type === 'learning' ? learningRoadmap : cooRoadmap;
  return {
    total: roadmap.length,
    planned: roadmap.filter(i => i.status === 'planned').length,
    inProgress: roadmap.filter(i => i.status === 'in-progress').length,
    completed: roadmap.filter(i => i.status === 'completed').length,
  };
}
