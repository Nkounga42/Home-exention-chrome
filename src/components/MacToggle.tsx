import React from 'react';

interface MacToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md';
}

export const MacToggle: React.FC<MacToggleProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        isSm ? 'w-8 h-4.5 p-0.5' : 'w-10 h-6 p-0.5'
      } ${
        checked
          ? 'bg-blue-600 dark:bg-blue-500'
          : 'bg-neutral-300 dark:bg-neutral-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
          isSm ? 'w-3.5 h-3.5' : 'w-5 h-5'
        } ${
          checked
            ? isSm
              ? 'translate-x-3.5'
              : 'translate-x-4'
            : 'translate-x-0'
        }`}
      />
    </button>
  );
};
