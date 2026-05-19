/**
 
 * @param {string} dateString 
 * @returns {string} 
 */
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

/**
 
 * @param {string} status 
   @returns {string} 
 */
export const getStatusBadgeStyle = (status) => {
    const baseStyle = "inline-flex items-center justify-center font-text text-[12px] font-semibold px-3 py-1 rounded-full capitalize";
    
    switch (status?.toLowerCase()) {
        case 'menunggu':
            
            return `${baseStyle} bg-[#EDEDF2] text-[#333336]`;
        case 'diproses':
            
            return `${baseStyle} bg-[#0071E3]/10 text-[#0071E3]`;
        case 'disetujui':
        case 'selesai':
            
            return `${baseStyle} bg-green-100 text-green-800`;
        case 'ditolak':
            
            return `${baseStyle} bg-red-100 text-red-700`;
        default:
            return `${baseStyle} bg-[#EDEDF2] text-[#6E6E73]`;
    }
};