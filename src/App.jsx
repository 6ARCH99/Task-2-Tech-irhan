import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

// ===== CUSTOM VALIDATION FUNCTION =====
const validatePassword = (value) => {
  if (value.length < 8) return "Password harus 8+ karakter, mengandung angka & simbol";
  if (!/\d/.test(value)) return "Password harus 8+ karakter, mengandung angka & simbol";
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(value)) return "Password harus 8+ karakter, mengandung angka & simbol";
  return true;
};

// ===== ICON COMPONENTS =====
const GamepadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <line x1="6" y1="11" x2="10" y2="11" /><line x1="8" y1="9" x2="8" y2="13" />
    <line x1="15" y1="12" x2="15.01" y2="12" /><line x1="18" y1="10" x2="18.01" y2="10" />
    <path d="M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0017.32 5z" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
    <path d="M18 2H6v7a6 6 0 0012 0V2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

// ===== ERROR MESSAGE =====
function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p style={{ color: '#ff4d6d', fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
      <AlertIcon />
      {message}
    </p>
  );
}

// ===== FORM FIELD WRAPPER =====
function FormField({ label, error, required, children, icon }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <label style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: 8
      }}>
        {icon && <span style={{ color: '#3b82f6', opacity: 1 }}>{icon}</span>}
        {label}
        {required && <span style={{ color: '#ff4d6d', fontSize: 11 }}>*</span>}
      </label>
      {children}
      <ErrorMessage message={error?.message} />
    </div>
  );
}

// ===== ROLE DATA =====
const ROLES = [
  { value: 'duelist', label: 'Duelist', desc: 'Entry Fragger' },
  { value: 'controller', label: 'Controller', desc: 'Smoke & Area' },
  { value: 'initiator', label: 'Initiator', desc: 'Intel & Flash' },
  { value: 'sentinel', label: 'Sentinel', desc: 'Anchor & Support' },
  { value: 'igl', label: 'IGL', desc: 'Shot Caller' },
  { value: 'flex', label: 'Flex', desc: 'Multi-Role' },
];

