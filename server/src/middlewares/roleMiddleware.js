/**
 * 
 * @param  {...string} allowedRoles -
 */
exports.checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        
        if (!req.user) {
            return res.status(401).json({ message: 'Akses ditolak. Anda belum login.' });
        }

        
        const hasRole = allowedRoles.includes(req.user.role);

        if (!hasRole) {
            return res.status(403).json({ 
                message: 'Akses terlarang! Anda tidak memiliki izin untuk mengakses halaman ini.' 
            });
        }

        
        next();
    };
};