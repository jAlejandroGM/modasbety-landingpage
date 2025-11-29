export const SITE_INFO = {
  name: "Modas Bety",
  title: "Modas Bety - Alta costura con identidad",
  description:
    "Taller de alta costura y confección a medida para damas en Trujillo, Perú. Elegancia, estilo y calidad en cada prenda.",
  url: "http://modasbety.vercel.app/",
  author: {
    name: "alguzdev",
    url: "https://alguzdev.vercel.app/",
  },
};

export const CONTACT_INFO = {
  phone: "947620202",
  phonePretty: "+51 947 620 202",
  whatsappNumber: "51947620202",
  address: {
    street: "Calle José Dolores López 315",
    urbanization: "Urb. Santa María 5ta Etapa",
    city: "Trujillo",
    region: "La Libertad",
    country: "PE",
    postalCode: "13007",
  },
  coordinates: {
    lat: -8.12625418134591,
    lng: -79.02167642241776,
  },
  schedule: {
    days: "Lunes a Sábado",
    morning: "9:00 AM a 12:00 PM",
    afternoon: "3:00 PM a 8:00 PM",
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.756513698254!2d-79.02167642241776!3d-8.12625418134591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ad17790af131f7%3A0xc77d68ccfcf3cee2!2sModas%20Bety!5e0!3m2!1sen!2spe!4v1755303610052!5m2!1sen!2spe",
  mapDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=-8.12625418134591,-79.02167642241776",
};

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/ModasBetyConfecciones",
  instagram: "https://www.instagram.com/modasbety_",
  whatsapp: (message = "") =>
    `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`,
};

export const MESSAGES = {
  whatsappDefault:
    "¡Hola! Vengo de su página web y me gustaría recibir información sobre sus servicios de confección a medida",
  whatsappCta:
    "¡Hola! Me interesa conocer más sobre sus servicios de confección. ¿Podrían proporcionarme información detallada?",
};
