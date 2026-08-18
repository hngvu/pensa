import { useSignUp } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'details' | 'verification'>('details');
  const navigate = useNavigate();

  if (!isLoaded) {
    return null;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (step === 'details') {
        // Step 1: Create the user
        await signUp.create({
          emailAddress: email,
          password,
        });

        // Send verification email
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        
        // Move to verification step
        setStep('verification');
      } else {
        // Step 2: Verify the code
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code,
        });

        if (completeSignUp.status === 'complete') {
          await setActive({ session: completeSignUp.createdSessionId });
          navigate('/');
        } else {
          setError('Verification failed. Please check the code.');
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
          {step === 'details' ? 'Sign up to continue' : 'Check your email'}
        </h2>

        {error && (
          <div style={{ background: '#FFEBE6', color: '#DE350B', padding: '10px', borderRadius: '3px', marginBottom: '16px', fontSize: '14px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} style={{ textAlign: 'left' }}>
          {step === 'details' ? (
            <>
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
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#44546F', marginBottom: '4px' }}>
                  Password <span style={{ color: '#DE350B' }}>*</span>
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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
            </>
          ) : (
             <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#44546F', marginBottom: '16px' }}>
                We sent a verification code to <strong>{email}</strong>
              </p>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#44546F', marginBottom: '4px' }}>
                Verification Code <span style={{ color: '#DE350B' }}>*</span>
              </label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
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
            {step === 'details' ? 'Sign up' : 'Verify & Continue'}
          </button>
        </form>



        <div style={{ marginTop: '24px', fontSize: '14px', color: '#44546F' }}>
          <a href="/signin" style={{ color: '#0C66E4', textDecoration: 'none' }}>Already have an account? Log in</a>
        </div>
      </div>
    </div>
  );
}
