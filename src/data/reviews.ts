export type GoogleReview = Readonly<{
  author: string;
  excerpt: string;
  url: string;
}>;

export const googleBusinessProfileUrl = process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL;

// Cadastre somente trechos conferidos no perfil da Vercuno, com o link da avaliação original.
export const googleReviews: readonly GoogleReview[] = [];
