export class CreateRecommendationDto {
  readonly userId: string;
  readonly recommendedProducts: {
    productId: string;
    reason: string;
  }[];
}