// ===== MAIN APP =====
export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ mode: 'onTouched' });

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        const exitTimer = setTimeout(() => {
          setIsSubmitted(false);
          setIsExiting(false);
        }, 400);
        return () => clearTimeout(exitTimer);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const onSubmit = (data) => {
    console.log("===========================================");
    console.log("📋 DATA REGISTRASI TURNAMEN ESPORTS NASIONAL");
    console.log("===========================================");
    console.log(data);
    console.log("===========================================");
    console.log("✅ Registrasi Berhasil, Han - Grup Esports");
    console.log("===========================================");
    setSubmittedName(data.fullName);
    setIsSubmitted(true);
    setIsExiting(false);
    reset();
    setSelectedRole('');
  };

  const inputClass = (hasError) => `form-input ${hasError ? 'error' : ''}`;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', zIndex: 10 }}>

      {/* ===== SUCCESS NOTIFICATION ===== */}
      {isSubmitted && (
        <div
          className={isExiting ? 'notification-exit' : 'notification-enter'}
          style={{ position: 'fixed', top: 24, left: '50%', zIndex: 50 }}
        >
          <div className="notification-box" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ color: '#3b82f6' }}><CheckIcon /></div>
            <div>
              <p style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14, fontFamily: '"Montserrat", sans-serif', letterSpacing: '0.02em' }}>
                REGISTRASI BERHASIL!
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
                Selamat datang, <span style={{ color: '#ffffff', fontWeight: 600 }}>{submittedName}</span> — Han - Grup Esports
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== FORM CARD ===== */}
      <div style={{ width: '100%', maxWidth: 680, position: 'relative' }}>

        {/* Top glow line */}
        <div className="glow-line-top" style={{ position: 'absolute', top: -1, left: 32, right: 32 }} />

        <div className="card-main">

          {/* ===== HEADER ===== */}
          <div style={{ padding: '40px 32px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
            {/* Glow blob */}
            <div style={{
              position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
              width: 300, height: 200, background: 'transparent',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              {/* Icon box */}
              <div style={{
                width: 52, height: 52, borderRadius: 8,
                background: '#3b82f6', border: '2px solid #2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff'
              }}>
                <GamepadIcon />
              </div>
              <div>
                <h1 className="gradient-title" style={{
                  fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700,
                  fontFamily: '"Montserrat", sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2
                }}>
                  TURNAMEN ESPORTS
                </h1>
                <p style={{
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em',
                  color: '#3b82f6', fontWeight: 600, marginTop: 6
                }}>
                  Nasional 2026
                </p>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, maxWidth: 460 }}>
              Daftarkan dirimu sekarang dan tunjukkan kemampuanmu di panggung kompetitif nasional.
              Isi formulir di bawah untuk bergabung.
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: 32, marginTop: 24, paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              {[
                { label: 'Peserta', value: '2,847' },
                { label: 'Tim', value: '356' },
                { label: 'Prize Pool', value: '$50K' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p className="gradient-cyan" style={{
                    fontSize: 20, fontWeight: 700,
                    fontFamily: '"Montserrat", sans-serif'
                  }}>{s.value}</p>
                  <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ padding: '32px 32px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Row: Name + Username */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nama Lengkap" error={errors.fullName} required>
                  <input
                    type="text" id="fullName" placeholder="Masukkan nama lengkap"
                    className={inputClass(errors.fullName)}
                    {...register('fullName', { required: 'Nama lengkap wajib diisi' })}
                  />
                </FormField>
                <FormField label="Username" error={errors.username} required>
                  <input
                    type="text" id="username" placeholder="Min 6, maks 20 karakter"
                    className={inputClass(errors.username)}
                    {...register('username', {
                      required: 'Username wajib diisi',
                      minLength: { value: 6, message: 'Username minimal 6 karakter' },
                      maxLength: { value: 20, message: 'Username maksimal 20 karakter' },
                    })}
                  />
                </FormField>
              </div>

              {/* Email */}
              <FormField label="Email" error={errors.email} required>
                <input
                  type="email" id="email" placeholder="contoh@email.com"
                  className={inputClass(errors.email)}
                  {...register('email', {
                    required: 'Email wajib diisi',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid' },
                  })}
                />
              </FormField>

              {/* Row: Password + Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Password" error={errors.password} required icon={<ShieldIcon />}>
                  <input
                    type="password" id="password" placeholder="Min 8 karakter, angka & simbol"
                    className={inputClass(errors.password)}
                    {...register('password', {
                      required: 'Password wajib diisi',
                      validate: validatePassword,
                    })}
                  />
                </FormField>
                <FormField label="Umur" error={errors.age} required>
                  <input
                    type="number" id="age" placeholder="18 - 100"
                    className={inputClass(errors.age)}
                    {...register('age', {
                      required: 'Umur wajib diisi',
                      min: { value: 18, message: 'Peserta harus berusia antara 18-100 tahun' },
                      max: { value: 100, message: 'Peserta harus berusia antara 18-100 tahun' },
                      valueAsNumber: true,
                    })}
                  />
                </FormField>
              </div>

              {/* Ticket Type */}
              <FormField label="Tipe Tiket" error={errors.ticketType} required icon={<TrophyIcon />}>
                <select
                  id="ticketType"
                  className={`form-input form-select ${errors.ticketType ? 'error' : ''}`}
                  {...register('ticketType', { required: 'Anda harus memilih tipe tiket' })}
                >
                  <option value="">— Pilih Tipe Tiket —</option>
                  <option value="free">Free Entry — Akses Streaming</option>
                  <option value="vip">VIP Pass — Seat Premium + Merch</option>
                  <option value="team">Team Bundle — 5 Player Pass</option>
                  <option value="pro">Pro Player Pass — Full Access</option>
                </select>
              </FormField>

              {/* Website URL */}
              <FormField label="Situs Web / Portfolio" error={errors.websiteUrl}>
                <input
                  type="url" id="websiteUrl" placeholder="https://portfolio-kamu.com (opsional)"
                  className={inputClass(errors.websiteUrl)}
                  {...register('websiteUrl', {
                    pattern: { value: /^https?:\/\/[^\s$.?#].[^\s]*$/, message: 'Format URL tidak valid' },
                  })}
                />
              </FormField>

              {/* Role In-Game (Radio Cards) */}
              <FormField label="Role In-Game" error={errors.gameRole} required icon={<GamepadIcon />}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" style={{ marginTop: 4 }}>
                  {ROLES.map((role) => {
                    const { onChange, ...rest } = register('gameRole', { required: 'Role in-game wajib dipilih' });
                    return (
                      <label key={role.value} style={{ cursor: 'pointer' }}>
                        <input
                          type="radio" value={role.value}
                          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                          onChange={(e) => { onChange(e); setSelectedRole(e.target.value); }}
                          {...rest}
                        />
                        <div className={`role-card ${selectedRole === role.value ? 'selected' : ''}`}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>{role.label}</p>
                          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{role.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </FormField>

              {/* Team Name */}
              <FormField label="Nama Tim" error={errors.teamName} required>
                <input
                  type="text" id="teamName" placeholder="Contoh: Team Phoenix Rising"
                  className={inputClass(errors.teamName)}
                  {...register('teamName', { required: 'Nama tim wajib diisi' })}
                />
              </FormField>

              {/* Terms & Conditions */}
              <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox" id="agreeToTerms"
                    className="custom-checkbox"
                    style={{ marginTop: 2 }}
                    {...register('agreeToTerms', { required: 'Anda harus menyetujui syarat dan ketentuan' })}
                  />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                    Saya menyetujui{' '}
                    <span style={{ color: '#3b82f6', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
                      syarat dan ketentuan
                    </span>{' '}
                    Turnamen Esports Nasional 2026
                  </span>
                </label>
                <ErrorMessage message={errors.agreeToTerms?.message} />
              </div>

              {/* Submit Button */}
              <div style={{ paddingTop: 8 }}>
                <button type="submit" disabled={isSubmitting} className="btn-submit">
                  <div className="btn-submit-inner">
                    <span className="btn-submit-text">
                      {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
                    </span>
                  </div>
                </button>
              </div>

            </div>
          </form>

          {/* Footer */}
          <div style={{
            padding: '16px 32px', borderTop: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              © 2026 Turnamen Esports Nasional — All Rights Reserved
            </p>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="glow-line-bottom" style={{ position: 'absolute', bottom: -1, left: 32, right: 32 }} />
      </div>
    </div>
  );
}
