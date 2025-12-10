import { cn } from '../../lib/utils';

export default function Input({ className, ...props }) {
    return (
        <input
            className={cn(
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400',
                className
            )}
            {...props}
        />
    );
}
