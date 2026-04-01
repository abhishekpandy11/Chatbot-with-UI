export default function SpotlightCard({ children, className = '', title, subtitle }) {
    return (
        <div className={`relative bg-black/[0.96] border border-white/[0.1] rounded-2xl p-8 overflow-hidden ${className}`}>
            {/* Spotlight effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-2xl"></div>

            {/* Content */}
            <div className="relative z-10">
                {(title || subtitle) && (
                    <div className="text-center mb-8">
                        {title && <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>}
                        {subtitle && <p className="text-gray-300">{subtitle}</p>}
                    </div>
                )}
                {children}
            </div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
        </div>
    );
}