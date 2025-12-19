import { useEffect } from "react";
import { Col, Row, Spin, message } from "antd";
import { CreditCard, Film, Ticket, ShoppingCart } from "lucide-react";
import StatCard from "../components/layouts/StartCard";

// Import Hooks của Redux
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchDashboardData } from "../redux/slices/DashboardSlice";

const DashboardPage = () => {
  const dispatch = useAppDispatch();

  // Lấy toàn bộ state đã được tính toán sẵn từ Redux
  const { stats, topMovies, loading, error } = useAppSelector((state) => state.dashboard);

  // Chỉ gọi Action 1 lần khi trang được load
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Hiển thị lỗi nếu có (tuỳ chọn)
  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KHỐI THỐNG KÊ */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng đơn hàng"
            value={stats.totalBookings.toLocaleString()}
            icon={ShoppingCart}
            color="bg-blue-500"
            subText="Đơn đặt vé"
            subColor="text-blue-600 bg-blue-50"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Vé đã bán"
            value={stats.totalTickets.toLocaleString()}
            icon={Ticket}
            color="bg-indigo-500"
            subText="Tổng vé"
            subColor="text-indigo-600 bg-indigo-50"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Phim hoạt động"
            value={stats.activeMovies.toLocaleString()}
            icon={Film}
            color="bg-rose-500"
            subText="Đang chiếu"
            subColor="text-rose-600 bg-rose-50"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Doanh thu"
            value={`${stats.revenue.toLocaleString()} đ`}
            icon={CreditCard}
            color="bg-emerald-500"
            subText="Tổng thu"
            subColor="text-emerald-600 bg-emerald-50"
          />
        </Col>
      </Row>

      {/* KHỐI PHIM THỊNH HÀNH */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 m-0">Top 3 Phim Doanh Thu Cao Nhất</h3>
        </div>
        <div className="p-2">
          {topMovies.length > 0 ? (
            topMovies.map((movie, index) => (
              <div key={index} className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-5">
                  <div className={`font-bold text-xl w-8 h-8 flex items-center justify-center rounded-lg ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 bg-gray-100'}`}>
                    {index + 1}
                  </div>
                  <img src={movie.poster} alt={movie.title} className="w-14 h-20 object-cover rounded-lg shadow-md bg-gray-200" />
                  <div>
                    <h4 className="font-bold text-gray-800 text-base m-0 mb-1">{movie.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{movie.count} đơn hàng</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-xs text-green-600 font-bold">Top {index + 1}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-600 text-base">
                    {movie.revenue.toLocaleString()} đ
                  </div>
                  <div className="text-xs text-gray-400">Doanh thu</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">Chưa có dữ liệu phim</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;