import { cn } from '../../lib/utils';

export default function Badge({ className, variant = 'default', children, ...props }) {
    const variants = {
        default: 'bg-primary/10 text-primary border border-primary/20',
        success: 'bg-green-100 text-green-700 border border-green-200',
        warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        secondary: 'bg-gray-100 text-gray-700 border border-gray-200',
        outline: 'border border-gray-300 text-gray-600',
    };

    return (
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1', variants[variant], className)} {...props}>
            {children}
        </span>
    );
}
