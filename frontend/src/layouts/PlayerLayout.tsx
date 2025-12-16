import { Outlet } from 'react-router-dom';

export function PlayerLayout() {
  return (
    <div className="h-screen bg-black">
      <Outlet />
    </div>
  );
}