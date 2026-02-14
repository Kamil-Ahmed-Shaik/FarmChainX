import { QRCodeSVG } from 'qrcode.react';
import PropTypes from 'prop-types';
import '../styles/Components.css';

export default function ProductDetailsModal({ product, onClose, history, shipments, isOpen }) {
    if (isOpen === false) return null;
    if (!product) return null;

    const qrData = JSON.stringify({
        cropId: product.id || product.cropId,
        cropName: product.cropName,
        blockchainHash: product.blockchainHash,
        traceabilityUrl: `${window.location.origin}/traceability?id=${product.id || product.cropId}`
    });

    return (
        <div className="overlay" onClick={onClose}>
            <div className="overlay-box" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button
                    className="overlay-close"
                    onClick={onClose}
                    style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 50, cursor: 'pointer' }}
                >
                    ×
                </button>

                <div style={{ padding: '2rem' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                            <h2 className="modal-title" style={{ marginBottom: '1rem' }}>
                                🌾 {product.cropName || product.name}
                            </h2>

                            {/* Product Image */}
                            {product.imagePath && (
                                <img
                                    src={`/uploads/${product.imagePath}`}
                                    alt={product.cropName}
                                    style={{
                                        width: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'cover',
                                        borderRadius: '1rem',
                                        marginBottom: '1rem'
                                    }}
                                />
                            )}

                            {/* Main Details Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <div className="detail-card">
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', marginBottom: '0.25rem' }}>Quality Grade</p>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#059669' }}>{product.qualityGrade}</p>
                                </div>
                                <div className="detail-card">
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', marginBottom: '0.25rem' }}>Quantity</p>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '700' }}>{product.quantity} kg</p>
                                </div>
                                <div className="detail-card">
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', marginBottom: '0.25rem' }}>Price</p>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#3b82f6' }}>₹{product.price}</p>
                                </div>
                                <div className="detail-card">
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', marginBottom: '0.25rem' }}>Harvest Date</p>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '700' }}>{product.harvestDate}</p>
                                </div>
                            </div>

                            {/* Extended Metadata */}
                            <div className="detail-card" style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', color: '#374151' }}>📍 Additional Details</h4>
                                {product.location && <p><b>Location:</b> {product.location}</p>}
                                {product.farmLocation && <p><b>Farm Location:</b> {product.farmLocation}</p>}
                                {product.soil_type && <p><b>Soil Type:</b> {product.soil_type}</p>}
                                {product.cropType && <p><b>Crop Type:</b> {product.cropType}</p>}
                                {product.acres && <p><b>Farm Size:</b> {product.acres} acres</p>}
                                {product.username && <p><b>Farmer:</b> {product.username}</p>}
                                {product.farmerUsername && <p><b>Farmer:</b> {product.farmerUsername}</p>}
                                {product.farmName && <p><b>Farm Name:</b> {product.farmName}</p>}
                                {product.mobile && <p><b>Contact:</b> {product.mobile}</p>}
                                {product.status && <p><b>Status:</b> <span className={`status-badge status-${product.status?.toLowerCase()}`}>{product.status}</span></p>}
                                {product.crop_status && <p><b>Crop Status:</b> <span className={`status-badge status-${product.crop_status?.toLowerCase()}`}>{product.crop_status}</span></p>}
                                {product.orderStatus && <p><b>Order Status:</b> <span className={`status-badge status-${product.orderStatus?.toLowerCase()}`}>{product.orderStatus}</span></p>}
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div style={{ minWidth: '200px', textAlign: 'center' }}>
                            <div style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                border: '2px solid #e5e7eb',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem', color: '#374151' }}>
                                    📱 Scan to Trace
                                </h4>
                                <QRCodeSVG
                                    value={qrData}
                                    size={160}
                                    level="H"
                                    includeMargin={true}
                                />
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.75rem' }}>
                                    Scan QR for complete traceability
                                </p>
                                {product.blockchainHash && (
                                    <p style={{ fontSize: '0.65rem', color: '#9ca3af', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                                        Hash: {product.blockchainHash.substring(0, 16)}...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location Map */}
                    {(product.latitude && product.longitude) && (
                        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem', color: '#374151' }}>
                                📍 Farm Location
                            </h4>
                            <div style={{
                                height: '250px',
                                width: '100%',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                border: '2px solid #e5e7eb'
                            }}>
                                <iframe
                                    title="farm-location"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    src={`https://maps.google.com/maps?q=${product.latitude},${product.longitude}&z=15&output=embed`}
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {/* Ownership History Timeline */}
                    {history && history.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{
                                background: '#ecfdf5',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                marginBottom: '1.5rem',
                                borderLeft: '4px solid #059669'
                            }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#065f46', marginBottom: '0.25rem' }}>
                                    🛡️ Complete Ownership Chain
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#047857' }}>
                                    Blockchain-verified ownership history across all stages
                                </p>
                            </div>

                            <div style={{ position: 'relative' }}>
                                {history.map((log, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        marginBottom: index === history.length - 1 ? 0 : '1.5rem',
                                        position: 'relative'
                                    }}>
                                        {/* Timeline Node */}
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            background: index === 0 ? '#d1fae5' : index === history.length - 1 ? '#fef3c7' : '#dbeafe',
                                            border: `3px solid ${index === 0 ? '#059669' : index === history.length - 1 ? '#f59e0b' : '#3b82f6'}`,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            fontWeight: 'bold',
                                            color: index === 0 ? '#059669' : index === history.length - 1 ? '#f59e0b' : '#3b82f6',
                                            zIndex: 2,
                                            fontSize: '0.875rem'
                                        }}>
                                            {index + 1}
                                        </div>

                                        {/* Timeline Line */}
                                        {index !== history.length - 1 && (
                                            <div style={{
                                                position: 'absolute',
                                                left: '19px',
                                                top: '40px',
                                                width: '2px',
                                                height: 'calc(100% + 0.5rem)',
                                                background: '#e5e7eb',
                                                zIndex: 1
                                            }}></div>
                                        )}

                                        {/* Timeline Content */}
                                        <div style={{
                                            flex: 1,
                                            background: '#f9fafb',
                                            padding: '1rem 1.25rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <p style={{ fontWeight: '700', fontSize: '1rem', color: '#111827', marginBottom: '0.25rem' }}>
                                                        {log.username}
                                                    </p>
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            background: 'white',
                                                            padding: '0.125rem 0.5rem',
                                                            borderRadius: '0.25rem',
                                                            border: '1px solid #e5e7eb',
                                                            fontWeight: '600',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.025em'
                                                        }}>
                                                            {log.ownerRole}
                                                        </span>
                                                        {index === 0 && <span style={{ fontSize: '0.75rem', color: '#059669' }}>● Origin</span>}
                                                        {index === history.length - 1 && <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>● Current</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                📅 {new Date(log.timestamp).toLocaleString('en-IN', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Shipment History */}
                    {shipments && shipments.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{
                                background: '#eff6ff',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                marginBottom: '1.5rem',
                                borderLeft: '4px solid #3b82f6'
                            }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e40af', marginBottom: '0.25rem' }}>
                                    🚚 Shipment Status Across All Users
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#2563eb' }}>
                                    Real-time tracking of crop movement
                                </p>
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {shipments.map((shipment, index) => (
                                    <div key={index} className="detail-card" style={{
                                        background: 'white',
                                        borderLeft: `3px solid ${shipment.status === 'DELIVERED' ? '#059669' :
                                            shipment.status === 'IN_TRANSIT' ? '#3b82f6' :
                                                '#f59e0b'
                                            }`
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <div>
                                                <p style={{ fontWeight: '700', fontSize: '0.875rem', color: '#111827' }}>
                                                    {shipment.location}
                                                </p>
                                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                    {shipment.conditionData || 'No condition data'}
                                                </p>
                                            </div>
                                            <span className={`status-badge status-${shipment.status?.toLowerCase()}`}>
                                                {shipment.status}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                            📅 {new Date(shipment.timestamp).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                        <button className="btn btn-primary" onClick={onClose}>
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

ProductDetailsModal.propTypes = {
    product: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    history: PropTypes.array,
    shipments: PropTypes.array
};
