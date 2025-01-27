export const createReservation = async (reservationData) => {
    // Simuleerib edukat broneeringut
    console.log('Reservation would be created with:', reservationData);
    return {
        success: true,
        message: 'Broneering edukalt tehtud!',
        data: reservationData
    };
};

export const getReservations = async (priceListId) => {
    try {
        const response = await fetch(`/api/reservations/${priceListId}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Viga reservatsioonide laadimisel');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
