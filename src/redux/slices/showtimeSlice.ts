import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Showtime } from '../../interface/type';

// API URL
const API_URL = 'https://api-class-o1lo.onrender.com/api/khanhphuong/showtimes';

// DTO cho việc tạo mới
export interface CreateShowtimeDTO {
  movie_id: string;
  start_time: string;
  end_time: string;
  screen_name: string;
  base_price: number;
  movie_title: string;
  movie_poster: string;
}

interface ShowtimeState {
  list: Showtime[];
  loading: boolean;
  error: string | null;
}

const initialState: ShowtimeState = {
  list: [],
  loading: false,
  error: null,
};

// --- 1. LẤY DANH SÁCH ---
export const fetchShowtimes = createAsyncThunk(
  'showtime/fetchShowtimes',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      // API trả về mảng trong property "data"
      if (data.data) {
        return data.data as Showtime[];
      }
      return [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// --- 2. TẠO MỚI ---
export const createShowtime = createAsyncThunk(
  'showtime/createShowtime',
  async (payload: CreateShowtimeDTO, thunkAPI) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Lỗi khi tạo lịch chiếu');
      const data = await response.json();
      return data.data as Showtime;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// --- 3. XÓA (MỚI THÊM) ---
export const deleteShowtime = createAsyncThunk(
  'showtime/deleteShowtime',
  async (id: string, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Lỗi khi xóa lịch chiếu');
      
      return id; // Trả về ID để reducer lọc bỏ khỏi danh sách
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const showtimeSlice = createSlice({
  name: 'showtime',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchShowtimes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShowtimes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchShowtimes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createShowtime.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      // Delete (Mới thêm)
      .addCase(deleteShowtime.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload);
      });
  },
});

export default showtimeSlice.reducer;