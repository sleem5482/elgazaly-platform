import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
    return (
        <div className={cn('bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300', className)} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return <div className={cn('p-6 border-b border-gray-50', className)} {...props}>{children}</div>;
}

export function CardContent({ className, children, ...props }) {
    return <div className={cn('p-6', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
    return <div className={cn('p-6 bg-gray-50 border-t border-gray-100 flex items-center', className)} {...props}>{children}</div>;
}
