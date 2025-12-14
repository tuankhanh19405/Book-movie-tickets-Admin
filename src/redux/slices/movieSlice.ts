import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Movie, MovieListResponse } from '../../interface/type';

// =================================================================
// CẤU HÌNH API URL
// Thay đường dẫn này bằng API của bạn (ví dụ: MockAPI, JSON-Server)
// =================================================================
const API_URL = 'https://api-class-o1lo.onrender.com/api/khanhphuong/films';
interface MovieState {
    list: Movie[];
    loading: boolean;
    error: string | null;
}

const initialState: MovieState = {
    list: [],
    loading: false,
    error: null,
};

// --- 1. LẤY DANH SÁCH (GET) ---
export const fetchMovies = createAsyncThunk(
    'movies/fetchMovies',
    async (_, thunkAPI) => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Không thể tải danh sách phim');
            const data = await response.json();

            // Xử lý dữ liệu trả về tùy theo cấu trúc API (Mảng hay Object)
            if (Array.isArray(data)) {
                return data as Movie[];
            } else {
                return (data as MovieListResponse).data;
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// --- 2. THÊM PHIM MỚI (POST) ---
// Dùng Omit để bỏ trường _id vì khi tạo mới Server sẽ tự sinh ra _id
export const createMovie = createAsyncThunk(
    'movies/createMovie',
    async (newMovie: Omit<Movie, '_id'>, thunkAPI) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMovie),
            });

            if (!response.ok) throw new Error('Thêm mới thất bại');
            const data = await response.json();
            return (data.data || data) as Movie;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// --- 3. SỬA THÔNG TIN PHIM (PUT) ---
export const updateMovie = createAsyncThunk(
    'movies/updateMovie',
    async (movieData: Movie, thunkAPI) => {
        try {
            const response = await fetch(`${API_URL}/${movieData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData),
            });

            if (!response.ok) throw new Error('Cập nhật thất bại');
            const data = await response.json();
            return (data.data || data) as Movie;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// --- 4. DỪNG CHIẾU PHIM (PATCH) ---
export const stopShowingMovie = createAsyncThunk(
    'movies/stopShowing',
    async (id: string, thunkAPI) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH', // Hoặc PUT tùy API
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ended' }),
            });

            if (!response.ok) throw new Error('Không thể dừng chiếu');
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// --- SLICE CONFIG ---
const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create
            .addCase(createMovie.fulfilled, (state, action) => {
                // Thêm phim mới vào đầu danh sách
                state.list.unshift(action.payload);
            })

            // Update
            .addCase(updateMovie.fulfilled, (state, action) => {
                const index = state.list.findIndex((m) => m._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })

            // Stop Showing
            .addCase(stopShowingMovie.fulfilled, (state, action) => {
                const index = state.list.findIndex((m) => m._id === action.payload);
                if (index !== -1) {
                    state.list[index].status = 'ended';
                }
            });
    },
});

export default movieSlice.reducer;