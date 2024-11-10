import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RulesGuard } from 'src/common/guards/auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { CreateMultipleProductsDto } from './dto/create-multi.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@UseGuards(JwtAuthGuard, RulesGuard)
@Roles('admin')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  //VARIANT
  @Public()
  @Get('variant')
  async getAllVariants(
    @Res() res: Response,
    @Query('productId') productId: string,
  ) {
    const result = await this.productService.getAllVariants(productId);
    return res.status(result.success ? 200 : 500).json(result);
  }
  
  @Post("variant")
  async createVariant(
    @Body() createVariant: any,
    @Res() res: Response
  ) {
    const result = await this.productService.createVariant(createVariant);
    return res.status(result.success ? 201 : 400).json(result);
  }
  @Put('variant/update/:id')
  async updateVariant(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateVariantDto: any
  ) {
    const result = await this.productService.updateVariant(id, updateVariantDto);
    let statusCode = 200;
    if (!result.success) {
      statusCode = result.message.includes('not found') ? 404 : 500;
    }
    return res.status(statusCode).json(result);
  }

  @Delete('variant/delete/:id')
  async removeVariant(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const result = await this.productService.removeVariant(id);
    let statusCode = 200;
    if (!result.success) {
      statusCode = result.message.includes('not found') ? 404 : 500;
    }
    return res.status(statusCode).json(result);
  }
  ////////////////////////////////////////////////////////////////

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response
  ) {
    const result = await this.productService.create(createProductDto);
    return res.status(result.success ? 201 : 400).json(result);
  }

  @Post('create-multiple')
  async createMultiple(
    @Body() createMultipleProductsDto: CreateMultipleProductsDto,
    @Res() res: Response
  ) {
    const result = await this.productService.createMultiple(createMultipleProductsDto);
    return res.status(result.success ? 201 : 400).json(result);
  }

  @Public()
  @Get()
  async getAllProducts(
    @Res() res: Response,
    @Query('categoryId') categoryId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('minPrice') minPrice: number = 0,
    @Query('maxPrice') maxPrice: number = 10000000000
  ) {
    const result = await this.productService.getAllProducts(page, categoryId, limit, minPrice, maxPrice);
    return res.status(result.success ? 200 : 500).json(result);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const result = await this.productService.findOne(id);
    let statusCode = 200;
    if (!result.success) {
      statusCode = result.message.includes('not found') ? 404 : 500;
    }
    return res.status(statusCode).json(result);
  }

  @Put('update/:id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    const result = await this.productService.update(id, updateProductDto);
    let statusCode = 200;
    if (!result.success) {
      statusCode = result.message.includes('not found') ? 404 : 500;
    }
    return res.status(statusCode).json(result);
  }

  @Delete('delete/:id')
  async remove(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const result = await this.productService.remove(id);
    let statusCode = 200;
    if (!result.success) {
      statusCode = result.message.includes('not found') ? 404 : 500;
    }
    return res.status(statusCode).json(result);
  }

}



// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   Put,
//   Query,
//   Res,
//   UseGuards
// } from '@nestjs/common';
// import { Response } from 'express';
// import { Public } from 'src/common/decorators/public.decorator';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RulesGuard } from 'src/common/guards/auth.guard';
// import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
// import { CreateMultipleProductsDto } from './dto/create-multi.dto';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
// import { ProductService } from './product.service';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

// @UseGuards(JwtAuthGuard, RulesGuard)
// @Roles('admin')
// @Controller('products')
// export class ProductController {
//   constructor(
//     private readonly productService: ProductService ,
//     private readonly cloudinaryService: CloudinaryService

//   ) { }

//   @Post()
//   async create(
//     @Body() createProductDto: CreateProductDto,
//     @Res() res: Response
//   ) {
//     try {
//       const uploadResults = await Promise.all(
//         createProductDto.images.map(async (image) => {
//           // Nếu image là buffer (ví dụ: gửi từ body dưới dạng binary), thì upload
//           if (Buffer.isBuffer(image)) {
//             return this.cloudinaryService.uploadMedia(image, 'APPLE_STORE', 'image');
//           }
//         })
//       );
  
//       // Lọc ra các URL thành công
//       const imageUrls = uploadResults
//         .filter(result => result.success)
//         .map(result => result.data.url);
  
//       const productData: CreateProductDto = {
//         ...createProductDto,
//         images: imageUrls,
//       };
  
//       const result = await this.productService.create(productData);
//       return res.status(result.success ? 201 : 400).json(result);
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: 'An error occurred while creating the product',
//         error: error.message,
//       });
//     }
//   }
  

//   @Post('create-multiple')
//   async createMultiple(
//     @Body() createMultipleProductsDto: CreateMultipleProductsDto,
//     @Res() res: Response
//   ) {
//     const result = await this.productService.createMultiple(createMultipleProductsDto);
//     return res.status(result.success ? 201 : 400).json(result);
//   }

//   @Public()
//   @Get()
//   async getAllProducts(
//     @Res() res: Response,
//     @Query('categoryId') categoryId: string,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 10,
//     @Query('minPrice') minPrice?: number,
//     @Query('maxPrice') maxPrice?: number
//   ) {
//     const result = await this.productService.getAll(page, categoryId, limit, minPrice, maxPrice);
//     return res.status(result.success ? 200 : 500).json(result);
//   }

//   @Public()
//   @Get(':id')
//   async findOne(
//     @Res() res: Response,
//     @Param('id') id: string
//   ) {
//     const result = await this.productService.findOne(id);
//     let statusCode = 200;
//     if (!result.success) {
//       statusCode = result.message.includes('not found') ? 404 : 500;
//     }
//     return res.status(statusCode).json(result);
//   }

//   @Put('update/:id')
//   async update(
//     @Res() res: Response,
//     @Param('id') id: string,
//     @Body() updateProductDto: UpdateProductDto
//   ) {
//     const result = await this.productService.update(id, updateProductDto);
//     let statusCode = 200;
//     if (!result.success) {
//       statusCode = result.message.includes('not found') ? 404 : 500;
//     }
//     return res.status(statusCode).json(result);
//   }

//   @Delete('delete/:id')
//   async remove(
//     @Res() res: Response,
//     @Param('id') id: string
//   ) {
//     const result = await this.productService.remove(id);
//     let statusCode = 200;
//     if (!result.success) {
//       statusCode = result.message.includes('not found') ? 404 : 500;
//     }
//     return res.status(statusCode).json(result);
//   }
// }