import { useEffect, useState } from 'react';
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { TrendingUp, Star, StarHalf, ChevronRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ReactGA from 'react-ga4';
import { DashboardService } from "../../services/dashboard.service";
import Loading from "../../components/loading/Loading";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon path in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const REGION_COORDINATES: { [key: string]: [number, number] } = {
  "กรุงเทพและปริมณฑล": [13.7563, 100.5018],
  "ภาคกลาง": [14.5268, 100.6143],
  "ภาคใต้": [8.6400, 99.4180],
  "ภาคตะวันออก": [12.8222, 101.4499],
  "ภาคเหนือ": [18.7883, 98.9853],
  "ภาคตะวันออกเฉียงเหนือ": [16.4322, 102.8236],
  "ภาคอีสาน": [16.4322, 102.8236],
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const REGION_COLORS = ['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-purple-400', 'bg-pink-400'];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getStatusColor = (status: string) => {
  if (!status) return 'bg-gray-100 text-gray-700';
  const s = status.toLowerCase();
  if (s.includes('สำเร็จ') || s.includes('success') || s.includes('completed')) return 'bg-green-100 text-green-700';
  if (s.includes('ชำระ') || s.includes('paid')) return 'bg-blue-100 text-blue-700';
  if (s.includes('รอ') || s.includes('pending')) return 'bg-orange-100 text-orange-700';
  if (s.includes('คืน') || s.includes('ยกเลิก') || s.includes('cancel') || s.includes('refund')) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

const getReviewLabel = (score: number) => {
  if (score >= 5) return 'ดีเยี่ยม';
  if (score >= 4) return 'ดี';
  if (score >= 3) return 'กลาง';
  if (score >= 2) return 'แย่';
  return 'แย่ที่สุด';
};

const getReviewColor = (score: number) => {
  if (score >= 5) return 'bg-emerald-500';
  if (score >= 4) return 'bg-emerald-300';
  if (score >= 3) return 'bg-yellow-400';
  if (score >= 2) return 'bg-orange-400';
  return 'bg-red-500';
};

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = Array.isArray(user?.roles)
    ? user.roles.some((role: any) => role === "ADMIN" || role?.roleName === "ADMIN")
    : false;

  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState<any>(null);
  const [salesData, setSalesData] = useState<any>(null);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Admin Dashboard" });
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, salesRes] = await Promise.all([
          DashboardService.getOwnerDashboard(),
          DashboardService.getSalesAnalytics()
        ]);
        setDashData(dashRes?.data || dashRes);
        setSalesData(salesRes?.data || salesRes);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading || !dashData || !salesData) {
    return <Loading />;
  }

  // --- Process Data ---
  
  // 1. Chart Data
  const lineChartData = DAYS.map((dayName, index) => {
    const thisW = dashData.weeklyActiveUsersChart?.thisWeek?.find((d: any) => d.dayOfWeek === index)?.totalUsers || 0;
    const lastW = dashData.weeklyActiveUsersChart?.lastWeek?.find((d: any) => d.dayOfWeek === index)?.totalUsers || 0;
    return { name: dayName, thisWeek: thisW, lastWeek: lastW };
  });

  // Calculate total visits from this week chart as fallback
  const totalVisits = dashData.weeklyActiveUsersChart?.thisWeek?.reduce((acc: number, curr: any) => acc + curr.totalUsers, 0) || 0;

  // 2. Pie Data
  const pieData = dashData.orderChannelRate?.map((item: any, idx: number) => ({
    name: item.orderChannel,
    value: item.avg,
    color: COLORS[idx % COLORS.length]
  })) || [];

  // 3. Orders
  const recentOrders = dashData.latestOrder?.map((item: any) => ({
    id: item.orderNo,
    name: item.name,
    status: item.status,
    statusColor: getStatusColor(item.status)
  })) || [];

  // 4. Regional Revenue
  const revenueByArea = salesData.regionalRevenue?.map((item: any, idx: number) => ({
    name: item.geography,
    value: `${item.totalRevenuePercent || 0}%`,
    percent: item.totalRevenuePercent || 0,
    color: REGION_COLORS[idx % REGION_COLORS.length]
  })) || [];

  // 5. Products
  const productsInStock = dashData.products?.map((item: any) => ({
    name: item.productName,
    stock: item.stockQuantity
  })) || [];

  // 6. Reviews
  let avgReview = 0;
  let totalReviewScore = 0;
  let totalReviews = 0;
  
  const reviewsMap = new Map();
  [5,4,3,2,1].forEach(s => reviewsMap.set(s, 0));

  if (dashData.reviews && dashData.reviews.length > 0) {
    dashData.reviews.forEach((r: any) => {
      totalReviewScore += (r.score * r.reviewScore);
      totalReviews += r.reviewScore;
      reviewsMap.set(r.score, r.reviewScore);
    });
    if (totalReviews > 0) {
      avgReview = totalReviewScore / totalReviews;
    }
  }

  const reviewsList = [5, 4, 3, 2, 1].map(score => {
    const count = reviewsMap.get(score);
    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return {
      label: getReviewLabel(score),
      percent: percent,
      color: getReviewColor(score)
    };
  });

  return (
    <div className="flex flex-col h-full bg-white p-6 min-h-screen">
      <div className="mb-6 hidden">
        <HeaderAdmin title="Dashboard" subtitle="" />
      </div>
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">แดชบอร์ด</h1>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#dbeafe] p-6 rounded-xl flex flex-col justify-between">
          <h3 className="text-gray-800 font-semibold mb-2">เยี่ยมชม</h3>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-gray-800">
              {totalVisits.toLocaleString()}
            </span>
            <span className="flex items-center text-emerald-500 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
        <div className="bg-[#fef3c7] p-6 rounded-xl flex flex-col justify-between">
          <h3 className="text-gray-800 font-semibold mb-2">เข้าใช้ตอนนี้</h3>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-gray-800">
              {(dashData.activeUsers || 0).toLocaleString()}
            </span>
            <span className="flex items-center text-emerald-500 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
        <div className="bg-[#d1fae5] p-6 rounded-xl flex flex-col justify-between">
          <h3 className="text-gray-800 font-semibold mb-2">ผู้ใช้ใหม่</h3>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-gray-800">
              {(dashData.newUsers || 0).toLocaleString()}
            </span>
            <span className="flex items-center text-emerald-500 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 mb-8">
        <div className="flex items-center mb-8 text-sm">
          <span className="font-semibold text-gray-800 mr-8">ผู้ใช้งานรายสัปดาห์</span>
          <div className="flex items-center mr-4">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-500">สัปดาห์นี้</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-400 mr-2"></div>
            <span className="text-gray-500">สัปดาห์ที่แล้ว</span>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#d1d5db', fontSize: 12}} />
              <Tooltip cursor={{stroke: '#f3f4f6', strokeWidth: 2}} />
              <Line type="monotone" dataKey="thisWeek" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="lastWeek" stroke="#fb923c" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid 1: Orders and Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800">คำสั่งซื้อล่าสุด</h3>
            <button onClick={() => navigate(isAdmin ? "/owner/ordersMod" : "/moderator/ordersMod")} className="text-sm text-gray-500 flex items-center hover:text-gray-700 transition-colors cursor-pointer border-none bg-transparent">ดูทั้งหมด <ChevronRight className="w-4 h-4 ml-1" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="pb-3 font-semibold text-gray-800">เลขที่คำสั่งซื้อ</th>
                  <th className="pb-3 font-semibold text-gray-800">ชื่อผู้สั่งซื้อ</th>
                  <th className="pb-3 font-semibold text-gray-800">สถานะคำสั่งซื้อ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-100/50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-gray-600">{order.id}</td>
                    <td className="py-4 text-gray-600">{order.name}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400">ไม่มีข้อมูลคำสั่งซื้อ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Source and Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 flex flex-col items-center">
            <h3 className="font-semibold text-gray-800 mb-4 w-full text-center">แหล่งที่มา</h3>
            <div className="h-40 w-full relative mb-6">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">ไม่มีข้อมูล</div>
              )}
            </div>
            <div className="w-full space-y-3 text-sm text-gray-600 px-4">
              {pieData.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center"><div className={`w-2.5 h-2.5 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>{item.name}</div>
                  <span className="font-medium text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by area */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">รายได้ในพื้นที่</h3>
            <div className="w-full h-48 rounded-lg mb-6 overflow-hidden border border-gray-200 z-0 relative">
              <MapContainer
                center={[13.7563, 100.5018]}
                zoom={5}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {revenueByArea.map((area: any, idx: number) => {
                  const coords = REGION_COORDINATES[area.name];
                  if (!coords) return null;
                  return (
                    <Marker key={idx} position={coords}>
                      <Popup>
                        <div className="text-xs">
                          <p className="font-semibold">{area.name}</p>
                          <p>สัดส่วนรายได้: {area.value}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
            <div className="space-y-4 text-xs">
              {revenueByArea.map((area: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-600">{area.name}</span>
                    <span className="text-gray-800 font-semibold">{area.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`${area.color} h-1.5 rounded-full`} style={{ width: `${area.percent}%` }}></div>
                  </div>
                </div>
              ))}
              {revenueByArea.length === 0 && (
                <div className="text-center text-gray-400 mt-4">ไม่มีข้อมูลพื้นที่</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid 2: Stock and Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* Stock */}
        <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 lg:col-span-7">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800">สินค้าในสต็อก</h3>
            <button onClick={() => navigate(isAdmin ? "/owner/stock" : "/moderator/stock")} className="text-sm text-gray-500 flex items-center hover:text-gray-700 transition-colors cursor-pointer border-none bg-transparent">ดูทั้งหมด <ChevronRight className="w-4 h-4 ml-1" /></button>
          </div>
          <table className="w-full text-left text-sm text-gray-700">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-3 font-semibold text-gray-800">ชื่อสินค้า</th>
                <th className="pb-3 font-semibold text-gray-800 text-right">จำนวนคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {productsInStock.map((product: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-100/50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 text-gray-600">{product.name}</td>
                  <td className="py-4 text-right font-medium text-gray-800">{product.stock}</td>
                </tr>
              ))}
              {productsInStock.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-400">ไม่มีข้อมูลสต็อกสินค้า</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reviews */}
        <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 lg:col-span-5">
          <h3 className="font-semibold text-gray-800 mb-6">รีวิวจากลูกค้า</h3>
          <div className="flex items-center mb-8">
            <div className="flex text-amber-400 mr-4">
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              {avgReview > 0 && avgReview < 5 ? <StarHalf className="w-6 h-6 fill-current" /> : <Star className={`w-6 h-6 ${avgReview === 5 ? 'fill-current' : 'text-gray-300'}`} />}
            </div>
            <span className="text-3xl font-extrabold text-gray-800 mr-3">{avgReview.toFixed(1)}</span>
            <span className="text-sm text-gray-500 font-medium">เต็ม 5 ดาว</span>
          </div>
          
          <div className="space-y-4">
            {reviewsList.map((review: any, idx: number) => (
              <div key={idx} className="flex items-center text-sm">
                <span className="w-16 text-gray-600 font-medium">{review.label}</span>
                <div className="flex-1 ml-4 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`${review.color} h-2.5 rounded-full`} style={{ width: `${review.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
