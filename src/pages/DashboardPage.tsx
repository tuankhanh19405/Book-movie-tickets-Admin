import { Col, Row } from "antd";
import StatCard from "../components/layouts/StartCard";
import { initialMovies } from "../db";
import { CreditCard, Film, PlayCircle, Users } from "lucide-react";

const DashboardPage = () => (
  <div className="space-y-8 animate-fade-in">
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} lg={6}>
        <StatCard title="Tổng phim" value="1,248" icon={Film} color="bg-blue-500" subText="+12%" subColor="text-green-600 bg-green-50" />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard title="Lượt xem" value="890.2K" icon={PlayCircle} color="bg-indigo-500" subText="+5.4%" subColor="text-indigo-600 bg-indigo-50" />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard title="Người dùng mới" value="452" icon={Users} color="bg-rose-500" subText="-1.2%" subColor="text-rose-600 bg-rose-50" />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard title="Doanh thu" value="$23,500" icon={CreditCard} color="bg-emerald-500" subText="+8.5%" subColor="text-emerald-600 bg-emerald-50" />
      </Col>
    </Row>
    {/* Trending Content Block */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800 m-0">Phim thịnh hành</h3>
        </div>
        <div className="p-2">
        {initialMovies.slice(0, 3).map((movie, index) => (
            <div key={movie.id} className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-5">
                <div className={`font-bold text-xl w-8 h-8 flex items-center justify-center rounded-lg ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 bg-gray-100'}`}>{index + 1}</div>
                <img src={movie.poster} alt={movie.title} className="w-14 h-20 object-cover rounded-lg shadow-md" />
                <div>
                <h4 className="font-bold text-gray-800 text-base m-0 mb-1">{movie.title}</h4>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{movie.year}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-xs text-gray-500">{movie.genre[0]}</span>
                </div>
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold text-indigo-600 text-base">{movie.views.toLocaleString()}</div>
            </div>
            </div>
        ))}
        </div>
    </div>
  </div>
);
export default DashboardPage