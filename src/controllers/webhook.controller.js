const Profile = require('../models/profile'); // Ajusta la ruta a tu modelo

const handlePaypalWebhook = async (req, res) => {
    const { event_type, resource } = req.body;
    res.status(200).send('OK');

    try {
        switch (event_type) {
            case 'BILLING.SUBSCRIPTION.ACTIVATED':
                await Profile.findOneAndUpdate(
                    { paypalSubscriptionId: resource.id }, 
                    { plan: 'premium' }
                );
                console.log(`Perfil Premium activado: ${resource.id}`);
                break;

            case 'BILLING.SUBSCRIPTION.CANCELLED':
            case 'BILLING.SUBSCRIPTION.EXPIRED':
                await Profile.findOneAndUpdate(
                    { paypalSubscriptionId: resource.id },
                    { 
                        plan: 'free', 
                        articulosVistos: 0 // Reiniciamos al volver a gratis
                    }
                );
                console.log(`Perfil vuelto a Free: ${resource.id}`);
                break;
        }
    } catch (error) {
        console.error('Error procesando Webhook:', error);
    }
};

module.exports = { 
    handlePaypalWebhook 
};
