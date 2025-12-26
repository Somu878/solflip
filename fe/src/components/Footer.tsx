import { Github, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full py-3 md:py-4 border-t border-border/30 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5">
                    Made with <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-red-500" /> by
                    <span className="font-semibold text-foreground">Somu</span>
                </p>

                <div className="flex items-center gap-3">
                    <a
                        href="https://github.com/Somu878"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="GitHub"
                    >
                        <Github className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                    <a
                        href="https://linkedin.com/in/somu-kandula"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
};
