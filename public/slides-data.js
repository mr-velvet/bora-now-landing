export const config = {
  meta: {
    title: "bora.now",
    font: "Inter",
  },
  defaults: { theme: "light" },
  slides: [
    {
      id: "hero",
      type: "hero",
      theme: "light",
      content: {
        eyebrow: "2026",
        tagline: "BORA.NOW",
        brand: "BORA.NOW",
        title: "*bora.\n*now.",
      },
    },
    {
      id: "cta",
      type: "cta-form",
      theme: "light",
      content: {
        title: "*bora.",
        brand: "bora.now",
        placeholder: "seu@email.com",
        buttonLabel: "Quero participar",
      },
    },
  ],
};
