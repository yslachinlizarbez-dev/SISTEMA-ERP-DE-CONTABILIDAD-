import React, { useState } from 'react';
import { User as FirebaseUser } from '../types/erp';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';
import { Lock, User as UserIcon, ShieldCheck, Building2, Mail, Chrome } from 'lucide-react';

interface LoginModalProps {
  users?: any[];
  onLogin: (user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let resUser;
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        resUser = credential.user;
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        resUser = credential.user;
      }
      onLogin({
        id: resUser.uid,
        username: resUser.email?.split('@')[0] || 'usuario',
        name: resUser.displayName || resUser.email || 'Usuario ERP',
        role: 'Administrador',
        email: resUser.email,
        active: true
      });
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const resUser = credential.user;
      onLogin({
        id: resUser.uid,
        username: resUser.email?.split('@')[0] || 'google_user',
        name: resUser.displayName || 'Usuario Google',
        role: 'Administrador',
        email: resUser.email,
        active: true
      });
    } catch (err: any) {
      setError(err.message || 'Error con Google Sign-In');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl text-blue-400 mb-4 border border-blue-500/20">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ERP Enterprise & Contabilidad</h1>
          <p className="text-slate-400 text-sm mt-1">Firebase Auth: {isSignUp ? 'Registro de Cuenta' : 'Iniciar Sesión'}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mb-6 bg-white hover:bg-slate-100 text-slate-900 font-medium py-3 rounded-xl transition duration-200 shadow-lg flex items-center justify-center space-x-3 text-sm"
        >
          <Chrome className="w-5 h-5 text-blue-600" />
          <span>Continuar con Google</span>
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase font-semibold">o con correo</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="usuario@empresa.pe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSignUp ? 'Registrar Cuenta' : 'Iniciar Sesión'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-blue-400 hover:underline font-medium"
          >
            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};
