import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

export interface InputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> {
  label: string;
  error?: FieldError;
  as?: 'input' | 'textarea' | 'select';
  options?: (string | { value: string; label: string })[]; // for select
  rows?: number; // for textarea
  helperText?: string;
  children?: React.ReactNode;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputProps
>(
  (
    { label, error, as = 'input', options, children, helperText, className = '', ...props },
    ref,
  ) => {
    const baseClasses = `bg-bg-elevated rounded-xl px-4 py-3.5 text-sm shadow-sm ring-1 transition-all focus:ring-2 focus:outline-none ${
      error ? 'ring-red-200 focus:ring-red-100' : 'ring-border-color focus:ring-brand-accent/30'
    } ${className}`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={props.id}
          className="text-[10px] font-bold tracking-widest uppercase opacity-60"
        >
          {label}
        </label>

        {as === 'textarea' ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={baseClasses}
            dir="auto"
          />
        ) : as === 'select' ? (
          <select
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
            ref={ref as React.Ref<HTMLSelectElement>}
            className={baseClasses}
            dir="auto"
          >
            {children}
            {options?.map((opt) =>
              typeof opt === 'string' ? (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ) : (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ),
            )}
          </select>
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            ref={ref as React.Ref<HTMLInputElement>}
            className={baseClasses}
            dir="auto"
          />
        )}

        {error && <p className="text-[10px] font-medium text-red-500">{error.message as string}</p>}

        {helperText && <p className="text-[10px] opacity-40">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
