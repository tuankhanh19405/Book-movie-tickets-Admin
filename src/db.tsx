import { CalendarClock, Film, LayoutDashboard, Settings, Users } from "lucide-react";

export const initialMovies = [
  {
    id: '1',
    title: 'Đào, Phở và Piano',
    genre: ['History', 'Drama'],
    year: 2024,
    director: 'Phi Tiến Sơn',
    views: 125000,
    status: 'Published',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=100&h=150',
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    genre: ['Sci-Fi', 'Adventure'],
    year: 2024,
    director: 'Denis Villeneuve',
    views: 980000,
    status: 'Published',
    poster: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?auto=format&fit=crop&q=80&w=100&h=150',
  },
  {
    id: '3',
    title: 'Mai',
    genre: ['Romance', 'Drama'],
    year: 2024,
    director: 'Trấn Thành',
    views: 2100000,
    status: 'Published',
    poster: 'https://images.unsplash.com/photo-1511875762315-c773eb98eec0?auto=format&fit=crop&q=80&w=100&h=150',
  },
  {
    id: '4',
    title: 'Kung Fu Panda 4',
    genre: ['Animation', 'Comedy'],
    year: 2024,
    director: 'Mike Mitchell',
    views: 54000,
    status: 'Draft',
    poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=100&h=150',
  },
];

export const initialUsers = [
  { id: '1', name: 'Nguyễn Văn A', email: 'userA@example.com', role: 'Premium', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Trần Thị B', email: 'userB@example.com', role: 'Free', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Lê Văn C', email: 'userC@example.com', role: 'Free', status: 'Banned', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export const menuItems = [
  { key: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
  { key: 'movies', icon: <Film size={20} />, label: 'Quản lý Phim' },
  { key: 'showtime', icon: <CalendarClock size={20} />, label: 'Quản lý lịch chiếu Phim' },
  { key: 'users', icon: <Users size={20} />, label: 'Người dùng' },
  { key: 'settings', icon: <Settings size={20} />, label: 'Cài đặt' },
];
