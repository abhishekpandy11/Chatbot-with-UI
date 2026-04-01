export default function Card({ children, className = '', title, subtitle }) {
    return (
        <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
            {(title || subtitle) && (
                <div className="text-center mb-8">
                    {title && <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>}
                    {subtitle && <p className="text-gray-600">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
}