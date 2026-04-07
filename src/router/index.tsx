import { createHashRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import ChallengePage from '@/pages/ChallengePage';

export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'challenge/:id', element: <ChallengePage /> },
    ],
  },
]);
