import { ReactNode } from 'react';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 hover-glow text-left h-full">
            <div className="mb-4 p-3 bg-background rounded-xl w-fit border border-border/50 shadow-sm">{icon}</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
