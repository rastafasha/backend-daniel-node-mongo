const Profile = require('../models/profile');

const handlePaypalWebhook = async (req, res) => {
    const { event_type, resource } = req.body;
    
    // 1. Responder siempre 200 rápido para que PayPal no reintente
    res.status(200).send('OK');

    try {
        switch (event_type) {
            case 'BILLING.SUBSCRIPTION.ACTIVATED':
                // Mapeo de IDs de PayPal a tus nombres internos
                // Sustituye 'P-XXXX' por los IDs reales de tu dashboard de PayPal
                const planMapping = {
                    'P-8CJ06585H1246910MMSOZQNA': 'mensual',
                    'P-0H354334ME8148454MTFK3YI': 'trimestral',
                    'P-1PJ18025B84179353MTF4PKQ': 'anual'
                };

                const planComprado = planMapping[resource.plan_id] || 'premium'; // 'premium' por defecto

                let profile = await Profile.findOneAndUpdate(
                    { paypalSubscriptionId: resource.id },
                    { plan: planComprado }
                );

                if (!profile && resource.subscriber && resource.subscriber.email_address) {
                    profile = await Profile.findOneAndUpdate(
                        { email: resource.subscriber.email_address },
                        { 
                            plan: planComprado, 
                            paypalSubscriptionId: resource.id 
                        }
                    );
                }
                console.log(`Perfil actualizado a ${planComprado}: ${resource.id}`);
                break;

            case 'BILLING.SUBSCRIPTION.CANCELLED':
            case 'BILLING.SUBSCRIPTION.EXPIRED':
            case 'BILLING.SUBSCRIPTION.SUSPENDED': // Agregado por seguridad
                await Profile.findOneAndUpdate(
                    { paypalSubscriptionId: resource.id },
                    { plan: 'free', articulosVistos: 0 }
                );
                console.log(`Suscripción terminada: ${resource.id}`);
                break;
        }
    } catch (error) {
        console.error('Error procesando Webhook:', error);
    }
};

module.exports = { handlePaypalWebhook };
