export default function AceternityInput({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    className = ''
}) {
    return (
        <div className="mb-6">
            {label && (
                <label className="block text-sm font-medium text-white/80 mb-3">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${error ? 'border-red-500/50' : ''} ${className}`}
                />
                {/* Animated focus ring */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
    );
}