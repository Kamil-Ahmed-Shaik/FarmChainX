import PropTypes from 'prop-types';
import '../../styles/Components.css'; // Assuming this exists, or I might need to add styles

export default function ModernProductCard({ product, onDetailsClick, onBuyClick }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group h-full flex flex-col">
            <div className="relative h-56 overflow-hidden flex-shrink-0">
                <img
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    src={`/uploads/${product.imagePath}`}
                    alt={product.cropName}
                />

                {/* Verified Badge - Top Left */}
                {product.status === 'VERIFIED' && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase shadow-sm flex items-center gap-1">
                        <span className="text-sm">✓</span> Verified
                    </div>
                )}

                {/* Grade Badge - Top Right (Avatar style as per image) */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-orange-400 text-orange-500 font-bold">
                    {product.qualityGrade}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Header: Title and Farmer */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{product.cropName}</h3>
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-xl">👨‍🌾</span>
                        <span className="text-sm font-medium">{product.username || product.farmerName}</span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl mb-4">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">QUANTITY</p>
                        <p className="text-lg font-black text-gray-900">{product.quantity} kg</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">PRICE</p>
                        <p className="text-lg font-black text-emerald-600">₹{product.price}</p>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="flex justify-between items-center text-xs text-gray-400 font-medium mb-6">
                    <div className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{product.harvestDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span className="max-w-[120px] truncate">{product.location}</span>
                    </div>
                    {product.distance && (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                            <span>📏</span>
                            <span>{product.distance} km</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDetailsClick(product); }}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 transition shadow-sm"
                    >
                        <span>🔍</span> Details
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onBuyClick(product); }}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-200"
                    >
                        <span>🛒</span> Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

ModernProductCard.propTypes = {
    product: PropTypes.object.isRequired,
    onDetailsClick: PropTypes.func.isRequired,
    onBuyClick: PropTypes.func.isRequired
};
