import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from '../data/firebaseConfig';

export const handleLogin = async (email, password, setAuthLoading, showMessage, navigateTo) => {
  if (!email || !password) {
    showMessage('error', '⚠️ И-мэйл болон нууц үгээ оруулна уу');
    return;
  }

  setAuthLoading(true);
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    showMessage('success', '✅ Амжилттай нэвтэрлээ!');
    setTimeout(() => navigateTo('birthdate'), 1000);
  } catch (error) {
    let errorMessage = '❌ Нэвтрэх үед алдаа гарлаа';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = '⚠️ И-мэйл бүртгэгдээгүй байна';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = '⚠️ Нууц үг буруу байна';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '⚠️ И-мэйл хаяг буруу байна';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = '⚠️ Хэт олон оролдлого хийсэн. Түр хүлээнэ үү';
    }
    
    showMessage('error', errorMessage);
  } finally {
    setAuthLoading(false);
  }
};

export const handleRegister = async (email, password, setAuthLoading, showMessage, navigateTo) => {
  if (!email || !password) {
    showMessage('error', '⚠️ И-мэйл болон нууц үгээ оруулна уу');
    return;
  }

  if (password.length < 6) {
    showMessage('error', '⚠️ Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
    return;
  }

  setAuthLoading(true);

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showMessage('success', '🎉 Амжилттай бүртгүүллээ!');
    setTimeout(() => navigateTo('birthdate'), 1000);
  } catch (error) {
    let errorMessage = '❌ Бүртгэх үед алдаа гарлаа';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = '⚠️ Энэ и-мэйл аль хэдийн бүртгэгдсэн байна';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '⚠️ И-мэйл хаяг буруу байна';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = '⚠️ Нууц үг хэт сул байна';
    }
    
    showMessage('error', errorMessage);
  } finally {
    setAuthLoading(false);
  }
};

export const handleLogout = async (showMessage, setUser, setEmail, setPassword, setPageHistory, setCurrentPage) => {
  if (window.confirm('🚪 Та системээс гарахдаа итгэлтэй байна уу?')) {
    try {
      await signOut(auth);
      setUser(null);
      setEmail('');
      setPassword('');
      setPageHistory(['home']);
      setCurrentPage('home');
      showMessage('success', '✅ Амжилттай гарлаа');
    } catch (error) {
      showMessage('error', '❌ Гарах үед алдаа гарлаа');
    }
  }
};