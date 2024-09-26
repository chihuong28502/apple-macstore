export class CreateCategoryDto {
  readonly name: string;
  readonly description?: string;
  readonly parentId?: string;  // Optional reference to parent category
}
