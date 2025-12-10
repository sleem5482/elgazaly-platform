import { cn } from '../../lib/utils';

export default function Button({ className, variant = 'primary', size = 'md', ...props }) {
    const variants = {
        primary: 'bg-primary text-white hover:bg-red-700',
        secondary: 'bg-secondary text-white hover:bg-blue-900',
        outline: 'border-2 border-primary text-primary hover:bg-red-50',
        ghost: 'hover:bg-gray-100 text-gray-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        icon: 'p-2',
    };

    return (
        <button
            className={cn(
                'rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
