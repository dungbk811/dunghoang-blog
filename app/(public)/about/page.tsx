import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Dung Hoang',
  description: 'Thông tin về Dung Hoang - COO',
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Về tôi
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
          <p>
            Xin chào! Tôi là <strong>Dung Hoang</strong>, hiện đang là COO (Chief Operating Officer)
            tại một công ty công nghệ.
          </p>
          <p>
            Với niềm đam mê về công nghệ và quản lý, tôi đã trải qua nhiều vai trò khác nhau
            trong ngành IT, từ developer đến các vị trí quản lý cao cấp.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Công việc hiện tại</h2>
          <p>
            Với vai trò COO, tôi chịu trách nhiệm về:
          </p>
          <ul>
            <li>Quản lý vận hành công ty</li>
            <li>Xây dựng và phát triển đội ngũ</li>
            <li>Tối ưu hóa quy trình làm việc</li>
            <li>Phát triển chiến lược kinh doanh</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Mục tiêu của blog</h2>
          <p>
            Trang blog này được tạo ra với mục đích:
          </p>
          <ul>
            <li><strong>Chia sẻ kiến thức</strong>: Những gì tôi đang học, đã học và sắp học trong IT</li>
            <li><strong>Kinh nghiệm công việc</strong>: Chia sẻ về vai trò COO và quản lý trong tech</li>
            <li><strong>Định hướng nghề nghiệp</strong>: Giúp những bạn trẻ tìm được hướng đi phù hợp</li>
            <li><strong>Cập nhật liên tục</strong>: Xây dựng và chia sẻ kiến thức theo thời gian</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Kỹ năng & Kiến thức</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Technical</h3>
              <ul>
                <li>Software Development</li>
                <li>System Architecture</li>
                <li>Cloud Technologies</li>
                <li>Project Management</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Management</h3>
              <ul>
                <li>Team Building</li>
                <li>Operations Management</li>
                <li>Business Strategy</li>
                <li>Change Management</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Liên hệ</h2>
          <p>
            Trang này được cập nhật thường xuyên khi tôi học được hoặc làm được điều gì mới.
            Nếu bạn có câu hỏi hoặc muốn trao đổi, đừng ngại liên hệ với tôi qua:
          </p>
          <ul>
            <li>Điện thoại: <a href="tel:0977096665">0977 096 665</a></li>
            <li>Email: <a href="mailto:dungbk811@gmail.com">dungbk811@gmail.com</a></li>
            <li>LinkedIn: <a href="https://linkedin.com/in/dung-hoang-18092654" target="_blank" rel="noopener noreferrer">Dung Hoang</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
