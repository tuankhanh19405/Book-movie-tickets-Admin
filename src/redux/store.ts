import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';

export const store = configureStore({
  reducer: {
    // Khai báo các slice tại đây
    movie: movieReducer,
    
    // Sau này nếu bạn làm thêm phần user hay booking thì thêm vào dưới:
    // user: userReducer,
    // booking: bookingReducer,
  },
});

// Xuất các type này để dùng ở file hooks.ts và các component
// Giúp TypeScript hiểu được cấu trúc dữ liệu của toàn bộ kho (store)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;