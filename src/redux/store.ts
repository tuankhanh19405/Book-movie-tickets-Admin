import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';
import showtimeReducer from './slices/showtimeSlice'
import checkInReducer from './slices/checkinSlice'
import dashboardReducer from './slices/DashboardSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    movie: movieReducer,
    showtime: showtimeReducer,
    checkin: checkInReducer,
    dashboard: dashboardReducer,
    users : userReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;