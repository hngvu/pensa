import { useSignIn } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'password'>('email');
  const navigate = useNavigate();

  if (!isLoaded) {
    return null;
  }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (step === 'email') {
        // Prepare sign-in with email
        await signIn.create({
          identifier: email,
        });
        
        // Move to password step
        setStep('password');
      } else {
        // Attempt first factor verification (password)
        const result = await signIn.attemptFirstFactor({
          strategy: 'password',
          password: password,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          navigate('/');
        } else {
          console.log(result);
          setError('Unexpected status: ' + result.status);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'An error occurred. Please try again.');
    }
  };



  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'url(/auth-bg.jpg) center center / cover no-repeat, #FAFBFC',
      fontFamily: 'var(--font-sans)',
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '3px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        padding: '32px 40px',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <img src="/logo.svg" alt="Pensa Logo" width={28} height={28} style={{ display: 'block' }} />
          <h1 style={{ margin: 0, fontSize: '24px', color: '#172B4D', fontWeight: 700, letterSpacing: '-0.5px' }}>Pensa</h1>
        </div>

        <h2 style={{ fontSize: '16px', color: '#172B4D', marginBottom: '24px', fontWeight: 600 }}>
          {step === 'email' ? 'Log in to continue' : 'Enter your password'}
        </h2>

        {error && (
          <div style={{ background: '#FFEBE6', color: '#DE350B', padding: '10px', borderRadius: '3px', marginBottom: '16px', fontSize: '14px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleContinue} style={{ textAlign: 'left' }}>
          {step === 'email' ? (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#44546F', marginBottom: '4px' }}>
                Email <span style={{ color: '#DE350B' }}>*</span>
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '3px',
                  border: '2px solid #DFE1E6',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0C66E4'}
                onBlur={(e) => e.target.style.borderColor = '#DFE1E6'}
              />
            </div>
          ) : (
             <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#44546F', marginBottom: '4px' }}>
                Password <span style={{ color: '#DE350B' }}>*</span>
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '3px',
                  border: '2px solid #DFE1E6',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0C66E4'}
                onBlur={(e) => e.target.style.borderColor = '#DFE1E6'}
              />
            </div>
          )}

          <button 
            type="submit"
            style={{
              width: '100%',
              background: '#0C66E4',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '3px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#0052CC'}
            onMouseOut={(e) => e.currentTarget.style.background = '#0C66E4'}
          >
            Continue
          </button>
        </form>



        <div style={{ marginTop: '24px', fontSize: '14px', color: '#44546F' }}>
          <a href="#" style={{ color: '#0C66E4', textDecoration: 'none' }}>Can't log in?</a>
          {' • '}
          <a href="/signup" style={{ color: '#0C66E4', textDecoration: 'none' }}>Create an account</a>
        </div>
      </div>
    </div>
  );
}
