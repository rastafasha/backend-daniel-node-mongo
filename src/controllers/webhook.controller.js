const Profile = require('../models/profile');
const Pago = require('../models/pago');
const Subcriptionpaypal = require('../models/subcriptionPaypal');

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
                    'P-8CJ06585H1246910MMSOZQNA': 'Plan Mensual',
                    'P-0H354334ME8148454MTFK3YI': 'Plan Trimestral',
                    'P-1PJ18025B84179353MTF4PKQ': 'Plan Anual'
                };
                const idPerfil = resource.custom_id; // Es el '69eaab...' de tu imagen
                const subIdPaypal = resource.id;    // Es el 'I-ASP5X...' de tu imagen

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
                const nuevaSub = await Subcriptionpaypal.create({
                    email: resource.subscriber.email_address, // sb-oxcit... de tu imagen
                    monto: resource.billing_info?.last_payment?.amount?.value || 0,
                    orderID: subIdPaypal,
                    payerID: resource.subscriber.payer_id,
                    plan_id: resource.plan_id,
                    status: 'ACTIVE',
                    usuario: idPerfil, // Lo vinculamos al perfil directamente
                    create_time: resource.create_time
                });

                // Luego lo vinculas al perfil
                await Profile.findByIdAndUpdate(idPerfil, {
                    paypalSubscriptionId: subIdPaypal,
                    plan: 'Plan Mensual', // O el mapeo que ya tienes
                    $push: { subcription: nuevaSub._id } // IMPORTANTE: Metemos el ID en el array
                });
                console.log(`Perfil actualizado a ${planComprado}: ${resource.id}`);
                break;
            case 'PAYMENT.SALE.COMPLETED':
                // Para los cobros mensuales de la suscripción
                const subId = resource.billing_agreement_id;

                try {
                    const profile = await Profile.findOne({ paypalSubscriptionId: subId });

                    if (profile) {
                        const nuevoPagoMensual = await Pago.create({
                            referencia: resource.id, // ID de la transacción mensual
                            monto: parseFloat(resource.amount.total),
                            usuario: profile.usuario,
                            status: 'SUCCESS',
                            validacion: 'COMPLETED',
                            // Importante: vinculamos este pago a la suscripción
                            subcriptionPaypal: profile.subcription[0]
                        });

                        profile.pagos.push(nuevoPagoMensual._id);
                        await profile.save();

                        console.log(`Mensualidad registrada para suscripción: ${subId}`);
                    }
                } catch (err) {
                    console.error("Error al procesar pago de suscripción:", err);
                }
                break;

            // --- CASO COMPRAS ÚNICAS (Ej: Acceso de por vida o eBook) ---
            case 'PAYMENT.CAPTURE.COMPLETED':
                // Separamos los IDs que vienen en el custom_id (Ej: "IDPERFIL|IDBLOG")
                const [perfilId, blogId] = resource.custom_id.split('|');
                const idTransaccion = resource.id;

                try {
                    const profile = await Profile.findById(idDelPerfil);

                    if (profile) {
                        const nuevoPago = await Pago.create({
                            referencia: idTransaccion,
                            monto: parseFloat(resource.amount.value),
                            usuario: profile.usuario,
                            status: 'SUCCESS',
                            validacion: 'COMPLETED',
                            // Ahora sí usamos el ID que extrajimos del custom_id
                            blog: blogId ? [blogId] : [],
                        });

                        profile.pagos.push(nuevoPago._id);
                        await profile.save();

                        console.log(`Pago único registrado para blog: ${idDelBlogComprado}`);
                    }
                } catch (err) {
                    console.error("Error al procesar el pago único:", err);
                }
                break;



        }
    } catch (error) {
        console.error('Error procesando Webhook:', error);
    }
};

module.exports = { handlePaypalWebhook };
