export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background py-6 mt-auto">
            <div className="container mx-auto px-4 flex items-center justify-center text-sm text-muted-foreground">
                <span>&copy; {new Date().getFullYear()} BaseLock</span>
            </div>
        </footer>
    );
}
