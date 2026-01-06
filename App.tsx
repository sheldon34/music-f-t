import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Loading from './components/Loading';

// Lazy load pages to split the bundle and improve initial load time
const Home = React.lazy(() => import('./pages/Home'));
const Tour = React.lazy(() => import('./pages/Tour'));
const Music = React.lazy(() => import('./pages/Music'));
const Shop = React.lazy(() => import('./pages/Shop'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));

const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { isLoading, isAuthenticated, isAdmin, login } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">ACCESS DENIED</h1>
        <p className="mb-4">You must be an administrator to view this page.</p>
        <button onClick={login} className="bg-black text-brand-accent px-6 py-2 font-bold">LOGIN</button>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tour" element={<Tour />} />
                <Route path="/music" element={<Music />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;