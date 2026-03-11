import { useState, useRef, useEffect } from 'react';
import styles from './PasswordGate.module.css';

interface PasswordGateProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const CORRECT_PASSWORD = '1717';

export function PasswordGate({ isOpen, onSuccess, onCancel }: PasswordGateProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === CORRECT_PASSWORD) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setValue('');
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className={`${styles.modal} ${shake ? styles.shake : ''}`} role="dialog" aria-modal="true" aria-label="Вход в режим преподавателя">
        <div className={styles.icon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className={styles.title}>Режим преподавателя</h2>
        <p className={styles.subtitle}>Введите пароль доступа для активации расширенного режима преподавания</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.inputWrapper} ${error ? styles.inputError : ''}`}>
            <input
              ref={inputRef}
              type="password"
              className={styles.input}
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              placeholder="Пароль"
              autoComplete="off"
              maxLength={20}
            />
          </div>
          {error && <p className={styles.errorMsg}>Неверный пароль. Попробуйте ещё раз.</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>Отмена</button>
            <button type="submit" className={styles.submitBtn} disabled={!value.trim()}>Войти</button>
          </div>
        </form>
      </div>
    </div>
  );
}
