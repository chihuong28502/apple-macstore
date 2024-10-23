export class UpdateRecommendationDto {
  readonly recommendedProducts?: {
    productId: string;
    reason: string;
  }[];
}
