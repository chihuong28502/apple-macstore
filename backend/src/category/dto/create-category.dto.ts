export class CreateCategoryDto {
  readonly name: string;
  readonly description?: string;
  parentCategoryId?: any;
  breadcrumbs?: string[];
}
