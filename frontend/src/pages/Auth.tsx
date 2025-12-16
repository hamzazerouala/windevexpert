import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Code, 
  Settings, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// --- Styles Globaux (Pour l'animation et le scroll) ---
const GlobalStyles = () => (
  <style>{`
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `}</style>
);

// --- Schémas de validation ---
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// --- Composants UI ---

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  id: string;
  register: any;
  error?: string;
}

const InputField = ({ label, type = "text", placeholder, icon: Icon, id, register, error }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-yellow-500 transition-colors" />
        </div>
        <input
          id={id}
          type={inputType}
          className={`block w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-300 ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          {...register}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 ml-1">{error}</p>
      )}
    </div>
  );
};

interface SocialButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

const SocialButton = ({ icon: Icon, label, onClick }: SocialButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group"
  >
    <Icon className="w-5 h-5 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.23856)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.449 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);

// --- Composant principal ---
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmitLogin = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;
      
      navigate('/dashboard');
    } catch (error: any) {
      loginForm.setError('root', { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitRegister = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });
      
      if (error) throw error;
      
      navigate('/dashboard');
    } catch (error: any) {
      registerForm.setError('root', { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen font-sans selection:bg-yellow-400 selection:text-black`}>
      <GlobalStyles />
      
      {/* Container Principal */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
        
        {/* Animated Blobs (Background) */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />

        {/* Top Bar (Navigation & Theme) */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center max-w-7xl mx-auto w-full z-20">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Retour au site</span>
            </button>
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 transition-all"
            >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
        </div>

        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-[440px]">
          
          {/* Logo Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-14 h-14 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-4 shadow-xl">
               <Settings className="w-8 h-8 text-slate-500 dark:text-slate-400 absolute" />
               <Code className="w-5 h-5 text-yellow-500 dark:text-yellow-400 z-10" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">
              Windev<span className="text-yellow-500 dark:text-yellow-400">Expert</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-center">
              {isLogin ? 'Bon retour parmi nous, Architecte.' : 'Commencez votre parcours d\'expert.'}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl transition-all duration-300">
            
            {/* Toggle Switch */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-950/50 rounded-xl mb-8 relative">
                <div 
                    className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white dark:bg-slate-800 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${isLogin ? 'left-1' : 'left-[calc(50%+4px)]'}`}
                ></div>
                <button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2.5 text-sm font-bold text-center relative z-10 transition-colors ${isLogin ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    Connexion
                </button>
                <button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2.5 text-sm font-bold text-center relative z-10 transition-colors ${!isLogin ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    Inscription
                </button>
            </div>

            {/* Form */}
            <form onSubmit={isLogin ? loginForm.handleSubmit(onSubmitLogin) : registerForm.handleSubmit(onSubmitRegister)} className="space-y-5">
              {isLogin && loginForm.formState.errors.root && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  {loginForm.formState.errors.root.message}
                </div>
              )}
              {!isLogin && registerForm.formState.errors.root && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  {registerForm.formState.errors.root.message}
                </div>
              )}
              
              {!isLogin && (
                <InputField 
                    id="fullName"
                    label="Nom complet" 
                    placeholder="Jean Dupont" 
                    icon={User} 
                    type="text"
                    register={registerForm.register('fullName')}
                    error={registerForm.formState.errors.fullName?.message}
                />
              )}
              
              <InputField 
                  id="email"
                  label="Email professionnel" 
                  placeholder="jean@entreprise.com" 
                  icon={Mail} 
                  type="email"
                  register={isLogin ? loginForm.register('email') : registerForm.register('email')}
                  error={isLogin ? loginForm.formState.errors.email?.message : registerForm.formState.errors.email?.message}
              />
              
              <div>
                <InputField 
                    id="password"
                    label="Mot de passe" 
                    placeholder="••••••••" 
                    icon={Lock} 
                    type="password"
                    register={isLogin ? loginForm.register('password') : registerForm.register('password')}
                    error={isLogin ? loginForm.formState.errors.password?.message : registerForm.formState.errors.password?.message}
                />
                {isLogin && (
                    <div className="flex justify-end mt-2">
                        <a href="#" className="text-xs font-medium text-slate-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                            Mot de passe oublié ?
                        </a>
                    </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                        {isLogin ? 'Se connecter' : "S'inscrire"}
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 font-medium">Ou continuer avec</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <SocialButton 
                icon={GoogleIcon} 
                label={isLogin ? "Connexion avec Google" : "S'inscrire avec Google"} 
                onClick={handleGoogleAuth}
              />
            </div>
            
            {/* Footer Text */}
            <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
                En continuant, vous acceptez nos{' '}
                <a href="#" className="underline hover:text-slate-800 dark:hover:text-slate-200">Conditions d'utilisation</a>
                {' '}et notre{' '}
                <a href="#" className="underline hover:text-slate-800 dark:hover:text-slate-200">Politique de confidentialité</a>.
            </p>

          </div>
          
          {/* Security Badge */}
          <div className="mt-8 flex justify-center items-center gap-2 text-xs text-slate-500 dark:text-slate-500 opacity-60">
             <Lock className="w-3 h-3" />
             <span>Chiffrement TLS 256-bit • Données sécurisées</span>
          </div>

        </div>
      </div>
    </div>
  );
}