import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Định nghĩa kiểu dữ liệu (Types)
interface Booking {
    _id: string;
    movie_title: string;
    total_amount: number;
    tickets: any[];
    movie_poster?: string;
}

interface MovieStat {
    title: string;
    revenue: number;
    count: number;
    poster: string;
}

interface DashboardState {
    loading: boolean;
    error: string | null;
    stats: {
        revenue: number;
        totalBookings: number;
        totalTickets: number;
        activeMovies: number;
    };
    topMovies: MovieStat[];
}

const initialState: DashboardState = {
    loading: false,
    error: null,
    stats: {
        revenue: 0,
        totalBookings: 0,
        totalTickets: 0,
        activeMovies: 0,
    },
    topMovies: [],
};

// 2. Async Thunk để gọi API
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("https://api-class-o1lo.onrender.com/api/khanhphuong/bookings");
            // Trả về mảng bookings (dữ liệu thô)
            return response.data.data || [];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Lỗi tải dữ liệu');
        }
    }
);

// 3. Slice & Logic tính toán
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                const bookings: Booking[] = action.payload;

                // --- BẮT ĐẦU LOGIC TÍNH TOÁN (Di chuyển từ Component sang đây) ---

                // 1. Tính tổng quan (Stats)
                const totalRevenue = bookings.reduce((sum, item) => sum + (item.total_amount || 0), 0);
                const totalTickets = bookings.reduce((sum, item) => sum + (item.tickets?.length || 0), 0);
                const uniqueMovies = new Set(bookings.map(b => b.movie_title));

                state.stats = {
                    revenue: totalRevenue,
                    totalBookings: bookings.length,
                    totalTickets: totalTickets,
                    activeMovies: uniqueMovies.size,
                };

                // 2. Tính Top Phim (Trending)
                const movieMap: Record<string, MovieStat> = {};

                bookings.forEach((booking) => {
                    const title = booking.movie_title || "Unknown";
                    if (!movieMap[title]) {
                        movieMap[title] = {
                            title,
                            revenue: 0,
                            count: 0,
                            poster: booking.movie_poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=200",
                        };
                    }
                    movieMap[title].revenue += booking.total_amount || 0;
                    movieMap[title].count += 1;
                });

                // Sắp xếp và lấy Top 3
                state.topMovies = Object.values(movieMap)
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 3);
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;