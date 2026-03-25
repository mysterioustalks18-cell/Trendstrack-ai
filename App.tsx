import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout } from './firebase';
import { UserProfile } from './types';
import { Toaster, toast } from 'sonner';
import { Menu, X, Search, Zap, TrendingUp, Newspaper, User, Bookmark, Plus, Sparkles, LogOut, AlertCircle } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Directory from './pages/Directory';
import ToolDetail from './pages/ToolDetail';
import News from './pages/News';
import Profile from './pages/Profile';
import SubmitTool from './pages/SubmitTool';
import Auth from './pages/Auth';
import Compare from './pages/Compare';
import GoalDiscovery from './pages/GoalDiscovery';
import StackBuilder from './pages/StackBuilder';
import PredictionHub from './pages/PredictionHub';
import Pricing from './pages/Pricing';
import AIWorkflowGenerator from './pages/AIWorkflowGenerator';
import SmartQuiz from './pages/SmartQuiz';
import Admin from './pages/Admin';
import ToolMatcher from './pages/ToolMatcher';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

// Route Protection Components
const ProtectedRoute = ({ user, children }: { user: UserProfile | null, children: React.ReactNode }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const AdminRoute = ({ user, children }: { user: UserProfile | null, children: React.ReactNode }) => {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          // Profile creation is primarily handled in Auth.tsx, 
          // but this serves as a fallback for external logins.
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'}&background=random`,
            bookmarks: [],
            role: 'user',
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-grow">
          {user && auth.currentUser && !auth.currentUser.emailVerified && (
            <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-2 px-4 text-center">
              <p className="text-xs font-bold text-yellow-500 flex items-center justify-center">
                <AlertCircle className="w-3 h-3 mr-2" />
                Please verify your email to unlock all features. 
                <button 
                  onClick={async () => {
                    try {
                      if (auth.currentUser) {
                        await sendEmailVerification(auth.currentUser);
                        toast.success('Verification email sent!');
                      }
                    } catch (e) {
                      toast.error('Failed to send verification email.');
                    }
                  }}
                  className="ml-2 underline hover:text-yellow-400"
                >
                  Resend Email
                </button>
              </p>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/directory" element={<Directory user={user} />} />
            <Route path="/tool/:id" element={<ToolDetail user={user} />} />
            <Route path="/news" element={<News />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute user={user}>
                  <Profile user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/submit" 
              element={
                <ProtectedRoute user={user}>
                  <SubmitTool user={user} />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/goal/:goalId" element={<GoalDiscovery />} />
            <Route path="/stack-builder" element={<StackBuilder />} />
            <Route path="/predictions" element={<PredictionHub />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/workflow-generator" element={<AIWorkflowGenerator user={user} />} />
            <Route path="/quiz" element={<SmartQuiz user={user} />} />
            <Route path="/matcher" element={<ToolMatcher user={user} />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute user={user}>
                  <Admin user={user} />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <AIChatbot />
        <Toaster position="bottom-right" theme="dark" />
      </div>
    </Router>
  );
}
